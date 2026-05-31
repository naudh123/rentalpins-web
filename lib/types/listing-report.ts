export const LISTING_REPORT_REASONS = [
  { value: "scam", label: "Scam or misleading" },
  { value: "wrong_location", label: "Wrong location" },
  { value: "spam", label: "Spam or duplicate" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "rented", label: "Already rented / unavailable" },
  { value: "other", label: "Other" },
] as const;

export type ListingReportReason = (typeof LISTING_REPORT_REASONS)[number]["value"];

export type ListingReportStatus = "open" | "reviewed" | "dismissed";

export interface ListingReportInput {
  listingId: string;
  listingTitle: string;
  ownerUid: string;
  reason: ListingReportReason;
  details?: string;
}
