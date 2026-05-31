"use client";

import { useMemo } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import type { MapAreaShape } from "@/lib/map-area";
import { isLikelyGeohashPrefixCapped } from "@/lib/geohash-bounds";
import { useStableMapCountInfo } from "@/hooks/useStableMapCountInfo";
import type { MapBounds } from "@/lib/types/saved-search";

interface Options {
  listings: ListingCardData[];
  filteredListings: ListingCardData[];
  drawnShape: MapAreaShape | null;
  totalInBounds: number;
  loading: boolean;
  refreshing: boolean;
  resultsMayBeIncomplete: boolean;
  serverPrefixCapActive?: boolean | null;
  mapZoom: number;
  mapBounds: MapBounds | null;
  activeFilterCount: number;
  textQuery: string;
  fetchError: string;
  selected: ListingCardData | null;
}

export function useMapResultsMeta({
  listings,
  filteredListings,
  drawnShape,
  totalInBounds,
  loading,
  refreshing,
  resultsMayBeIncomplete,
  serverPrefixCapActive = null,
  mapZoom,
  mapBounds,
  activeFilterCount,
  textQuery,
  fetchError,
  selected,
}: Options) {
  const prefixCapActive = useMemo(() => {
    if (serverPrefixCapActive != null) return serverPrefixCapActive;
    return mapBounds ? isLikelyGeohashPrefixCapped(mapBounds, mapZoom) : false;
  }, [serverPrefixCapActive, mapBounds, mapZoom]);

  const resultsCountInfo = useStableMapCountInfo({
    resultCount: listings.length,
    totalInBounds: drawnShape ? filteredListings.length : totalInBounds,
    loading,
    refreshing,
    resultsMayBeIncomplete,
    mapZoom,
    mapBounds,
    filtersActive: activeFilterCount > 0,
    clientFilterActive: Boolean(textQuery.trim() || drawnShape),
    prefixCapActive,
  });

  const showListSkeletons = loading && listings.length === 0;

  const mapPinStatusText = useMemo(() => {
    if (loading) return "Loading map pins.";
    if (!listings.length) return "No listing pins in the current map area.";
    if (selected) return `Map pin selected: ${selected.title}.`;
    return `${listings.length} listing pins on map. Use arrow keys to browse.`;
  }, [listings.length, loading, selected]);

  const liveStatusText = useMemo(() => {
    if (loading) return "Loading map results.";
    if (fetchError) return `Could not load listings. ${fetchError}. Use retry to try again.`;
    const base =
      listings.length === 1
        ? "1 listing shown on map."
        : `${listings.length} listings shown on map.`;
    if (selected) {
      return `${base} Selected listing: ${selected.title}.`;
    }
    return base;
  }, [fetchError, listings.length, loading, selected]);

  return {
    resultsCountInfo,
    showListSkeletons,
    mapPinStatusText,
    liveStatusText,
    prefixCapActive,
  };
}
