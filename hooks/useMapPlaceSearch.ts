"use client";

import { useCallback, type MutableRefObject } from "react";
import type { ListingFilters } from "@/lib/listing-filters";
import { aiSearchErrorCode, parseSearchQuery } from "@/lib/ai-search";
import {
  geocoderResultToSearchResult,
  type PlaceSearchResult,
} from "@/lib/map-place-search";
import type { PersistedMapView } from "@/lib/map-last-view";
import { flushPersistedMapView } from "@/lib/map-last-view";
import { trackEvent } from "@/lib/ga4";
import { isGoogleMapsReady } from "@/lib/google-maps-guard";

interface Options {
  mapRef: MutableRefObject<google.maps.Map | null>;
  skipMapSyncRef: MutableRefObject<boolean>;
  skipNextIdleFetchRef: MutableRefObject<boolean>;
  filtersRef: MutableRefObject<ListingFilters>;
  placeQueryRef: MutableRefObject<string>;
  textQueryRef: MutableRefObject<string>;
  selectedIdRef: MutableRefObject<string | null>;
  lastKeywordSyncedRef: MutableRefObject<string>;
  setPlaceQuery: React.Dispatch<React.SetStateAction<string>>;
  setTextQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  invalidateFetchCache: () => void;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
  syncViewFromMap: (map: google.maps.Map) => void;
  scheduleUrlSync: () => void;
  syncUrlNow: (nextFilters?: ListingFilters) => void;
  buildPersistedView: (map: google.maps.Map) => PersistedMapView | null;
  handleFiltersChange: (next: ListingFilters) => void;
}

export function useMapPlaceSearch({
  mapRef,
  skipMapSyncRef,
  skipNextIdleFetchRef,
  filtersRef,
  placeQueryRef,
  textQueryRef,
  selectedIdRef,
  lastKeywordSyncedRef,
  setPlaceQuery,
  setTextQuery,
  setSelectedId,
  invalidateFetchCache,
  scheduleFetchBounds,
  syncViewFromMap,
  scheduleUrlSync,
  syncUrlNow,
  buildPersistedView,
  handleFiltersChange,
}: Options) {
  const flyToPlace = useCallback(
    (result: PlaceSearchResult) => {
      const map = mapRef.current;
      if (!map || !isGoogleMapsReady()) return;

      setPlaceQuery(result.label);
      placeQueryRef.current = result.label;
      setSelectedId(null);
      selectedIdRef.current = null;
      invalidateFetchCache();
      skipMapSyncRef.current = true;
      skipNextIdleFetchRef.current = true;

      if (result.bounds) {
        const b = new google.maps.LatLngBounds(
          { lat: result.bounds.south, lng: result.bounds.west },
          { lat: result.bounds.north, lng: result.bounds.east }
        );
        map.fitBounds(b, 56);
      } else {
        map.panTo({ lat: result.lat, lng: result.lng });
        if (result.zoom != null) map.setZoom(result.zoom);
      }

      syncViewFromMap(map);
      scheduleFetchBounds(map, true);
      scheduleUrlSync();
    },
    [
      invalidateFetchCache,
      mapRef,
      placeQueryRef,
      scheduleFetchBounds,
      scheduleUrlSync,
      selectedIdRef,
      setPlaceQuery,
      setSelectedId,
      skipMapSyncRef,
      skipNextIdleFetchRef,
      syncViewFromMap,
    ]
  );

  const clearLocationSearch = useCallback(() => {
    const map = mapRef.current;
    setPlaceQuery("");
    placeQueryRef.current = "";
    setSelectedId(null);
    selectedIdRef.current = null;
    trackEvent("map_location_search_cleared");
    if (!map) {
      syncUrlNow();
      return;
    }
    syncViewFromMap(map);
    const nextView = buildPersistedView(map);
    if (nextView) flushPersistedMapView(nextView);
    scheduleFetchBounds(map, true);
    syncUrlNow();
  }, [
    buildPersistedView,
    mapRef,
    placeQueryRef,
    scheduleFetchBounds,
    selectedIdRef,
    setPlaceQuery,
    setSelectedId,
    syncUrlNow,
    syncViewFromMap,
  ]);

  const useCurrentLocation = useCallback(
    (result: PlaceSearchResult) => {
      flyToPlace(result);
      trackEvent("map_use_current_location_applied", {
        has_bounds: Boolean(result.bounds),
      });
    },
    [flyToPlace]
  );

  const handleAiSearch = useCallback(
    async (query: string) => {
      try {
        const transactionType = filtersRef.current.transactionType;
        const parsed = await parseSearchQuery(query, transactionType);
        handleFiltersChange(parsed.filters);
        trackEvent("ai_search_applied", {
          category: parsed.filters.category,
          has_place: Boolean(parsed.placeText),
          has_keywords: Boolean(parsed.keywords),
          transaction_type: transactionType,
        });
        setTextQuery(parsed.keywords);
        textQueryRef.current = parsed.keywords;
        lastKeywordSyncedRef.current = parsed.keywords.trim();
        syncUrlNow(parsed.filters);
        if (
          parsed.placeText &&
          typeof google !== "undefined" &&
          google.maps?.Geocoder
        ) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: parsed.placeText }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const r = geocoderResultToSearchResult(results[0]);
              if (r) flyToPlace(r);
            }
          });
        }
      } catch (err) {
        trackEvent("ai_search_failed", { error_code: aiSearchErrorCode(err) });
        console.error("AI search failed", err);
        throw err;
      }
    },
    [
      filtersRef,
      flyToPlace,
      handleFiltersChange,
      lastKeywordSyncedRef,
      setTextQuery,
      syncUrlNow,
      textQueryRef,
    ]
  );

  return { flyToPlace, clearLocationSearch, useCurrentLocation, handleAiSearch };
}
