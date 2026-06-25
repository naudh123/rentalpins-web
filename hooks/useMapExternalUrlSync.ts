"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import type { ListingFilters } from "@/lib/listing-filters";
import type { MapAreaShape } from "@/lib/map-area";
import {
  normalizeSearchQueryString,
  searchViewQueryString,
  type SearchUrlState,
} from "@/lib/search-url";

interface Options {
  searchParams: URLSearchParams;
  urlState: SearchUrlState;
  mapRef: RefObject<google.maps.Map | null>;
  filtersRef: MutableRefObject<ListingFilters>;
  placeQueryRef: MutableRefObject<string>;
  textQueryRef: MutableRefObject<string>;
  semanticQueryRef: MutableRefObject<string>;
  selectedIdRef: MutableRefObject<string | null>;
  drawnShapeRef: MutableRefObject<MapAreaShape | null>;
  lastSyncedQueryRef: MutableRefObject<string | null>;
  lastExternalViewKeyRef: MutableRefObject<string | null>;
  setLastSyncedQuery: (q: string) => void;
  cancelUrlSync: () => void;
  setFilters: (f: ListingFilters) => void;
  setPlaceQuery: (q: string) => void;
  setTextQuery: (q: string) => void;
  setSemanticQuery: (q: string) => void;
  setSelectedId: (id: string | null) => void;
  setDrawnShape: (shape: MapAreaShape | null) => void;
  setMapCenter: (c: { lat: number; lng: number }) => void;
  setMapZoom: (z: number) => void;
  setMapBounds: (b: SearchUrlState["bounds"]) => void;
  setFetchError: (msg: string) => void;
  lastKeywordSyncedRef: MutableRefObject<string>;
  applyMapFromUrlState: (state: SearchUrlState) => void;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
}

/** Apply browser back/forward and external `/search` URL changes to map state. */
export function useMapExternalUrlSync({
  searchParams,
  urlState,
  mapRef,
  filtersRef,
  placeQueryRef,
  textQueryRef,
  semanticQueryRef,
  selectedIdRef,
  drawnShapeRef,
  lastSyncedQueryRef,
  lastExternalViewKeyRef,
  setLastSyncedQuery,
  cancelUrlSync,
  setFilters,
  setPlaceQuery,
  setTextQuery,
  setSemanticQuery,
  setSelectedId,
  setDrawnShape,
  setMapCenter,
  setMapZoom,
  setMapBounds,
  setFetchError,
  lastKeywordSyncedRef,
  applyMapFromUrlState,
  scheduleFetchBounds,
}: Options): void {
  useEffect(() => {
    const current = normalizeSearchQueryString(searchParams.toString());

    if (lastSyncedQueryRef.current === null) {
      setLastSyncedQuery(current);
      lastExternalViewKeyRef.current = searchViewQueryString(urlState);
      return;
    }

    if (current === lastSyncedQueryRef.current) return;

    cancelUrlSync();

    const viewKey = searchViewQueryString(urlState);
    const viewportChanged = viewKey !== lastExternalViewKeyRef.current;

    setLastSyncedQuery(current);
    setFilters(urlState.filters);
    filtersRef.current = urlState.filters;
    setPlaceQuery(urlState.placeQuery ?? "");
    placeQueryRef.current = urlState.placeQuery ?? "";
    setTextQuery(urlState.keywords ?? "");
    textQueryRef.current = urlState.keywords ?? "";
    setSemanticQuery(urlState.keywords ?? "");
    semanticQueryRef.current = urlState.keywords ?? "";
    lastKeywordSyncedRef.current = (urlState.keywords ?? "").trim();
    setSelectedId(urlState.selectedId);
    selectedIdRef.current = urlState.selectedId;
    setDrawnShape(urlState.drawnArea);
    drawnShapeRef.current = urlState.drawnArea;

    if (!viewportChanged) return;

    lastExternalViewKeyRef.current = viewKey;
    setFetchError("");
    if (urlState.centerLat != null && urlState.centerLng != null) {
      setMapCenter({ lat: urlState.centerLat, lng: urlState.centerLng });
    }
    if (urlState.zoom != null) setMapZoom(urlState.zoom);
    if (urlState.bounds) setMapBounds(urlState.bounds);

    if (mapRef.current) {
      applyMapFromUrlState(urlState);
      scheduleFetchBounds(mapRef.current, true);
    }
  }, [
    searchParams,
    urlState,
    applyMapFromUrlState,
    scheduleFetchBounds,
    setLastSyncedQuery,
    lastSyncedQueryRef,
    lastExternalViewKeyRef,
    cancelUrlSync,
    mapRef,
    filtersRef,
    placeQueryRef,
    textQueryRef,
    selectedIdRef,
    drawnShapeRef,
    lastKeywordSyncedRef,
    setFilters,
    setPlaceQuery,
    setTextQuery,
    setSelectedId,
    setDrawnShape,
    setMapCenter,
    setMapZoom,
    setMapBounds,
    setFetchError,
  ]);
}
