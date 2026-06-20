import type { OwnerListing } from "@/lib/my-listings";
import { daysUntilMs } from "@/lib/owner-listing-lifecycle";

export interface OwnerPortfolioSummary {
  total: number;
  live: number;
  drafts: number;
  saved: number;
  archived: number;
  totalViews: number;
  totalInquiries: number;
  expiringSoon: number;
}

export function buildOwnerPortfolioSummary(listings: OwnerListing[]): OwnerPortfolioSummary {
  let live = 0;
  let drafts = 0;
  let saved = 0;
  let archived = 0;
  let totalViews = 0;
  let totalInquiries = 0;
  let expiringSoon = 0;

  for (const l of listings) {
    if (l.status === "live") {
      live++;
      totalViews += l.viewsCount;
      totalInquiries += l.inquiryCount;
      const days = daysUntilMs(l.listingExpiresAtMs);
      if (days != null && days <= 3) expiringSoon++;
    } else if (l.status === "draft") {
      drafts++;
    } else if (l.status === "expired" || l.status === "rented") {
      saved++;
    } else if (l.status === "archived") {
      archived++;
    }
  }

  return {
    total: listings.length,
    live,
    drafts,
    saved,
    archived,
    totalViews,
    totalInquiries,
    expiringSoon,
  };
}
