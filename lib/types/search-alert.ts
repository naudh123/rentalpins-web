export interface SearchAlert {
  id: string;
  userId: string;
  savedSearchId: string;
  savedSearchName: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImageUrl: string;
  read: boolean;
  createdAtMs: number;
  /** True when alert cron could not scan every listing in the saved map area. */
  coverageMayBeIncomplete?: boolean;
}
