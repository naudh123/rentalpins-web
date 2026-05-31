import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import type { SearchAlert } from "./types/search-alert";

const COLLECTION = "search_alerts";

function tsToMs(v: unknown): number {
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

function docToSearchAlert(id: string, data: Record<string, unknown>): SearchAlert {
  return {
    id,
    userId: String(data.userId ?? ""),
    savedSearchId: String(data.savedSearchId ?? ""),
    savedSearchName: String(data.savedSearchName ?? "Saved search"),
    listingId: String(data.listingId ?? ""),
    listingTitle: String(data.listingTitle ?? "New listing"),
    listingPrice: typeof data.listingPrice === "number" ? data.listingPrice : 0,
    listingImageUrl: String(data.listingImageUrl ?? ""),
    read: data.read === true,
    createdAtMs: tsToMs(data.createdAt),
    coverageMayBeIncomplete: data.coverageMayBeIncomplete === true,
  };
}

export function subscribeSearchAlerts(
  userId: string,
  onChange: (alerts: SearchAlert[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(getClientDb(), COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => docToSearchAlert(d.id, d.data())));
    },
    (err) => onError?.(err)
  );
}

export async function markSearchAlertRead(alertId: string): Promise<void> {
  await updateDoc(doc(getClientDb(), COLLECTION, alertId), { read: true });
}

export async function markAllSearchAlertsRead(alertIds: string[]): Promise<void> {
  const ids = [...new Set(alertIds)].filter(Boolean);
  if (!ids.length) return;
  await Promise.all(ids.map((id) => markSearchAlertRead(id)));
}

export async function dismissSearchAlert(alertId: string): Promise<void> {
  await deleteDoc(doc(getClientDb(), COLLECTION, alertId));
}

export function countUnreadAlerts(alerts: SearchAlert[]): number {
  return alerts.filter((a) => !a.read).length;
}
