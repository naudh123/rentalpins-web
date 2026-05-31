"use client";

import { useMemo } from "react";
import type { DrawMode } from "@/components/map/MapDrawAreaController";
import type { MapAreaShape } from "@/lib/map-area";
import {
  resolveMapEmptyActions,
  resolveMapEmptyState,
  type MapEmptyAction,
  type MapEmptyVariant,
} from "@/lib/map-empty-state";

interface Options {
  listingCount: number;
  totalInBounds: number;
  filteredListingsCount: number;
  drawnShape: MapAreaShape | null;
  loading: boolean;
  refreshing: boolean;
  areaMayHaveMore: boolean;
  activeFilterCount: number;
  textQuery: string;
  drawMode: DrawMode | null;
}

export function useMapEmptyState({
  listingCount,
  totalInBounds,
  filteredListingsCount,
  drawnShape,
  loading,
  refreshing,
  areaMayHaveMore,
  activeFilterCount,
  textQuery,
  drawMode,
}: Options) {
  const keywordsActive = Boolean(textQuery.trim());
  const drawnAreaActive = Boolean(drawnShape);
  const filtersActive = activeFilterCount > 0;
  const effectiveTotalInBounds = drawnShape ? filteredListingsCount : totalInBounds;

  const emptyState = useMemo(
    () =>
      resolveMapEmptyState({
        listingCount,
        totalInBounds: effectiveTotalInBounds,
        loading,
        refreshing,
        areaMayHaveMore,
        filtersActive,
        keywordsActive,
        drawnAreaActive,
      }),
    [
      listingCount,
      effectiveTotalInBounds,
      loading,
      refreshing,
      areaMayHaveMore,
      filtersActive,
      keywordsActive,
      drawnAreaActive,
    ]
  );

  const actions = useMemo(
    () =>
      resolveMapEmptyActions({
        variant: emptyState.variant,
        filtersActive,
        keywordsActive,
        drawnAreaActive,
      }),
    [emptyState.variant, filtersActive, keywordsActive, drawnAreaActive]
  );

  const showMapEmpty = emptyState.show && !drawMode;
  const showListEmpty = emptyState.show && !loading;

  return {
    variant: emptyState.variant as MapEmptyVariant,
    show: emptyState.show,
    showMapEmpty,
    showListEmpty,
    effectiveTotalInBounds,
    filtersActive,
    keywordsActive,
    drawnAreaActive,
    keywordPreview: textQuery.trim() || undefined,
    actions: actions as MapEmptyAction[],
  };
}
