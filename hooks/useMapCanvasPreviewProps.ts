"use client";

import { useMemo } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { useMapListingPreviewActions } from "@/hooks/useMapListingPreviewActions";

interface Options {
  selected: ListingCardData | null | undefined;
  selectedBuildingListings: ListingCardData[] | null;
  showBuildingPreview: boolean;
  clearSelection: () => void;
  focusListingOnPage: (
    listing: ListingCardData,
    source?: "pin" | "list" | "keyboard" | "hover"
  ) => void;
}

/** Memoized listing / building preview props for MapCanvas. */
export function useMapCanvasPreviewProps({
  selected,
  selectedBuildingListings,
  showBuildingPreview,
  clearSelection,
  focusListingOnPage,
}: Options) {
  const { onClosePreview, onCloseBuildingPreview, onSelectBuildingUnit } =
    useMapListingPreviewActions({
      selected,
      selectedBuildingListings,
      clearSelection,
      focusListingOnPage,
    });

  return useMemo(
    () => ({
      selected,
      selectedBuildingListings,
      showBuildingPreview,
      onClosePreview,
      onCloseBuildingPreview,
      onSelectBuildingUnit,
    }),
    [
      selected,
      selectedBuildingListings,
      showBuildingPreview,
      onClosePreview,
      onCloseBuildingPreview,
      onSelectBuildingUnit,
    ]
  );
}
