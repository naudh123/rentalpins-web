"use client";

import { useMemo } from "react";
import type { PlaceSearchResult } from "@/lib/map-place-search";
import { MAP_SEARCH_INPUT_ID } from "@/lib/map-search-input";

interface Options {
  placeQuery: string;
  textQuery: string;
  onPlaceResult: (result: PlaceSearchResult) => void;
  onClearPlace: () => void;
  onUseCurrentLocation: (result: PlaceSearchResult) => void;
  onAiSearch: (query: string) => void;
  onClearKeywords: (source?: "chip" | "empty_state") => void;
}

/** Memoized place / keyword search props for MapCanvas. */
export function useMapCanvasPlaceSearchProps({
  placeQuery,
  textQuery,
  onPlaceResult,
  onClearPlace,
  onUseCurrentLocation,
  onAiSearch,
  onClearKeywords,
}: Options) {
  return useMemo(
    () => ({
      mapSearchInputId: MAP_SEARCH_INPUT_ID,
      placeQuery,
      textQuery,
      onPlaceResult,
      onClearPlace,
      onUseCurrentLocation,
      onAiSearch,
      onClearKeywords,
    }),
    [
      placeQuery,
      textQuery,
      onPlaceResult,
      onClearPlace,
      onUseCurrentLocation,
      onAiSearch,
      onClearKeywords,
    ]
  );
}
