"use client";

import { useEffect, useRef, type RefObject } from "react";
import { listingFiltersFetchKey, type ListingFilters } from "@/lib/listing-filters";

/** Refetch map listings when tab refocuses or server-side filters change. */
export function useMapFetchTriggers(opts: {
  mapRef: RefObject<google.maps.Map | null>;
  pageVisible: boolean;
  filters: ListingFilters;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
  invalidateFetchCache: () => void;
}) {
  const { mapRef, pageVisible, filters, scheduleFetchBounds, invalidateFetchCache } = opts;

  useEffect(() => {
    if (!pageVisible || !mapRef.current) return;
    scheduleFetchBounds(mapRef.current, true);
  }, [pageVisible, scheduleFetchBounds, mapRef]);

  const lastFilterFetchKeyRef = useRef(listingFiltersFetchKey(filters));
  useEffect(() => {
    const key = listingFiltersFetchKey(filters);
    if (key === lastFilterFetchKeyRef.current) return;
    lastFilterFetchKeyRef.current = key;
    invalidateFetchCache();
    if (mapRef.current) scheduleFetchBounds(mapRef.current, true);
  }, [filters, invalidateFetchCache, scheduleFetchBounds, mapRef]);
}
