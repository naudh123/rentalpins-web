"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { apiUrl, apiUrlFallback } from "@/lib/api";
import { boundsForMap, buildBoundsFetchKey, DEFAULT_MAP_ZOOM } from "@/lib/map-viewport";
import {
  boundsWithZoomPadding,
  expandMapBounds,
  listingInBounds,
  mergeViewportListings,
  pruneListingsToViewport,
  viewportPaddingRatio,
} from "@/lib/map-listings-merge";
import type { MapBounds } from "@/lib/types/saved-search";
import {
  appendListingFiltersToParams,
  listingFiltersFetchKey,
  type ListingFilters,
} from "@/lib/listing-filters";

interface InitialData {
  listings: ListingCardData[];
  totalInBounds?: number;
  /** Listings matching server-side filters (category, price, etc.). */
  filteredCount?: number;
  resultsMayBeIncomplete?: boolean;
  prefixCapActive?: boolean;
}

interface Options {
  initial: InitialData;
  filtersRef: React.MutableRefObject<ListingFilters>;
  pageVisibleRef?: React.MutableRefObject<boolean>;
  onFetched?: (map: google.maps.Map) => void;
}

export function useMapListingsFetch({
  initial,
  filtersRef,
  pageVisibleRef,
  onFetched,
}: Options) {
  const [rawListings, setRawListings] = useState<ListingCardData[]>(initial.listings);
  const [totalInBounds, setTotalInBounds] = useState(
    initial.totalInBounds ?? initial.listings.length
  );
  const [serverFilteredCount, setServerFilteredCount] = useState(
    initial.filteredCount ?? initial.listings.length
  );
  const [resultsMayBeIncomplete, setResultsMayBeIncomplete] = useState(
    initial.resultsMayBeIncomplete ?? false
  );
  const [prefixCapActive, setPrefixCapActive] = useState<boolean | null>(
    initial.prefixCapActive != null ? initial.prefixCapActive : null
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchGenerationRef = useRef(0);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const lastFetchedBoundsRef = useRef<MapBounds | null>(null);
  const lastFetchedZoomRef = useRef<number | null>(null);
  const lastFetchKeyRef = useRef<string | null>(null);
  const lastEmptyFetchAtRef = useRef(0);
  const skipNextIdleFetchRef = useRef(false);
  const listingsLengthRef = useRef(initial.listings.length);

  const EMPTY_REFETCH_MIN_MS = 4000;

  useEffect(() => {
    listingsLengthRef.current = rawListings.length;
  }, [rawListings.length]);

  const fetchBounds = useCallback(
    async (map: google.maps.Map, force = false) => {
      if (pageVisibleRef && !pageVisibleRef.current) return;

      const strictBounds = boundsForMap(map);
      const zoom = map.getZoom() ?? DEFAULT_MAP_ZOOM;
      const fetchBoundsExpanded = expandMapBounds(
        strictBounds,
        viewportPaddingRatio(zoom)
      );
      const filters = filtersRef.current;
      const fetchKey = `${buildBoundsFetchKey(strictBounds)}|z${zoom}|${listingFiltersFetchKey(filters)}`;

      if (!force && fetchKey === lastFetchKeyRef.current) {
        onFetched?.(map);
        return;
      }

      if (
        !force &&
        listingsLengthRef.current === 0 &&
        lastEmptyFetchAtRef.current > 0 &&
        Date.now() - lastEmptyFetchAtRef.current < EMPTY_REFETCH_MIN_MS
      ) {
        onFetched?.(map);
        return;
      }

      fetchAbortRef.current?.abort();
      const abortController = new AbortController();
      fetchAbortRef.current = abortController;
      const generation = ++fetchGenerationRef.current;
      const isInitialLoad = listingsLengthRef.current === 0 && !lastFetchKeyRef.current;
      if (isInitialLoad) setLoading(true);
      else if (listingsLengthRef.current > 0) setRefreshing(true);
      setFetchError("");

      try {
        const params = new URLSearchParams({
          north: String(fetchBoundsExpanded.north),
          south: String(fetchBoundsExpanded.south),
          east: String(fetchBoundsExpanded.east),
          west: String(fetchBoundsExpanded.west),
          zoom: String(zoom),
        });
        appendListingFiltersToParams(params, filters);
        const query = params.toString();
        const primaryUrl = `${apiUrl("/api/listings")}?${query}`;
        let res = await fetch(primaryUrl, { signal: abortController.signal });

        if (res.status === 404) {
          const fallback = apiUrlFallback("/api/listings");
          if (fallback) {
            res = await fetch(`${fallback}?${query}`, { signal: abortController.signal });
          }
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const hint =
            typeof body.hint === "string"
              ? body.hint
              : typeof body.error === "string"
                ? body.error
                : res.status === 404
                  ? "Listings API not found. Use http://localhost:3000/search locally (not /staging/search unless NEXT_PUBLIC_BASE_PATH=/staging is set)."
                  : `Server error (${res.status})`;
          setFetchError(hint);
          return;
        }

        const data = await res.json();
        if (generation !== fetchGenerationRef.current) return;
        lastFetchedBoundsRef.current = strictBounds;
        lastFetchedZoomRef.current = zoom;
        lastFetchKeyRef.current = fetchKey;
        const fetchedRaw = Array.isArray(data.listings) ? data.listings : [];
        const activeBounds = boundsWithZoomPadding(strictBounds, zoom);
        const fetchedInView = fetchedRaw.filter((l: ListingCardData) =>
          listingInBounds(l, activeBounds)
        );
        const apiTotal =
          typeof data.totalInBounds === "number" ? data.totalInBounds : fetchedInView.length;
        const apiFiltered =
          typeof data.filteredCount === "number" ? data.filteredCount : fetchedInView.length;
        let mergedCount = fetchedInView.length;
        setRawListings((prev) => {
          const pruned = pruneListingsToViewport(prev, strictBounds, zoom);
          const next = mergeViewportListings(pruned, fetchedInView, strictBounds, zoom);
          mergedCount = next.length;
          return next;
        });
        setTotalInBounds(Math.max(apiTotal, mergedCount));
        setServerFilteredCount(Math.max(apiFiltered, mergedCount));
        setResultsMayBeIncomplete(Boolean(data.resultsMayBeIncomplete));
        setPrefixCapActive(
          typeof data.prefixCapActive === "boolean" ? data.prefixCapActive : false
        );
        if (mergedCount === 0) lastEmptyFetchAtRef.current = Date.now();
        else lastEmptyFetchAtRef.current = 0;
        onFetched?.(map);
      } catch (e) {
        if (abortController.signal.aborted) return;
        if (generation !== fetchGenerationRef.current) return;
        const msg =
          e instanceof Error ? e.message : "Could not load listings for this area";
        setFetchError(msg);
        console.error("Map listings fetch failed:", e);
      } finally {
        if (fetchAbortRef.current === abortController) fetchAbortRef.current = null;
        if (generation === fetchGenerationRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [filtersRef, onFetched, pageVisibleRef]
  );

  const scheduleFetchBounds = useCallback(
    (map: google.maps.Map, force = false) => {
      if (pageVisibleRef && !pageVisibleRef.current) return;
      if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
      fetchDebounceRef.current = setTimeout(() => {
        void fetchBounds(map, force);
      }, 400);
    },
    [fetchBounds, pageVisibleRef]
  );

  const invalidateFetchCache = useCallback(() => {
    lastFetchedBoundsRef.current = null;
    lastFetchedZoomRef.current = null;
    lastFetchKeyRef.current = null;
    lastEmptyFetchAtRef.current = 0;
  }, []);

  const pruneToViewport = useCallback((map: google.maps.Map) => {
    const strictBounds = boundsForMap(map);
    const zoom = map.getZoom() ?? DEFAULT_MAP_ZOOM;
    setRawListings((prev) => {
      if (prev.length === 0) return prev;
      const next = pruneListingsToViewport(prev, strictBounds, zoom);
      if (next.length === prev.length) return prev;
      return next;
    });
  }, []);

  const abortFetch = useCallback(() => {
    fetchAbortRef.current?.abort();
    fetchAbortRef.current = null;
    if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
  }, []);

  return {
    rawListings,
    setRawListings,
    totalInBounds,
    serverFilteredCount,
    resultsMayBeIncomplete,
    prefixCapActive,
    loading,
    refreshing,
    fetchError,
    setFetchError,
    fetchBounds,
    scheduleFetchBounds,
    invalidateFetchCache,
    abortFetch,
    pruneToViewport,
    lastFetchedBoundsRef,
    lastFetchedZoomRef,
    lastFetchKeyRef,
    skipNextIdleFetchRef,
    listingsLengthRef,
  };
}
