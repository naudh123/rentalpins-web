"use client";

import { useCallback, type MutableRefObject } from "react";
import {
  DEFAULT_LISTING_FILTERS,
  type ListingFilters,
} from "@/lib/listing-filters";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/lib/map-viewport";
import type { MapAreaShape } from "@/lib/map-area";
import { clearPersistedMapView } from "@/lib/map-last-view";
import { urlMapViewMatchesState } from "@/lib/map-url-viewport";
import type { SearchUrlState } from "@/lib/search-url";
import type { MapBounds } from "@/lib/types/saved-search";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { fitBoundsPaddingForMobileView } from "@/lib/map-fit-padding";
import {
  afterFitBoundsClampMobile,
  ensureMobileListingFocusZoom,
  isMobileMapLayout,
} from "@/lib/map-mobile";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";
import type { DrawMode } from "@/components/map/MapDrawAreaController";
import { trackEvent } from "@/lib/ga4";

interface Options {
  mapRef: MutableRefObject<google.maps.Map | null>;
  skipMapSyncRef: MutableRefObject<boolean>;
  skipNextIdleFetchRef: MutableRefObject<boolean>;
  restoredFromStorageRef: MutableRefObject<boolean>;
  filtersRef: MutableRefObject<ListingFilters>;
  placeQueryRef: MutableRefObject<string>;
  textQueryRef: MutableRefObject<string>;
  selectedIdRef: MutableRefObject<string | null>;
  drawnShapeRef: MutableRefObject<MapAreaShape | null>;
  lastKeywordSyncedRef: MutableRefObject<string>;
  setFilters: React.Dispatch<React.SetStateAction<ListingFilters>>;
  setPlaceQuery: React.Dispatch<React.SetStateAction<string>>;
  setTextQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  setDrawnShape: React.Dispatch<React.SetStateAction<MapAreaShape | null>>;
  setDrawMode: React.Dispatch<React.SetStateAction<DrawMode | null>>;
  setMapBounds: React.Dispatch<React.SetStateAction<MapBounds | null>>;
  invalidateFetchCache: () => void;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
  syncUrlNow: (nextFilters?: ListingFilters) => void;
}

export function useMapViewActions({
  mapRef,
  skipMapSyncRef,
  skipNextIdleFetchRef,
  restoredFromStorageRef,
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
  setDrawMode,
  setMapBounds,
  invalidateFetchCache,
  scheduleFetchBounds,
  syncUrlNow,
}: Options) {
  const applyMapFromUrlState = useCallback(
    (state: SearchUrlState) => {
      const map = mapRef.current;
      if (!map || urlMapViewMatchesState(map, state)) return;

      skipMapSyncRef.current = true;
      skipNextIdleFetchRef.current = true;
      if (state.bounds) {
        const b = new google.maps.LatLngBounds(
          { lat: state.bounds.south, lng: state.bounds.west },
          { lat: state.bounds.north, lng: state.bounds.east }
        );
        map.fitBounds(b);
      } else if (state.centerLat != null && state.centerLng != null) {
        map.panTo({ lat: state.centerLat, lng: state.centerLng });
        if (state.zoom != null) map.setZoom(state.zoom);
      }
      invalidateFetchCache();
    },
    [invalidateFetchCache, mapRef, skipMapSyncRef, skipNextIdleFetchRef]
  );

  const resetMapView = useCallback(() => {
    clearPersistedMapView();
    const map = mapRef.current;
    if (!map) return;
    restoredFromStorageRef.current = true;
    setFilters(DEFAULT_LISTING_FILTERS);
    filtersRef.current = DEFAULT_LISTING_FILTERS;
    setPlaceQuery("");
    placeQueryRef.current = "";
    setTextQuery("");
    textQueryRef.current = "";
    lastKeywordSyncedRef.current = "";
    setSelectedId(null);
    selectedIdRef.current = null;
    setDrawnShape(null);
    drawnShapeRef.current = null;
    setDrawMode(null);
    setMapBounds(null);
    skipMapSyncRef.current = true;
    skipNextIdleFetchRef.current = true;
    map.panTo(DEFAULT_MAP_CENTER);
    map.setZoom(DEFAULT_MAP_ZOOM);
    invalidateFetchCache();
    trackEvent("map_view_reset_clicked");
    scheduleFetchBounds(map, true);
    syncUrlNow(DEFAULT_LISTING_FILTERS);
  }, [
    drawnShapeRef,
    filtersRef,
    invalidateFetchCache,
    lastKeywordSyncedRef,
    mapRef,
    placeQueryRef,
    restoredFromStorageRef,
    scheduleFetchBounds,
    selectedIdRef,
    setDrawMode,
    setDrawnShape,
    setFilters,
    setMapBounds,
    setPlaceQuery,
    setSelectedId,
    setTextQuery,
    skipMapSyncRef,
    skipNextIdleFetchRef,
    syncUrlNow,
    textQueryRef,
  ]);

  const fitAllListings = useCallback(
    (listings: ListingCardData[], mobileView: MapMobileView) => {
      const map = mapRef.current;
      if (!map) return;
      const coords = listings.filter(
        (l) => Number.isFinite(l.lat) && Number.isFinite(l.lng)
      );
      if (coords.length === 1) {
        map.panTo({ lat: coords[0].lat, lng: coords[0].lng });
        if (isMobileMapLayout()) ensureMobileListingFocusZoom(map);
        else if ((map.getZoom() ?? 0) < 15) map.setZoom(15);
        trackEvent("map_fit_all_results_clicked", { count: 1 });
        return;
      }
      if (coords.length < 2) return;
      const bounds = new google.maps.LatLngBounds();
      for (const l of coords) bounds.extend({ lat: l.lat, lng: l.lng });
      map.fitBounds(bounds, fitBoundsPaddingForMobileView(mobileView));
      afterFitBoundsClampMobile(map);
      trackEvent("map_fit_all_results_clicked", { count: coords.length });
    },
    [mapRef]
  );

  return { applyMapFromUrlState, resetMapView, fitAllListings };
}
