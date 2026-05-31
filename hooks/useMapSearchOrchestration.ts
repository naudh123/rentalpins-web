"use client";

import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import type { ListingFilters } from "@/lib/listing-filters";
import { boundsFromMap, DEFAULT_MAP_ZOOM } from "@/lib/map-viewport";
import type { MapAreaShape } from "@/lib/map-area";
import { scheduleSavePersistedMapView } from "@/lib/map-last-view";
import type { MapBounds } from "@/lib/types/saved-search";
import type { SearchUrlState } from "@/lib/search-url";
import { trackEvent } from "@/lib/ga4";
import { useMapIdle } from "@/hooks/useMapIdle";
import { useSearchUrlSync } from "@/hooks/useSearchUrlSync";
import { useMapExternalUrlSync } from "@/hooks/useMapExternalUrlSync";
import { useMapLocalStorageRestore } from "@/hooks/useMapLocalStorageRestore";

interface ViewSnapshot {
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  mapBounds: MapBounds | null;
}

interface Refs {
  filtersRef: MutableRefObject<ListingFilters>;
  placeQueryRef: MutableRefObject<string>;
  textQueryRef: MutableRefObject<string>;
  selectedIdRef: MutableRefObject<string | null>;
  drawnShapeRef: MutableRefObject<MapAreaShape | null>;
}

interface FetchIdleRefs {
  pruneToViewport: (map: google.maps.Map) => void;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
  lastFetchedBoundsRef: MutableRefObject<MapBounds | null>;
  lastFetchedZoomRef: MutableRefObject<number | null>;
  skipNextIdleFetchRef: MutableRefObject<boolean>;
}

interface Options {
  mapRef: MutableRefObject<google.maps.Map | null>;
  view: ViewSnapshot;
  refs: Refs;
  fetch: FetchIdleRefs;
  setMapCenter: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }>
  >;
  setMapZoom: React.Dispatch<React.SetStateAction<number>>;
  setMapBounds: React.Dispatch<React.SetStateAction<MapBounds | null>>;
}

/** URL sync, viewport state, and idle fetch wiring for SearchMap. */
export function useMapSearchOrchestration({
  mapRef,
  view,
  refs,
  fetch,
  setMapCenter,
  setMapZoom,
  setMapBounds,
}: Options) {
  const skipMapSyncRef = useRef(false);
  const lastUrlViewportKeyRef = useRef<string | null>(null);
  const lastViewportEventKeyRef = useRef<string | null>(null);

  const syncViewFromMap = useCallback(
    (map: google.maps.Map) => {
      const c = map.getCenter();
      const zoom = map.getZoom() ?? DEFAULT_MAP_ZOOM;
      const coordEps = 1e-5;
      if (c) {
        const lat = c.lat();
        const lng = c.lng();
        setMapCenter((prev) =>
          Math.abs(prev.lat - lat) < coordEps && Math.abs(prev.lng - lng) < coordEps
            ? prev
            : { lat, lng }
        );
      }
      setMapZoom((prev) => (Math.abs(prev - zoom) < 0.01 ? prev : zoom));
      const bounds = boundsFromMap(map);
      if (bounds) {
        setMapBounds((prev) =>
          prev &&
          Math.abs(prev.north - bounds.north) < coordEps &&
          Math.abs(prev.south - bounds.south) < coordEps &&
          Math.abs(prev.east - bounds.east) < coordEps &&
          Math.abs(prev.west - bounds.west) < coordEps
            ? prev
            : bounds
        );
      }
      if (c) {
        scheduleSavePersistedMapView({
          centerLat: c.lat(),
          centerLng: c.lng(),
          zoom,
          bounds: bounds ?? undefined,
          selectedId: refs.selectedIdRef.current,
          placeQuery: refs.placeQueryRef.current.trim() || null,
          category: refs.filtersRef.current.category,
          sort: refs.filtersRef.current.sort,
          priceMin: refs.filtersRef.current.priceMin,
          priceMax: refs.filtersRef.current.priceMax,
        });
      }
    },
    [refs, setMapBounds, setMapCenter, setMapZoom]
  );

  const {
    scheduleUrlSync,
    syncUrlNow,
    cancelUrlSync,
    lastSyncedQueryRef,
    setLastSyncedQuery,
  } = useSearchUrlSync({ mapRef, view, refs });

  const handleMapIdle = useMapIdle({
    mapRef,
    syncViewFromMap,
    pruneToViewport: fetch.pruneToViewport,
    scheduleUrlSync,
    scheduleFetchBounds: fetch.scheduleFetchBounds,
    skipMapSyncRef,
    skipNextIdleFetchRef: fetch.skipNextIdleFetchRef,
    lastUrlViewportKeyRef,
    lastViewportEventKeyRef,
    lastFetchedBoundsRef: fetch.lastFetchedBoundsRef,
    lastFetchedZoomRef: fetch.lastFetchedZoomRef,
  });

  return {
    syncViewFromMap,
    skipMapSyncRef,
    lastUrlViewportKeyRef,
    lastViewportEventKeyRef,
    scheduleUrlSync,
    syncUrlNow,
    cancelUrlSync,
    lastSyncedQueryRef,
    setLastSyncedQuery,
    handleMapIdle,
  };
}

export type { ViewSnapshot as MapOrchestrationView, Refs as MapOrchestrationRefs };

export interface MapUrlRestorationOptions {
  searchParams: URLSearchParams;
  urlState: SearchUrlState;
  urlHasViewport: boolean;
  mapRef: RefObject<google.maps.Map | null>;
  filtersRef: MutableRefObject<ListingFilters>;
  placeQueryRef: MutableRefObject<string>;
  textQueryRef: MutableRefObject<string>;
  selectedIdRef: MutableRefObject<string | null>;
  drawnShapeRef: MutableRefObject<MapAreaShape | null>;
  lastSyncedQueryRef: MutableRefObject<string | null>;
  lastExternalViewKeyRef: MutableRefObject<string | null>;
  lastKeywordSyncedRef: MutableRefObject<string>;
  restoredViewTrackedRef: MutableRefObject<boolean>;
  restoredFromStorageRef: MutableRefObject<boolean>;
  setLastSyncedQuery: (q: string) => void;
  cancelUrlSync: () => void;
  setFilters: (f: ListingFilters) => void;
  setPlaceQuery: (q: string) => void;
  setTextQuery: (q: string) => void;
  setSelectedId: (id: string | null) => void;
  setDrawnShape: (shape: MapAreaShape | null) => void;
  setMapCenter: (c: { lat: number; lng: number }) => void;
  setMapZoom: (z: number) => void;
  setMapBounds: (b: MapBounds | null) => void;
  setFetchError: (msg: string) => void;
  applyMapFromUrlState: (state: SearchUrlState) => void;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
}

/** External URL sync, localStorage restore, and restored-view analytics. */
export function useMapUrlRestoration(options: MapUrlRestorationOptions): void {
  const {
    searchParams,
    urlState,
    urlHasViewport,
    mapRef,
    filtersRef,
    placeQueryRef,
    textQueryRef,
    selectedIdRef,
    drawnShapeRef,
    lastSyncedQueryRef,
    lastExternalViewKeyRef,
    lastKeywordSyncedRef,
    restoredViewTrackedRef,
    restoredFromStorageRef,
    setLastSyncedQuery,
    cancelUrlSync,
    setFilters,
    setPlaceQuery,
    setTextQuery,
    setSelectedId,
    setDrawnShape,
    setMapCenter,
    setMapZoom,
    setMapBounds,
    setFetchError,
    applyMapFromUrlState,
    scheduleFetchBounds,
  } = options;

  useMapExternalUrlSync({
    searchParams,
    urlState,
    mapRef,
    filtersRef,
    placeQueryRef,
    textQueryRef,
    selectedIdRef,
    drawnShapeRef,
    lastSyncedQueryRef,
    lastExternalViewKeyRef,
    setLastSyncedQuery,
    cancelUrlSync,
    setFilters,
    setPlaceQuery,
    setTextQuery,
    setSelectedId,
    setDrawnShape,
    setMapCenter,
    setMapZoom,
    setMapBounds,
    setFetchError,
    lastKeywordSyncedRef,
    applyMapFromUrlState,
    scheduleFetchBounds,
  });

  useEffect(() => {
    if (restoredViewTrackedRef.current) return;
    if (!urlHasViewport && !urlState.placeQuery?.trim()) return;
    restoredViewTrackedRef.current = true;
    trackEvent("map_search_view_restored", {
      has_place: urlState.placeQuery?.trim() ? "yes" : "no",
      has_bounds: urlState.bounds ? "yes" : "no",
    });
  }, [
    restoredViewTrackedRef,
    urlHasViewport,
    urlState.bounds,
    urlState.placeQuery,
  ]);

  useMapLocalStorageRestore({
    searchParams,
    urlHasViewport,
    urlSelectedId: urlState.selectedId,
    restoredFromStorageRef,
    filtersRef,
    placeQueryRef,
    selectedIdRef,
    setFilters,
    setPlaceQuery,
    setSelectedId,
  });
}
