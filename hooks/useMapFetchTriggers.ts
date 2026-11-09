"use client";

import { useEffect, useRef, type RefObject } from "react";
import { listingFiltersFetchKey, type ListingFilters } from "@/lib/listing-filters";
import { shouldRefetchOnFilters, shouldRefetchOnVisibility } from "@/lib/map-fetch-triggers";

/**
 * Refetch map listings when the tab refocuses or server-side filters change.
 *
 * Callbacks are read through refs so a new function identity (re-render) can
 * never re-run these effects — only real visibility or filter changes do.
 */
export function useMapFetchTriggers(opts: {
  mapRef: RefObject<google.maps.Map | null>;
  pageVisible: boolean;
  filters: ListingFilters;
  scheduleFetchBounds: (map: google.maps.Map, force?: boolean) => void;
  invalidateFetchCache: () => void;
}) {
  const { mapRef, pageVisible, filters, scheduleFetchBounds, invalidateFetchCache } = opts;

  const scheduleRef = useRef(scheduleFetchBounds);
  const invalidateRef = useRef(invalidateFetchCache);
  useEffect(() => {
    scheduleRef.current = scheduleFetchBounds;
    invalidateRef.current = invalidateFetchCache;
  });

  const wasVisibleRef = useRef(pageVisible);
  useEffect(() => {
    const regained = shouldRefetchOnVisibility(wasVisibleRef.current, pageVisible);
    wasVisibleRef.current = pageVisible;
    if (regained && mapRef.current) scheduleRef.current(mapRef.current, true);
  }, [pageVisible, mapRef]);

  const lastFilterFetchKeyRef = useRef(listingFiltersFetchKey(filters));
  useEffect(() => {
    const key = listingFiltersFetchKey(filters);
    if (!shouldRefetchOnFilters(lastFilterFetchKeyRef.current, key)) return;
    lastFilterFetchKeyRef.current = key;
    invalidateRef.current();
    if (mapRef.current) scheduleRef.current(mapRef.current, true);
  }, [filters, mapRef]);
}
