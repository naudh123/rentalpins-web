"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { googleMapsApiKey } from "@/lib/config";
import { useRentalPinsMapsLoader } from "@/lib/google-maps-loader";
import {
  countActiveFilters,
  type ListingFilters,
} from "@/lib/listing-filters";
import { boundsFromMap } from "@/lib/map-viewport";
import { mapViewCanReset } from "@/lib/map-reset-view";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/lib/map-viewport";
import type { MapAreaShape } from "@/lib/map-area";
import { mapPinLabelTier } from "@/lib/map-zoom-tier";
import { useMapFilteredListings } from "@/hooks/useMapFilteredListings";
import {
  useMapSearchOrchestration,
  useMapUrlRestoration,
} from "@/hooks/useMapSearchOrchestration";
import { useMapEmptyActions } from "@/hooks/useMapEmptyActions";
import { useMapResultsPanelProps } from "@/hooks/useMapResultsPanelProps";
import { useMapCanvasProps } from "@/hooks/useMapCanvasProps";
import { useMapCanvasPlaceSearchProps } from "@/hooks/useMapCanvasPlaceSearchProps";
import { useMapCanvasPreviewProps } from "@/hooks/useMapCanvasPreviewProps";
import { useMapBuildingPreview } from "@/hooks/useMapBuildingPreview";
import { useMapFocusListingOnPage } from "@/hooks/useMapFocusListingOnPage";
import { useMapViewActions } from "@/hooks/useMapViewActions";
import { useMapMobileInteractions } from "@/hooks/useMapMobileInteractions";
import { useMapKeyboardBridge } from "@/hooks/useMapKeyboardBridge";
import { useMapListingImpressions } from "@/hooks/useMapListingImpressions";
import { useMapPlaceSearch } from "@/hooks/useMapPlaceSearch";
import { useMapPanelWidth } from "@/hooks/useMapPanelWidth";
import { useMapListingsFetch } from "@/hooks/useMapListingsFetch";
import { useMapFilterActions } from "@/hooks/useMapFilterActions";
import { useMapLifecycleCleanup } from "@/hooks/useMapLifecycleCleanup";
import { usePersistedMobileMapView } from "@/hooks/usePersistedMobileMapView";
import { useMapEmptyState } from "@/hooks/useMapEmptyState";
import { useMapDrawGestures } from "@/hooks/useMapDrawGestures";
import { useMapViewportHints } from "@/hooks/useMapViewportHints";
import { useMapResultsMeta } from "@/hooks/useMapResultsMeta";
import { useMapFetchTriggers } from "@/hooks/useMapFetchTriggers";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useMapSelection } from "@/hooks/useMapSelection";
import { applyMapViewSurface } from "@/lib/map-styles";
import type { MapViewMode } from "@/lib/map-view-mode";
import {
  hasUrlMapViewport,
  type PersistedMapView,
} from "@/lib/map-last-view";
import { parseSearchUrlState } from "@/lib/search-url";
import { MAP_SEARCH_INPUT_ID } from "@/lib/map-search-input";
import type { MapBounds } from "@/lib/types/saved-search";
import {
  trackEvent,
} from "@/lib/ga4";
import MapCanvas from "@/components/map/MapCanvas";
import MapResultsPanel from "@/components/map/MapResultsPanel";
import type { DrawMode } from "@/components/map/MapDrawAreaController";

const DEFAULT_CENTER = DEFAULT_MAP_CENTER;
const DEFAULT_ZOOM = DEFAULT_MAP_ZOOM;
interface Props {
  initialListings?: ListingCardData[];
  initialTotalInBounds?: number;
  initialFilteredCount?: number;
  initialResultsMayBeIncomplete?: boolean;
  initialPrefixCapActive?: boolean;
}

export default function SearchMap({
  initialListings = [],
  initialTotalInBounds,
  initialFilteredCount,
  initialResultsMayBeIncomplete = false,
  initialPrefixCapActive,
}: Props) {
  const searchParams = useSearchParams();
  const urlState = useMemo(
    () => parseSearchUrlState(searchParams),
    [searchParams]
  );
  const urlHasViewport = useMemo(
    () => hasUrlMapViewport(searchParams),
    [searchParams]
  );

  const [filters, setFilters] = useState<ListingFilters>(urlState.filters);
  const { mobileView, setMobileView } = usePersistedMobileMapView();
  const { panelWidth, startPanelResize } = useMapPanelWidth();
  const [drawnShape, setDrawnShape] = useState<MapAreaShape | null>(urlState.drawnArea);
  const [drawMode, setDrawMode] = useState<DrawMode | null>(null);
  /** Sidebar / save-search only — do not pass to GoogleMap (avoids pan lock). */
  const [mapZoom, setMapZoom] = useState(urlState.zoom ?? DEFAULT_ZOOM);
  const [mapViewMode, setMapViewMode] = useState<MapViewMode>("auto");
  const pinLabelTier = useMemo(() => mapPinLabelTier(mapZoom), [mapZoom]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => ({
    lat: urlState.centerLat ?? DEFAULT_CENTER.lat,
    lng: urlState.centerLng ?? DEFAULT_CENTER.lng,
  }));
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(urlState.bounds);
  const [placeQuery, setPlaceQuery] = useState(urlState.placeQuery ?? "");
  const [textQuery, setTextQuery] = useState(urlState.keywords ?? "");
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapRegionRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sheetHandleRef = useRef<HTMLButtonElement | null>(null);
  const resultsPanelRef = useRef<HTMLElement | null>(null);
  const sheetLastTriggerRef = useRef<HTMLElement | null>(null);
  const lastExternalViewKeyRef = useRef<string | null>(null);
  const restoredViewTrackedRef = useRef(false);
  const restoredFromStorageRef = useRef(false);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const placeQueryRef = useRef(placeQuery);
  placeQueryRef.current = placeQuery;
  const textQueryRef = useRef(textQuery);
  textQueryRef.current = textQuery;
  const selectedIdRef = useRef<string | null>(urlState.selectedId);
  const drawnShapeRef = useRef<MapAreaShape | null>(urlState.drawnArea);
  drawnShapeRef.current = drawnShape;
  useEffect(() => {
    if (!mapInstance) return;
    applyMapViewSurface(mapInstance, mapViewMode, mapZoom);
  }, [mapInstance, mapViewMode, mapZoom]);

  const onFetchedRef = useRef<(map: google.maps.Map) => void>(() => {});

  const { visible: pageVisible, visibleRef: pageVisibleRef } = usePageVisible();

  const {
    rawListings,
    totalInBounds,
    serverFilteredCount,
    resultsMayBeIncomplete,
    prefixCapActive: serverPrefixCapActive,
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
  } = useMapListingsFetch({
    initial: {
      listings: initialListings,
      totalInBounds: initialTotalInBounds,
      filteredCount: initialFilteredCount,
      resultsMayBeIncomplete: initialResultsMayBeIncomplete,
      prefixCapActive: initialPrefixCapActive,
    },
    filtersRef,
    pageVisibleRef,
    onFetched: (map) => onFetchedRef.current(map),
  });

  const {
    syncViewFromMap,
    skipMapSyncRef,
    scheduleUrlSync,
    syncUrlNow,
    cancelUrlSync,
    lastSyncedQueryRef,
    setLastSyncedQuery,
    handleMapIdle,
  } = useMapSearchOrchestration({
    mapRef,
    view: { mapCenter, mapZoom, mapBounds },
    refs: { filtersRef, placeQueryRef, textQueryRef, selectedIdRef, drawnShapeRef },
    fetch: {
      pruneToViewport,
      scheduleFetchBounds,
      lastFetchedBoundsRef,
      lastFetchedZoomRef,
      skipNextIdleFetchRef,
    },
    setMapCenter,
    setMapZoom,
    setMapBounds,
  });

  onFetchedRef.current = syncViewFromMap;

  useMapFetchTriggers({
    mapRef,
    pageVisible,
    filters,
    scheduleFetchBounds,
    invalidateFetchCache,
  });

  const {
    filteredListings,
    listings,
    listDisplayItems,
    listPage,
    setListPage,
    listTotalPages,
    paginatedListItems,
  } = useMapFilteredListings({
    rawListings,
    filters,
    textQuery,
    drawnShape,
  });

  const activeFilterCount = countActiveFilters(filters);

  const lastKeywordSyncedRef = useRef(urlState.keywords ?? "");
  useEffect(() => {
    const kw = textQuery.trim();
    if (kw === lastKeywordSyncedRef.current) return;
    lastKeywordSyncedRef.current = kw;
    textQueryRef.current = textQuery;
    scheduleUrlSync();
  }, [textQuery, scheduleUrlSync]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [listPage, listRef]);

  const clearKeywordFilter = useCallback(
    (source: "chip" | "empty_state" = "chip") => {
      setTextQuery("");
      textQueryRef.current = "";
      lastKeywordSyncedRef.current = "";
      scheduleUrlSync();
      trackEvent("map_keywords_cleared", { source });
    },
    [scheduleUrlSync]
  );

  const {
    setMobileViewTracked,
    openMobileSheet,
    cycleMobileView,
  } = useMapMobileInteractions({
    mobileView,
    setMobileView,
    mapRegionRef,
    resultsPanelRef,
    sheetHandleRef,
    sheetLastTriggerRef,
  });

  const buildPersistedView = useCallback((map: google.maps.Map): PersistedMapView | null => {
    const c = map.getCenter();
    if (!c) return null;
    const bounds = boundsFromMap(map);
    return {
      centerLat: c.lat(),
      centerLng: c.lng(),
      zoom: map.getZoom() ?? DEFAULT_ZOOM,
      bounds: bounds ?? undefined,
      selectedId: selectedIdRef.current,
      placeQuery: placeQueryRef.current.trim() || null,
      category: filtersRef.current.category,
      sort: filtersRef.current.sort,
      priceMin: filtersRef.current.priceMin,
      priceMax: filtersRef.current.priceMax,
    };
  }, []);

  const {
    selectedId,
    setSelectedId,
    highlightedId,
    selected,
    highlightListing,
    focusListing,
    clearSelection,
  } = useMapSelection({
    mapRef,
    listRef,
    listings,
    loading,
    initialSelectedId: urlState.selectedId,
    selectedIdRef,
    buildPersistedView,
    scheduleUrlSync,
    onInitialSelectedFromUrl: () => {
      if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
        openMobileSheet("selected_from_url");
      }
    },
    skipMapSyncRef,
  });

  const { applyMapFromUrlState, resetMapView, fitAllListings: fitAllListingsOnMap } =
    useMapViewActions({
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
    });

  const fitAllListings = useCallback(() => {
    fitAllListingsOnMap(listings, mobileView);
  }, [fitAllListingsOnMap, listings, mobileView]);

  const {
    resultsCountInfo,
    showListSkeletons,
    mapPinStatusText,
    liveStatusText,
    prefixCapActive,
  } = useMapResultsMeta({
    listings,
    filteredListings,
    drawnShape,
    totalInBounds,
    loading,
    refreshing,
    resultsMayBeIncomplete,
    serverPrefixCapActive,
    mapZoom,
    mapBounds,
    activeFilterCount,
    textQuery,
    fetchError,
    selected,
  });

  const [spiderfyEpoch, setSpiderfyEpoch] = useState(0);

  const { selectedBuildingListings, showBuildingPreview } = useMapBuildingPreview({
    selectedId,
    mapZoom,
    listings,
  });

  const focusListingOnPage = useMapFocusListingOnPage({
    listDisplayItems,
    listPage,
    setListPage,
    focusListing,
  });

  const previewProps = useMapCanvasPreviewProps({
    selected,
    selectedBuildingListings,
    showBuildingPreview,
    clearSelection,
    focusListingOnPage,
  });

  const initialMapViewRef = useRef({
    center: {
      lat: urlState.centerLat ?? DEFAULT_CENTER.lat,
      lng: urlState.centerLng ?? DEFAULT_CENTER.lng,
    },
    zoom: urlState.zoom ?? DEFAULT_ZOOM,
  });

  const { isLoaded, loadError } = useRentalPinsMapsLoader();

  useEffect(() => {
    if (!loadError) return;
    trackEvent("search_map_loader_failed", {
      message: loadError.message || "maps_loader_error",
    });
  }, [loadError]);

  const canResetView = useMemo(
    () =>
      mapViewCanReset({
        filters,
        placeQuery,
        textQuery,
        mapCenter,
        mapZoom,
        drawnShape,
        defaultCenter: DEFAULT_CENTER,
        defaultZoom: DEFAULT_ZOOM,
      }),
    [filters, placeQuery, textQuery, mapCenter, mapZoom, drawnShape]
  );

  const mapPinsPaused = !pageVisible;

  const mapEmpty = useMapEmptyState({
    listingCount: listings.length,
    totalInBounds,
    filteredListingsCount: filteredListings.length,
    drawnShape,
    loading,
    refreshing,
    areaMayHaveMore: resultsCountInfo.areaMayHaveMore,
    activeFilterCount,
    textQuery,
    drawMode,
  });

  const {
    densityHint,
    dismissDensityBanner,
    showLowZoomHint,
    dismissLowZoomHint,
    showEmptyPeekHint,
    dismissEmptyPeekHint,
  } = useMapViewportHints({
    mapBounds,
    mapZoom,
    totalInBounds,
    listingsCount: listings.length,
    resultsMayBeIncomplete,
    serverFilteredCount,
    textQuery,
    mobileView,
    prefixCapActive,
    mapEmpty: {
      showMapEmpty: mapEmpty.showMapEmpty,
      variant: mapEmpty.variant,
      effectiveTotalInBounds: mapEmpty.effectiveTotalInBounds,
      filtersActive: mapEmpty.filtersActive,
      keywordsActive: mapEmpty.keywordsActive,
      drawnAreaActive: mapEmpty.drawnAreaActive,
    },
  });

  useMapDrawGestures(mapInstance, drawMode);

  const zoomInForMore = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const z = map.getZoom() ?? DEFAULT_ZOOM;
    // Let the idle handler run normally so the finer geohash tier is refetched
    // and the URL/zoom is synced — the whole point of "zoom in for more".
    map.setZoom(Math.min(z + 1, 20));
    trackEvent("map_density_zoom_in_clicked");
  }, []);

  const {
    handleFiltersChange,
    clearFiltersOnly,
    clearKeywordsFromEmpty,
    handleDrawnShapeChange,
    clearDrawnAreaFromEmpty,
  } = useMapFilterActions({
    activeFilterCount,
    drawnShape,
    keywordsActive: mapEmpty.keywordsActive,
    filtersRef,
    drawnShapeRef,
    selectedIdRef,
    setFilters,
    setSelectedId,
    setDrawnShape,
    scheduleUrlSync,
    syncUrlNow,
    clearKeywordFilter,
  });

  const handleClusterZoom = useCallback(() => {
    skipNextIdleFetchRef.current = true;
  }, [skipNextIdleFetchRef]);

  const { canvasEmpty, panelEmpty } = useMapEmptyActions(
    mapEmpty,
    clearFiltersOnly,
    clearKeywordsFromEmpty,
    clearDrawnAreaFromEmpty,
    zoomInForMore
  );

  const { flyToPlace, clearLocationSearch, useCurrentLocation, handleAiSearch } =
    useMapPlaceSearch({
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
    });

  const placeSearchProps = useMapCanvasPlaceSearchProps({
    placeQuery,
    textQuery,
    onPlaceResult: flyToPlace,
    onClearPlace: clearLocationSearch,
    onUseCurrentLocation: useCurrentLocation,
    onAiSearch: handleAiSearch,
    onClearKeywords: clearKeywordFilter,
  });

  useMapUrlRestoration({
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
  });

  useMapLifecycleCleanup({
    mapRef,
    abortFetch,
    cancelUrlSync,
    buildPersistedView,
  });

  useMapListingImpressions({ listings });

  const handleMapClick = useCallback(() => {
    setSpiderfyEpoch((n) => n + 1);
    if (!drawMode) clearSelection();
  }, [drawMode, clearSelection]);

  const handleFetchRetry = useCallback(() => {
    if (loading) return;
    trackEvent("map_fetch_retry_clicked");
    if (mapRef.current) void fetchBounds(mapRef.current, true);
  }, [loading, fetchBounds]);

  const canvasProps = useMapCanvasProps({
    mapRegionRef,
    mapRef,
    mobileView,
    mapPinStatusText,
    initialMapView: initialMapViewRef.current,
    urlState,
    urlHasViewport,
    restoredFromStorageRef,
    mapInstance,
    onMapInstance: setMapInstance,
    invalidateFetchCache,
    syncViewFromMap,
    onMapLoad: (map) => scheduleFetchBounds(map, true),
    onMapIdle: handleMapIdle,
    onMapClick: handleMapClick,
    mapViewMode,
    onMapViewModeChange: setMapViewMode,
    mapZoom,
    listings,
    selectedId,
    highlightedId,
    pinLabelTier,
    spiderfyEpoch,
    onClusterZoom: handleClusterZoom,
    onSelectListing: (listing) => focusListingOnPage(listing, "pin"),
    drawMode,
    drawnShape,
    onDrawnShapeChange: handleDrawnShapeChange,
    onDrawModeChange: setDrawMode,
    densityHint,
    onDismissDensityBanner: dismissDensityBanner,
    showLowZoomHint,
    onDismissLowZoomHint: dismissLowZoomHint,
    mapPinsPaused,
    onFitAll: listings.length >= 2 ? fitAllListings : undefined,
    resultsCountInfo,
    listPage,
    listTotalPages,
    ...placeSearchProps,
    loading,
    refreshing,
    fetchError,
    onFetchRetry: handleFetchRetry,
    ...previewProps,
    onMobileViewChange: setMobileViewTracked,
    onOpenListFromEmpty: () => setMobileViewTracked("list", "empty_peek_hint"),
    showEmptyPeekHint,
    onDismissEmptyPeekHint: dismissEmptyPeekHint,
    ...canvasEmpty,
  });

  useMapKeyboardBridge({
    listings,
    selectedId,
    mapSearchInputId: MAP_SEARCH_INPUT_ID,
    mapRegionRef,
    onClearSelection: clearSelection,
    onNavigateListing: (l) => focusListingOnPage(l, "keyboard"),
    onFitAll: listings.length >= 2 ? fitAllListings : undefined,
    onCycleMobileView: cycleMobileView,
    loading,
  });

  const resultsPanelProps = useMapResultsPanelProps({
    panelRef: resultsPanelRef,
    sheetHandleRef,
    listRef,
    panelWidth,
    mobileView,
    onMobileViewChange: (view, method) => setMobileViewTracked(view, method),
    onSheetTrigger: (el) => {
      sheetLastTriggerRef.current = el;
    },
    onPanelResizeStart: startPanelResize,
    filters,
    onFiltersChange: handleFiltersChange,
    listings,
    filteredListings,
    totalInBounds,
    mapZoom,
    resultsMayBeIncomplete,
    loading,
    refreshing,
    fetchError,
    drawnShape,
    mapBounds,
    mapCenter,
    placeQuery,
    textQuery,
    selectedId,
    highlightedId,
    listDisplayItems,
    paginatedListItems,
    listPage,
    listTotalPages,
    onListPageChange: setListPage,
    showListSkeletons,
    liveStatusText,
    countInfo: resultsCountInfo,
    activeFilterCount,
    canResetView,
    onFitAll: fitAllListings,
    onResetView: resetMapView,
    onHighlight: highlightListing,
    onSelectListing: (l) => focusListingOnPage(l, "list"),
    ...panelEmpty,
  });

  if (!googleMapsApiKey) {
    const envHint =
      process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
        ? "Vercel → Project → Settings → Environment Variables → Production"
        : ".env.local";
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-xl border border-[var(--border)] p-6 text-center text-[var(--muted)]">
        Set <code className="text-[var(--accent)]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in{" "}
        {envHint} to enable the map.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 rounded-xl border border-[var(--border)] p-6 text-center text-[var(--muted)]">
        <p className="font-medium text-[var(--brand-navy)]">Map failed to load</p>
        <p className="max-w-md text-sm">
          Check{" "}
          <code className="text-[var(--accent)]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in
          .env.local — enable <strong>Maps JavaScript API</strong> and{" "}
          <strong>Places API</strong> in Google Cloud, and allow{" "}
          <code className="text-[var(--accent)]">localhost</code> if the key is HTTP-referrer
          restricted.
        </p>
        <button
          type="button"
          className="rp-btn rp-btn-secondary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-[var(--muted)]">
        Loading map…
      </div>
    );
  }

  return (
    <div className="relative flex rp-map-layout flex-col md:flex-row">
      <MapCanvas {...canvasProps} />

      <MapResultsPanel {...resultsPanelProps} />
    </div>
  );
}
