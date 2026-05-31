"use client";

import { useCallback } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import type { MapListingDisplayItem } from "@/lib/map-building-groups";
import { listingPageForIndex } from "@/lib/map-list-count";

interface Options {
  listDisplayItems: MapListingDisplayItem[];
  listPage: number;
  setListPage: (page: number) => void;
  focusListing: (
    listing: ListingCardData,
    source: "pin" | "list" | "keyboard" | "hover"
  ) => void;
}

/** Focus a listing and jump the paginated list to its page when needed. */
export function useMapFocusListingOnPage({
  listDisplayItems,
  listPage,
  setListPage,
  focusListing,
}: Options) {
  return useCallback(
    (
      listing: ListingCardData,
      source: "pin" | "list" | "keyboard" | "hover" = "list"
    ) => {
      const idx = listDisplayItems.findIndex((item) =>
        item.kind === "single"
          ? item.listing.id === listing.id
          : item.listings.some((l) => l.id === listing.id)
      );
      if (idx >= 0) {
        const page = listingPageForIndex(idx);
        if (page !== listPage) setListPage(page);
      }
      focusListing(listing, source);
    },
    [listDisplayItems, listPage, focusListing, setListPage]
  );
}
