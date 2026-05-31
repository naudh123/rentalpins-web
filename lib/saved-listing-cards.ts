import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import type { ListingCard } from "./types/listing";

function chunk<T>(arr: T[], size: number): T[][]
{
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function firstString(arr: unknown): string {
  return Array.isArray(arr) && typeof arr[0] === "string" ? arr[0] : "";
}

function sanitizeImageUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const u = raw.trim();
  if (!u.startsWith("https://")) return "";
  try {
    return new URL(u).protocol === "https:" ? u : "";
  } catch {
    return "";
  }
}

function toListingCard(id: string, d: Record<string, unknown>): ListingCard | null {
  const position = d.position as Record<string, unknown> | undefined;
  const geopoint = position?.geopoint as Record<string, unknown> | undefined;
  const lat =
    (geopoint?.latitude as number | undefined) ??
    (geopoint?._latitude as number | undefined);
  const lng =
    (geopoint?.longitude as number | undefined) ??
    (geopoint?._longitude as number | undefined);
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const imageUrl = sanitizeImageUrl(
    firstString(d.imageThumbnails) ||
      firstString(d.imageIcons) ||
      firstString(d.imageUrls) ||
      firstString(d.imagesFull) ||
      ""
  );
  const priceRaw = d.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : parseFloat(String(priceRaw ?? "")) || 0;

  return {
    id,
    title: str(d.title, "Untitled"),
    description: str(d.description),
    price,
    priceUnit: str(d.priceUnit, "per month"),
    category: str(d.category, "Others"),
    subCategory: str(d.subCategory),
    locationName: str(d.locationName),
    imageUrl,
    lat,
    lng,
    isPromoted: d.isPromoted === true,
    viewsCount: typeof d.viewsCount === "number" ? d.viewsCount : 0,
    inquiryCount: typeof d.inquiryCount === "number" ? d.inquiryCount : 0,
    ownerPhone: str(d.ownerPhone),
    homeIso: str(d.homeIso) || str(d.iso) || undefined,
    createdAt:
      (d.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
      new Date().toISOString(),
    updatedAt:
      (d.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
      (d.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
      new Date().toISOString(),
  };
}

function sortByRecent(a: ListingCard, b: ListingCard): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function sortByIdOrder(orderIds: string[]) {
  const rank = new Map(orderIds.map((id, i) => [id, i]));
  return (a: ListingCard, b: ListingCard) =>
    (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999);
}

export function subscribeListingCardsByIds(
  listingIds: string[],
  onChange: (cards: ListingCard[]) => void,
  onError?: (err: Error) => void,
  orderIds?: string[]
): () => void {
  if (!listingIds.length) {
    onChange([]);
    return () => {};
  }

  const ids = [...new Set(listingIds)];
  const groups = chunk(ids, 10);
  const db = getClientDb();
  const latestById = new Map<string, ListingCard>();
  const unsubs: Array<() => void> = [];

  const sortFn = orderIds?.length ? sortByIdOrder(orderIds) : sortByRecent;
  const emit = () => onChange([...latestById.values()].sort(sortFn));

  groups.forEach((idGroup) => {
    const q = query(
      collection(db, "listings"),
      where(documentId(), "in", idGroup)
    );
    const unsub = onSnapshot(
      q,
      (snap: QuerySnapshot<DocumentData>) => {
        const seen = new Set<string>();
        for (const docSnap of snap.docs) {
          seen.add(docSnap.id);
          const raw = docSnap.data() as Record<string, unknown>;
          if (raw.isActive !== true) {
            latestById.delete(docSnap.id);
            continue;
          }
          const card = toListingCard(docSnap.id, raw);
          if (card) latestById.set(docSnap.id, card);
        }
        for (const id of idGroup) {
          if (!seen.has(id)) latestById.delete(id);
        }
        emit();
      },
      (err) => onError?.(err)
    );
    unsubs.push(unsub);
  });

  return () => {
    unsubs.forEach((u) => u());
  };
}

export function subscribeSavedListingCards(
  listingIds: string[],
  onChange: (cards: ListingCard[]) => void,
  onError?: (err: Error) => void
): () => void {
  return subscribeListingCardsByIds(listingIds, onChange, onError);
}

