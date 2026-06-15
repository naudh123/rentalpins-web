"use client";

import { useCallback, type MutableRefObject } from "react";
import {
  type ListingFilters,
} from "@/lib/listing-filters";
import { resetListingFilters } from "@/lib/listing-filter-reset";
import type { MapAreaShape } from "@/lib/map-area";
import { trackEvent } from "@/lib/ga4";

interface Options {
  activeFilterCount: number;
  drawnShape: MapAreaShape | null;
  keywordsActive: boolean;
  filtersRef: MutableRefObject<ListingFilters>;
  drawnShapeRef: MutableRefObject<MapAreaShape | null>;
  selectedIdRef: MutableRefObject<string | null>;
  setFilters: React.Dispatch<React.SetStateAction<ListingFilters>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  setDrawnShape: React.Dispatch<React.SetStateAction<MapAreaShape | null>>;
  scheduleUrlSync: () => void;
  syncUrlNow: (nextFilters?: ListingFilters) => void;
  clearKeywordFilter: (source?: "chip" | "empty_state") => void;
}

/** Filter, keyword, and draw-area change handlers for SearchMap. */
export function useMapFilterActions({
  activeFilterCount,
  drawnShape,
  keywordsActive,
  filtersRef,
  drawnShapeRef,
  selectedIdRef,
  setFilters,
  setSelectedId,
  setDrawnShape,
  scheduleUrlSync,
  syncUrlNow,
  clearKeywordFilter,
}: Options) {
  const handleFiltersChange = useCallback(
    (next: ListingFilters) => {
      const hadSelection = Boolean(selectedIdRef.current);
      if (hadSelection) {
        setSelectedId(null);
        selectedIdRef.current = null;
        trackEvent("map_selection_cleared", { reason: "filters_changed" });
      }
      setFilters(next);
      filtersRef.current = next;
      if (hadSelection) syncUrlNow(next);
      else scheduleUrlSync();
    },
    [filtersRef, scheduleUrlSync, selectedIdRef, setFilters, setSelectedId, syncUrlNow]
  );

  const clearFiltersOnly = useCallback(() => {
    if (activeFilterCount === 0) return;
    handleFiltersChange(resetListingFilters(filtersRef.current.transactionType));
    trackEvent("map_filters_cleared", { source: "empty_state" });
  }, [activeFilterCount, filtersRef, handleFiltersChange]);

  const clearKeywordsFromEmpty = useCallback(() => {
    if (!keywordsActive) return;
    clearKeywordFilter("empty_state");
  }, [clearKeywordFilter, keywordsActive]);

  const handleDrawnShapeChange = useCallback(
    (shape: MapAreaShape | null) => {
      setDrawnShape(shape);
      drawnShapeRef.current = shape;
      scheduleUrlSync();
    },
    [drawnShapeRef, scheduleUrlSync, setDrawnShape]
  );

  const clearDrawnAreaFromEmpty = useCallback(() => {
    if (!drawnShape) return;
    handleDrawnShapeChange(null);
    trackEvent("map_drawn_area_cleared", { source: "empty_state" });
  }, [drawnShape, handleDrawnShapeChange]);

  return {
    handleFiltersChange,
    clearFiltersOnly,
    clearKeywordsFromEmpty,
    handleDrawnShapeChange,
    clearDrawnAreaFromEmpty,
  };
}
