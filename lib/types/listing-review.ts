export interface ListingReview {
  id: string;
  listingId: string;
  reviewerUid: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAtMs: number;
  updatedAtMs: number;
}
