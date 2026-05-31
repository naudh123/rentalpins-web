"use client";

import { useMemo } from "react";
import type { MapEmptyAction, MapEmptyVariant } from "@/lib/map-empty-state";
import type { MapEmptyPanelProps, MapEmptySurfaceProps } from "@/lib/map-empty-props";

interface MapEmptySnapshot {
  showMapEmpty: boolean;
  showListEmpty: boolean;
  variant: MapEmptyVariant;
  effectiveTotalInBounds: number;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
  keywordPreview?: string;
  actions: MapEmptyAction[];
}

/** Shared empty-state props for MapCanvas and MapResultsPanel. */
export function useMapEmptyActions(
  mapEmpty: MapEmptySnapshot,
  clearFiltersOnly: () => void,
  clearKeywordsFromEmpty: () => void,
  clearDrawnAreaFromEmpty: () => void,
  zoomInForMore: () => void
) {
  const canvasEmpty: MapEmptySurfaceProps = useMemo(
    () => ({
      showMapEmpty: mapEmpty.showMapEmpty,
      mapEmptyActions: mapEmpty.actions,
      mapEmptyVariant: mapEmpty.variant,
      totalInBounds: mapEmpty.effectiveTotalInBounds,
      mapEmptyFiltersActive: mapEmpty.filtersActive,
      mapEmptyKeywordsActive: mapEmpty.keywordsActive,
      mapEmptyDrawnAreaActive: mapEmpty.drawnAreaActive,
      mapEmptyKeywordPreview: mapEmpty.keywordPreview,
      onClearFilters: clearFiltersOnly,
      onClearKeywordsFromEmpty: clearKeywordsFromEmpty,
      onClearDrawnAreaFromEmpty: clearDrawnAreaFromEmpty,
      onZoomInForMore: zoomInForMore,
    }),
    [
      mapEmpty,
      clearFiltersOnly,
      clearKeywordsFromEmpty,
      clearDrawnAreaFromEmpty,
      zoomInForMore,
    ]
  );

  const panelEmpty: MapEmptyPanelProps = useMemo(
    () => ({
      mapEmptyVariant: mapEmpty.variant,
      mapEmptyShow: mapEmpty.showListEmpty,
      mapEmptyTotalInBounds: mapEmpty.effectiveTotalInBounds,
      mapEmptyFiltersActive: mapEmpty.filtersActive,
      mapEmptyKeywordsActive: mapEmpty.keywordsActive,
      mapEmptyDrawnAreaActive: mapEmpty.drawnAreaActive,
      mapEmptyKeywordPreview: mapEmpty.keywordPreview,
      onClearFiltersOnly: clearFiltersOnly,
      onClearKeywordsFromEmpty: clearKeywordsFromEmpty,
      onClearDrawnAreaFromEmpty: clearDrawnAreaFromEmpty,
      onZoomInForMore: zoomInForMore,
    }),
    [
      mapEmpty,
      clearFiltersOnly,
      clearKeywordsFromEmpty,
      clearDrawnAreaFromEmpty,
      zoomInForMore,
    ]
  );

  return { canvasEmpty, panelEmpty };
}
