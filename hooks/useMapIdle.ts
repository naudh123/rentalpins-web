"use client";

import { useCallback, type MutableRefObject } from "react";
import {
  boundsForMap,
  boundsNearlyEqual,
  DEFAULT_MAP_ZOOM,
} from "@/lib/map-viewport";
import type { MapBounds } from "@/lib/types/saved-search";
import { trackMapViewportChanged } from "@/lib/ga4";

export interface UseMapIdleOptions {
  mapRef: MutableRefObject<google.maps.Map | null>;
  syncViewFromMap: (map: google.maps.Map) => void;
  pruneToViewport: (map: google.maps.Map) => void;
  scheduleUrlSync: () => void;
  scheduleFetchBounds: (map: google.maps.Map) => void;
  skipMapSyncRef: MutableRefObject<boolean>;
  skipNextIdleFetchRef: MutableRefObject<boolean>;
  lastUrlViewportKeyRef: MutableRefObject<string | null>;
  lastViewportEventKeyRef: MutableRefObject<string | null>;
  lastFetchedBoundsRef: MutableRefObject<MapBounds | null>;
  lastFetchedZoomRef: MutableRefObject<number | null>;
}

/** Pan/zoom idle: sync URL, analytics, and debounced listing fetch. */
export function useMapIdle({
  mapRef,
  syncViewFromMap,
  pruneToViewport,
  scheduleUrlSync,
  scheduleFetchBounds,
  skipMapSyncRef,
  skipNextIdleFetchRef,
  lastUrlViewportKeyRef,
  lastViewportEventKeyRef,
  lastFetchedBoundsRef,
  lastFetchedZoomRef,
}: UseMapIdleOptions) {
  return useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    syncViewFromMap(map);
    pruneToViewport(map);

    const bounds = boundsForMap(map);
    const zoom = map.getZoom() ?? DEFAULT_MAP_ZOOM;
    const viewportKey = [
      bounds.north.toFixed(3),
      bounds.south.toFixed(3),
      bounds.east.toFixed(3),
      bounds.west.toFixed(3),
      zoom.toFixed(0),
    ].join("|");

    if (skipMapSyncRef.current) {
      skipMapSyncRef.current = false;
      lastUrlViewportKeyRef.current = viewportKey;
      if (skipNextIdleFetchRef.current) skipNextIdleFetchRef.current = false;
      return;
    }

    if (viewportKey !== lastUrlViewportKeyRef.current) {
      lastUrlViewportKeyRef.current = viewportKey;
      scheduleUrlSync();
      if (viewportKey !== lastViewportEventKeyRef.current) {
        lastViewportEventKeyRef.current = viewportKey;
        trackMapViewportChanged({
          ...bounds,
          zoom,
        });
      }
    }

    const boundsUnchanged =
      lastFetchedBoundsRef.current &&
      lastFetchedZoomRef.current === zoom &&
      boundsNearlyEqual(bounds, lastFetchedBoundsRef.current, 0.002);
    const skipFetch =
      skipNextIdleFetchRef.current && boundsUnchanged;
    if (skipNextIdleFetchRef.current) skipNextIdleFetchRef.current = false;
    if (skipFetch || boundsUnchanged) {
      return;
    }
    scheduleFetchBounds(map);
  }, [
    mapRef,
    syncViewFromMap,
    pruneToViewport,
    scheduleUrlSync,
    scheduleFetchBounds,
    skipMapSyncRef,
    skipNextIdleFetchRef,
    lastUrlViewportKeyRef,
    lastViewportEventKeyRef,
    lastFetchedBoundsRef,
    lastFetchedZoomRef,
  ]);
}
