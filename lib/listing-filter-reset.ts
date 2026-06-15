/** Default filters when clearing map filters in sale vs rent mode. */
import {
  DEFAULT_LISTING_FILTERS,
  type ListingFilters,
} from "./listing-filters";
import type { TransactionType } from "./transaction-type";

export function resetListingFilters(
  transactionType: TransactionType = "rent"
): ListingFilters {
  if (transactionType === "sale") {
    return {
      ...DEFAULT_LISTING_FILTERS,
      transactionType: "sale",
      category: "Property",
      tenantPreference: "",
    };
  }
  return { ...DEFAULT_LISTING_FILTERS };
}
