import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import type { ListingReview } from "./types/listing-review";

const COLLECTION = "listing_reviews";

function tsToMs(v: unknown): number {
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

function toListingReview(id: string, data: Record<string, unknown>): ListingReview {
  return {
    id,
    listingId: String(data.listingId ?? ""),
    reviewerUid: String(data.reviewerUid ?? ""),
    reviewerName: String(data.reviewerName ?? "Member"),
    rating:
      typeof data.rating === "number" && data.rating >= 1 && data.rating <= 5
        ? data.rating
        : 0,
    comment: String(data.comment ?? ""),
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
  };
}

export function reviewDocId(listingId: string, reviewerUid: string): string {
  return `${listingId}_${reviewerUid}`;
}

export function subscribeListingReviews(
  listingId: string,
  onChange: (reviews: ListingReview[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(getClientDb(), COLLECTION),
    where("listingId", "==", listingId),
    orderBy("updatedAt", "desc"),
    limit(20)
  );
  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs
          .map((d) => toListingReview(d.id, d.data()))
          .filter((r) => r.rating >= 1 && r.rating <= 5)
      );
    },
    (err) => onError?.(err)
  );
}

export async function upsertListingReview(input: {
  listingId: string;
  reviewerUid: string;
  reviewerName: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const ref = doc(
    getClientDb(),
    COLLECTION,
    reviewDocId(input.listingId, input.reviewerUid)
  );
  await setDoc(
    ref,
    {
      listingId: input.listingId,
      reviewerUid: input.reviewerUid,
      reviewerName: input.reviewerName.trim().slice(0, 60) || "Member",
      rating: Math.max(1, Math.min(5, Math.round(input.rating))),
      comment: (input.comment || "").trim().slice(0, 300),
      source: "web",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
