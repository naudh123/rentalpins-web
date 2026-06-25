import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import type {
  BuyerRequirement,
  CreateBuyerRequirementInput,
} from "./types/buyer-requirement";

const COLLECTION = "buyer_requirements";

function tsToMs(v: unknown): number {
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export function formatBudgetLabel(
  budgetMin: number | null,
  budgetMax: number | null
): string {
  const fmt = (n: number): string => {
    if (n >= 1_00_00_000) {
      const cr = n / 1_00_00_000;
      return `₹${Number.isInteger(cr) ? cr : cr.toFixed(1)}Cr`;
    }
    if (n >= 1_00_000) return `₹${Math.round(n / 1_00_000)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };
  if (budgetMin != null && budgetMax != null) {
    return `${fmt(budgetMin)} – ${fmt(budgetMax)}`;
  }
  if (budgetMax != null) return `Up to ${fmt(budgetMax)}`;
  if (budgetMin != null) return `${fmt(budgetMin)}+`;
  return "Budget flexible";
}

function docToRequirement(id: string, data: Record<string, unknown>): BuyerRequirement {
  const budgetMin = typeof data.budgetMin === "number" ? data.budgetMin : null;
  const budgetMax = typeof data.budgetMax === "number" ? data.budgetMax : null;
  return {
    id,
    userId: (data.userId as string) || "",
    propertyType: (data.propertyType as string) || "Property",
    budgetMin,
    budgetMax,
    budgetLabel:
      typeof data.budgetLabel === "string" && data.budgetLabel.trim()
        ? data.budgetLabel.trim()
        : formatBudgetLabel(budgetMin, budgetMax),
    city: (data.city as string) || "",
    locality: (data.locality as string) || "",
    timeline: (data.timeline as string) || "Flexible",
    purpose: (data.purpose as BuyerRequirement["purpose"]) || "Self use",
    notes: typeof data.notes === "string" && data.notes.trim() ? data.notes.trim() : null,
    isActive: data.isActive !== false,
    source: "web",
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
  };
}

export async function createBuyerRequirement(
  userId: string,
  input: CreateBuyerRequirementInput
): Promise<string> {
  const budgetLabel = formatBudgetLabel(input.budgetMin, input.budgetMax);
  const ref = await addDoc(collection(getClientDb(), COLLECTION), {
    userId,
    propertyType: input.propertyType.trim(),
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    budgetLabel,
    city: input.city.trim(),
    locality: input.locality.trim(),
    timeline: input.timeline.trim(),
    purpose: input.purpose,
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    isActive: true,
    source: "web",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deactivateBuyerRequirement(id: string): Promise<void> {
  await updateDoc(doc(getClientDb(), COLLECTION, id), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBuyerRequirement(id: string): Promise<void> {
  await deleteDoc(doc(getClientDb(), COLLECTION, id));
}

/** Public board — active requirements, newest first. */
export function subscribePublicRequirements(
  onChange: (items: BuyerRequirement[]) => void,
  opts?: { city?: string; max?: number },
  onError?: (err: Error) => void
): () => void {
  const constraints = [
    where("isActive", "==", true),
    ...(opts?.city ? [where("city", "==", opts.city)] : []),
    orderBy("createdAt", "desc"),
    limit(opts?.max ?? 24),
  ];

  const q = query(collection(getClientDb(), COLLECTION), ...constraints);

  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => docToRequirement(d.id, d.data())));
    },
    (err) => onError?.(err)
  );
}

/** One-shot fetch for SSR fallbacks / tests. */
export async function fetchPublicRequirements(opts?: {
  city?: string;
  max?: number;
}): Promise<BuyerRequirement[]> {
  const constraints = [
    where("isActive", "==", true),
    ...(opts?.city ? [where("city", "==", opts.city)] : []),
    orderBy("createdAt", "desc"),
    limit(opts?.max ?? 24),
  ];
  const snap = await getDocs(query(collection(getClientDb(), COLLECTION), ...constraints));
  return snap.docs.map((d) => docToRequirement(d.id, d.data()));
}

export function subscribeUserRequirements(
  userId: string,
  onChange: (items: BuyerRequirement[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(getClientDb(), COLLECTION),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => docToRequirement(d.id, d.data()))),
    (err) => onError?.(err)
  );
}
