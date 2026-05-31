"use client";

import { useCallback } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { trackEvent } from "@/lib/ga4";

interface Options {
  selected: ListingCardData | null | undefined;
  selectedBuildingListings: ListingCardData[] | null;
  clearSelection: () => void;
  focusListingOnPage: (
    listing: ListingCardData,
    source?: "pin" | "list" | "keyboard" | "hover"
  ) => void;
}

/** Tracked close handlers for map listing / building preview cards. */
export function useMapListingPreviewActions({
  selected,
  selectedBuildingListings,
  clearSelection,
  focusListingOnPage,
}: Options) {
  const onClosePreview = useCallback(() => {
    if (selected) {
      trackEvent("map_listing_preview_closed", { listing_id: selected.id });
    }
    clearSelection();
  }, [clearSelection, selected]);

  const onCloseBuildingPreview = useCallback(() => {
    if (selectedBuildingListings) {
      trackEvent("map_listing_preview_closed", {
        listing_id: selectedBuildingListings[0].id,
        preview: "building",
      });
    }
    clearSelection();
  }, [clearSelection, selectedBuildingListings]);

  const onSelectBuildingUnit = useCallback(
    (listing: ListingCardData) => focusListingOnPage(listing, "pin"),
    [focusListingOnPage]
  );

  return { onClosePreview, onCloseBuildingPreview, onSelectBuildingUnit };
}
