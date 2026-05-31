"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { trackEvent } from "@/lib/ga4";
import {
  flushPersistedMapView,
  type PersistedMapView,
} from "@/lib/map-last-view";
import {
  ensureMobileListingFocusZoom,
  isMobileMapLayout,
} from "@/lib/map-mobile";

export type MapSelectionSource = "pin" | "list" | "keyboard" | "hover";

interface Options {
  mapRef: RefObject<google.maps.Map | null>;
  listRef: RefObject<HTMLDivElement | null>;
  listings: ListingCardData[];
  loading: boolean;
  initialSelectedId?: string | null;
  selectedIdRef: React.MutableRefObject<string | null>;
  buildPersistedView: (map: google.maps.Map) => PersistedMapView | null;
  scheduleUrlSync: () => void;
  onPinSelectedMobile?: () => void;
  /** Called once when `initialSelectedId` resolves in loaded listings (deep link). */
  onInitialSelectedFromUrl?: () => void;
  /** Set true before imperative pan/zoom to avoid URL idle loops. */
  skipMapSyncRef?: React.MutableRefObject<boolean>;
}

export function useMapSelection({
  mapRef,
  listRef,
  listings,
  loading,
  initialSelectedId = null,
  selectedIdRef,
  buildPersistedView,
  scheduleUrlSync,
  onPinSelectedMobile,
  onInitialSelectedFromUrl,
  skipMapSyncRef,
}: Options) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightedIdRef = useRef<string | null>(null);
  const initialSelectedAppliedRef = useRef(false);
  const onInitialSelectedFromUrlRef = useRef(onInitialSelectedFromUrl);
  onInitialSelectedFromUrlRef.current = onInitialSelectedFromUrl;
  selectedIdRef.current = selectedId;
  highlightedIdRef.current = highlightedId;

  const selected = useMemo(
    () => listings.find((l) => l.id === selectedId) ?? null,
    [listings, selectedId]
  );

  const highlightListing = useCallback((listing: ListingCardData | null) => {
    const id = listing?.id ?? null;
    if (id === highlightedIdRef.current) return;
    setHighlightedId(id);
    highlightedIdRef.current = id;
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    selectedIdRef.current = null;
    setHighlightedId(null);
    highlightedIdRef.current = null;
    const googleMap = mapRef.current;
    if (googleMap) {
      const view = buildPersistedView(googleMap);
      if (view) flushPersistedMapView(view);
    }
    scheduleUrlSync();
  }, [buildPersistedView, mapRef, scheduleUrlSync]);

  const focusListing = useCallback(
    (listing: ListingCardData, source: MapSelectionSource = "list") => {
      setHighlightedId(listing.id);
      highlightedIdRef.current = listing.id;
      if (source === "hover") return;

      setSelectedId(listing.id);
      selectedIdRef.current = listing.id;
      if (source === "pin" || source === "keyboard") {
        trackEvent("listing_pin_clicked", { listing_id: listing.id });
      }
      const googleMap = mapRef.current;
      if (googleMap) {
        const view = buildPersistedView(googleMap);
        if (view) flushPersistedMapView(view);
        if (skipMapSyncRef) skipMapSyncRef.current = true;
        googleMap.panTo({ lat: listing.lat, lng: listing.lng });
        if (isMobileMapLayout()) ensureMobileListingFocusZoom(googleMap);
        else if ((googleMap.getZoom() ?? 0) < 15) googleMap.setZoom(15);
      }
      scheduleUrlSync();
    },
    [buildPersistedView, mapRef, scheduleUrlSync, skipMapSyncRef]
  );

  useEffect(() => {
    if (!initialSelectedId || initialSelectedAppliedRef.current) return;
    const found = listings.find((l) => l.id === initialSelectedId);
    if (!found) return;
    initialSelectedAppliedRef.current = true;
    setHighlightedId(found.id);
    highlightedIdRef.current = found.id;
    setSelectedId(found.id);
    selectedIdRef.current = found.id;
    const googleMap = mapRef.current;
    if (googleMap) {
      if (skipMapSyncRef) skipMapSyncRef.current = true;
      googleMap.panTo({ lat: found.lat, lng: found.lng });
      if (isMobileMapLayout()) ensureMobileListingFocusZoom(googleMap);
      else if ((googleMap.getZoom() ?? 0) < 15) googleMap.setZoom(15);
    }
    onInitialSelectedFromUrlRef.current?.();
  }, [initialSelectedId, listings, mapRef, skipMapSyncRef]);

  const scrollListingIntoList = useCallback(
    (listingId: string | null) => {
      if (!listingId || !listRef.current) return;
      const el = listRef.current.querySelector(`[data-listing-id="${listingId}"]`);
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    },
    [listRef]
  );

  useEffect(() => {
    scrollListingIntoList(selectedId);
  }, [scrollListingIntoList, selectedId]);

  useEffect(() => {
    if (!highlightedId || highlightedId === selectedId) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }
    scrollListingIntoList(highlightedId);
  }, [highlightedId, selectedId, scrollListingIntoList]);

  useEffect(() => {
    if (!selectedId) return;
    if (loading && listings.length === 0) return;
    if (listings.some((l) => l.id === selectedId)) return;
    setSelectedId(null);
    selectedIdRef.current = null;
    trackEvent("map_selection_cleared", { reason: "listing_unavailable" });
    scheduleUrlSync();
  }, [listings, loading, selectedId, scheduleUrlSync]);

  return {
    selectedId,
    setSelectedId,
    highlightedId,
    selected,
    highlightListing,
    focusListing,
    clearSelection,
  };
}
