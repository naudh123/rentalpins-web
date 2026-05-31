"use client";

import { useEffect, type MutableRefObject } from "react";
import type { ListingFilters } from "@/lib/listing-filters";
import {
  hasUrlSearchFilters,
  loadPersistedMapView,
} from "@/lib/map-last-view";

interface Options {
  searchParams: URLSearchParams;
  urlHasViewport: boolean;
  urlSelectedId: string | null;
  restoredFromStorageRef: MutableRefObject<boolean>;
  filtersRef: MutableRefObject<ListingFilters>;
  placeQueryRef: MutableRefObject<string>;
  selectedIdRef: MutableRefObject<string | null>;
  setFilters: (f: ListingFilters) => void;
  setPlaceQuery: (q: string) => void;
  setSelectedId: (id: string | null) => void;
}

/** Restore filters / place / selection from localStorage when URL has no viewport. */
export function useMapLocalStorageRestore({
  searchParams,
  urlHasViewport,
  urlSelectedId,
  restoredFromStorageRef,
  filtersRef,
  placeQueryRef,
  selectedIdRef,
  setFilters,
  setPlaceQuery,
  setSelectedId,
}: Options): void {
  useEffect(() => {
    if (
      restoredFromStorageRef.current ||
      urlHasViewport ||
      hasUrlSearchFilters(searchParams)
    ) {
      return;
    }
    const persisted = loadPersistedMapView();
    if (!persisted) return;

    restoredFromStorageRef.current = true;
    const nextFilters = { ...filtersRef.current };
    let filtersChanged = false;
    if (persisted.category && persisted.category !== nextFilters.category) {
      nextFilters.category = persisted.category;
      filtersChanged = true;
    }
    if (persisted.sort && persisted.sort !== nextFilters.sort) {
      nextFilters.sort = persisted.sort as ListingFilters["sort"];
      filtersChanged = true;
    }
    if (persisted.priceMin != null && persisted.priceMin !== nextFilters.priceMin) {
      nextFilters.priceMin = persisted.priceMin;
      filtersChanged = true;
    }
    if (persisted.priceMax != null && persisted.priceMax !== nextFilters.priceMax) {
      nextFilters.priceMax = persisted.priceMax;
      filtersChanged = true;
    }
    if (filtersChanged) {
      setFilters(nextFilters);
      filtersRef.current = nextFilters;
    }
    if (persisted.placeQuery) {
      setPlaceQuery(persisted.placeQuery);
      placeQueryRef.current = persisted.placeQuery;
    }
    if (!urlSelectedId && persisted.selectedId) {
      setSelectedId(persisted.selectedId);
      selectedIdRef.current = persisted.selectedId;
    }
  }, [
    searchParams,
    urlHasViewport,
    urlSelectedId,
    restoredFromStorageRef,
    filtersRef,
    placeQueryRef,
    selectedIdRef,
    setFilters,
    setPlaceQuery,
    setSelectedId,
  ]);
}
