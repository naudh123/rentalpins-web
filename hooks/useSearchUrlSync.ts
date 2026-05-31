"use client";

import { useCallback, useRef } from "react";
import { appPath } from "@/lib/config";
import type { ListingFilters } from "@/lib/listing-filters";
import { boundsFromMap } from "@/lib/map-viewport";
import {
  buildSearchUrl,
  normalizeSearchQueryString,
  searchUrlQueryString,
  type SearchUrlState,
} from "@/lib/search-url";
import type { MapBounds } from "@/lib/types/saved-search";
import type { MapAreaShape } from "@/lib/map-area";

interface ViewSnapshot {
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  mapBounds: MapBounds | null;
}

interface Refs {
  filtersRef: React.MutableRefObject<ListingFilters>;
  placeQueryRef: React.MutableRefObject<string>;
  textQueryRef: React.MutableRefObject<string>;
  selectedIdRef: React.MutableRefObject<string | null>;
  drawnShapeRef: React.MutableRefObject<MapAreaShape | null>;
}

interface Options {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  view: ViewSnapshot;
  refs: Refs;
}

export function useSearchUrlSync({ mapRef, view, refs }: Options) {
  const urlSyncDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedQueryRef = useRef<string | null>(null);

  // `view` and `refs` are fresh objects every render. Capture them in stable
  // refs so the returned callbacks (scheduleUrlSync/syncUrlNow/cancelUrlSync)
  // don't get recreated each render and cascade into consumers' dependencies.
  const viewRef = useRef(view);
  viewRef.current = view;
  const refsRef = useRef(refs);
  refsRef.current = refs;

  const pushUrlFromView = useCallback(
    (nextFilters?: ListingFilters) => {
      const map = mapRef.current;
      const v = viewRef.current;
      const r = refsRef.current;
      const c = map?.getCenter();
      const zoom = map?.getZoom() ?? v.mapZoom;
      const bounds = map ? boundsFromMap(map) : v.mapBounds;

      const state: SearchUrlState = {
        filters: nextFilters ?? r.filtersRef.current,
        centerLat: c?.lat() ?? v.mapCenter.lat,
        centerLng: c?.lng() ?? v.mapCenter.lng,
        zoom,
        bounds,
        placeQuery: r.placeQueryRef.current.trim() || null,
        keywords: r.textQueryRef.current.trim() || null,
        selectedId: r.selectedIdRef.current,
        drawnArea: r.drawnShapeRef.current,
      };

      const qs = normalizeSearchQueryString(searchUrlQueryString(state));
      if (qs === (lastSyncedQueryRef.current ?? "")) return;

      lastSyncedQueryRef.current = qs;
      // Use history.replaceState (not router.replace) so frequent viewport
      // updates don't trigger a server round-trip / Suspense re-render that
      // would remount the map and snap the camera back. Next syncs this into
      // useSearchParams without refetching the route.
      if (typeof window !== "undefined") {
        window.history.replaceState(window.history.state, "", appPath(buildSearchUrl(state)));
      }
    },
    [mapRef]
  );

  const scheduleUrlSync = useCallback(
    (nextFilters?: ListingFilters) => {
      if (urlSyncDebounceRef.current) clearTimeout(urlSyncDebounceRef.current);
      urlSyncDebounceRef.current = setTimeout(() => {
        pushUrlFromView(nextFilters);
      }, 500);
    },
    [pushUrlFromView]
  );

  const syncUrlNow = useCallback(
    (nextFilters?: ListingFilters) => {
      if (urlSyncDebounceRef.current) clearTimeout(urlSyncDebounceRef.current);
      pushUrlFromView(nextFilters);
    },
    [pushUrlFromView]
  );

  const cancelUrlSync = useCallback(() => {
    if (urlSyncDebounceRef.current) clearTimeout(urlSyncDebounceRef.current);
  }, []);

  const setLastSyncedQuery = useCallback((qs: string) => {
    lastSyncedQueryRef.current = qs;
  }, []);

  return {
    scheduleUrlSync,
    syncUrlNow,
    cancelUrlSync,
    lastSyncedQueryRef,
    setLastSyncedQuery,
  };
}
