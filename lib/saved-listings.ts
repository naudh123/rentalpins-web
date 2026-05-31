import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  deleteDoc,
  where,
  type Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import { trackListingSaved } from "./ga4";

export interface SavedListing {
  id: string;
  userId: string;
  listingId: string;
  savedAtMs: number;
}

const COLLECTION = "saved_listings";

function tsToMs(v: unknown): number {
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export function savedListingDocId(listingId: string, userId: string): string {
  return `${listingId}_${userId}`;
}

function docToSavedListing(id: string, data: DocumentData): SavedListing {
  return {
    id,
    userId: String(data.userId ?? ""),
    listingId: String(data.listingId ?? ""),
    savedAtMs: tsToMs(data.savedAt),
  };
}

export function subscribeSavedListings(
  userId: string,
  onChange: (items: SavedListing[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(getClientDb(), COLLECTION),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => docToSavedListing(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

export async function saveListing(userId: string, listingId: string): Promise<void> {
  const ref = doc(getClientDb(), COLLECTION, savedListingDocId(listingId, userId));
  await setDoc(
    ref,
    {
      userId,
      listingId,
      savedAt: serverTimestamp(),
      source: "web",
    },
    { merge: true }
  );
  trackListingSaved(listingId);
}

export async function unsaveListing(userId: string, listingId: string): Promise<void> {
  const ref = doc(getClientDb(), COLLECTION, savedListingDocId(listingId, userId));
  await deleteDoc(ref);
}

