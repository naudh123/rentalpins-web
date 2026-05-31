"use client";

import { useMemo } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { findSelectedBuildingListings } from "@/lib/map-building-groups";
import { MAP_BUILDING_PIN_ZOOM } from "@/lib/map-view-mode";

interface Options {
  selectedId: string | null;
  mapZoom: number;
  listings: ListingCardData[];
  minZoom?: number;
}

/** Selected building group + whether to show the multi-unit preview card. */
export function useMapBuildingPreview({
  selectedId,
  mapZoom,
  listings,
  minZoom = MAP_BUILDING_PIN_ZOOM,
}: Options) {
  const selectedBuildingListings = useMemo(
    () => findSelectedBuildingListings(selectedId, mapZoom, listings, minZoom),
    [selectedId, mapZoom, listings, minZoom]
  );

  const showBuildingPreview =
    selectedBuildingListings != null && selectedBuildingListings.length >= 2;

  return { selectedBuildingListings, showBuildingPreview };
}
