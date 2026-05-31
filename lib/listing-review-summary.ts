import { adminDb } from "./firebase-admin";

export interface ListingReviewSummary {
  count: number;
  avgRating: number;
}

/** Server-side aggregate for SEO JSON-LD (best-effort). */
export async function fetchListingReviewSummary(
  listingId: string
): Promise<ListingReviewSummary | null> {
  try {
    const snap = await adminDb
      .collection("listing_reviews")
      .where("listingId", "==", listingId)
      .limit(100)
      .get();

    const ratings: number[] = [];
    snap.forEach((doc) => {
      const rating = doc.data().rating;
      if (typeof rating === "number" && rating >= 1 && rating <= 5) {
        ratings.push(rating);
      }
    });

    if (!ratings.length) return null;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return { count: ratings.length, avgRating: sum / ratings.length };
  } catch (err) {
    console.error("fetchListingReviewSummary:", err);
    return null;
  }
}
