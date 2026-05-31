"use client";

import { useMemo } from "react";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";
import type { MapEmptyVariant } from "@/lib/map-empty-state";
import type { MapBounds } from "@/lib/types/saved-search";
import { mapDensityHint } from "@/lib/map-results-cap";
import { buildMapViewportKey } from "@/lib/map-viewport-key";
import { useMapDensityBannerDismiss } from "@/hooks/useMapDensityBannerDismiss";
import { useMapViewportHintDismiss } from "@/hooks/useMapViewportHintDismiss";

interface MapEmptyHintsInput {
  showMapEmpty: boolean;
  variant: MapEmptyVariant;
  effectiveTotalInBounds: number;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
}

interface Options {
  mapBounds: MapBounds | null;
  mapZoom: number;
  totalInBounds: number;
  listingsCount: number;
  resultsMayBeIncomplete: boolean;
  serverFilteredCount: number;
  textQuery: string;
  mobileView: MapMobileView;
  prefixCapActive?: boolean;
  mapEmpty: MapEmptyHintsInput;
}

/** Density banner, low-zoom hint, and mobile empty peek hint — keyed per viewport. */
export function useMapViewportHints({
  mapBounds,
  mapZoom,
  totalInBounds,
  listingsCount,
  resultsMayBeIncomplete,
  serverFilteredCount,
  textQuery,
  mobileView,
  prefixCapActive = false,
  mapEmpty,
}: Options) {
  const viewportKey = useMemo(
    () => buildMapViewportKey(mapBounds, mapZoom),
    [mapBounds, mapZoom]
  );

  const densityHintRaw = useMemo(
    () =>
      mapDensityHint(
        totalInBounds,
        mapZoom,
        resultsMayBeIncomplete,
        textQuery.trim()
          ? listingsCount
          : Math.min(listingsCount, serverFilteredCount),
        { bounds: mapBounds, prefixCapActive }
      ),
    [
      totalInBounds,
      mapZoom,
      resultsMayBeIncomplete,
      listingsCount,
      serverFilteredCount,
      textQuery,
      mapBounds,
      prefixCapActive,
    ]
  );

  const { show: showDensityBanner, dismiss: dismissDensityBanner } =
    useMapDensityBannerDismiss(densityHintRaw, viewportKey);

  const showLowZoomHintRaw = mapZoom <= 10 && listingsCount > 0;
  const { show: showLowZoomHint, dismiss: dismissLowZoomHint } =
    useMapViewportHintDismiss(
      showLowZoomHintRaw,
      viewportKey,
      "rp_map_low_zoom_hint_dismiss",
      "map_low_zoom_hint_dismissed"
    );

  const emptyPeekHintKey = useMemo(
    () =>
      `${viewportKey}|${mapEmpty.variant}|${mapEmpty.effectiveTotalInBounds}|${mapEmpty.filtersActive ? 1 : 0}|${mapEmpty.keywordsActive ? 1 : 0}|${mapEmpty.drawnAreaActive ? 1 : 0}`,
    [
      viewportKey,
      mapEmpty.variant,
      mapEmpty.effectiveTotalInBounds,
      mapEmpty.filtersActive,
      mapEmpty.keywordsActive,
      mapEmpty.drawnAreaActive,
    ]
  );

  const { show: showEmptyPeekHint, dismiss: dismissEmptyPeekHint } =
    useMapViewportHintDismiss(
      mapEmpty.showMapEmpty && mobileView === "peek",
      emptyPeekHintKey,
      "rp_map_empty_peek_hint_dismiss",
      "map_empty_peek_hint_dismissed"
    );

  return {
    viewportKey,
    densityHint: showDensityBanner ? densityHintRaw : null,
    dismissDensityBanner,
    showLowZoomHint,
    dismissLowZoomHint,
    showEmptyPeekHint,
    dismissEmptyPeekHint,
  };
}
