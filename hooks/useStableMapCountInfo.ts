"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildMapResultsCountInfo,
  type MapResultsCountInfo,
} from "@/lib/map-list-count";
import { buildMapViewportKey } from "@/lib/map-viewport-key";
import type { MapBounds } from "@/lib/types/saved-search";

interface Options {
  resultCount: number;
  totalInBounds: number;
  loading: boolean;
  refreshing: boolean;
  resultsMayBeIncomplete: boolean;
  mapZoom: number;
  mapBounds: MapBounds | null;
  filtersActive: boolean;
  clientFilterActive: boolean;
  prefixCapActive: boolean;
}

/** Panel header counts — stable while fetching; zoom hint latched per viewport. */
export function useStableMapCountInfo({
  resultCount,
  totalInBounds,
  loading,
  refreshing,
  resultsMayBeIncomplete,
  mapZoom,
  mapBounds,
  filtersActive,
  clientFilterActive,
  prefixCapActive,
}: Options): MapResultsCountInfo {
  const viewportKey = useMemo(
    () => buildMapViewportKey(mapBounds, mapZoom),
    [mapBounds, mapZoom]
  );

  const liveInfo = useMemo(
    () =>
      buildMapResultsCountInfo({
        resultCount,
        totalInBounds,
        loading,
        resultsMayBeIncomplete,
        mapZoom,
        filtersActive,
        clientFilterActive,
        prefixCapActive,
      }),
    [
      resultCount,
      totalInBounds,
      loading,
      resultsMayBeIncomplete,
      mapZoom,
      filtersActive,
      clientFilterActive,
      prefixCapActive,
    ]
  );

  const [settledInfo, setSettledInfo] = useState(liveInfo);
  const fetchingRef = useRef(refreshing || loading);
  fetchingRef.current = refreshing || loading;

  const holdRef = useRef(settledInfo);
  if (!refreshing && !loading) {
    holdRef.current = settledInfo;
  }

  useEffect(() => {
    if (refreshing || loading) return;
    const timer = window.setTimeout(() => setSettledInfo(liveInfo), 200);
    return () => window.clearTimeout(timer);
  }, [liveInfo, refreshing, loading]);

  const zoomHintRef = useRef({ viewportKey: "", latched: false });
  if (zoomHintRef.current.viewportKey !== viewportKey) {
    zoomHintRef.current = { viewportKey, latched: false };
  }
  if (liveInfo.areaMayHaveMore || mapZoom <= 14) {
    zoomHintRef.current.latched = true;
  }
  if (mapZoom >= 16 && !liveInfo.areaMayHaveMore && !prefixCapActive) {
    zoomHintRef.current.latched = false;
  }

  const base = fetchingRef.current ? holdRef.current : settledInfo;

  return {
    ...base,
    subline: null,
    areaMayHaveMore: zoomHintRef.current.latched || base.areaMayHaveMore,
  };
}
