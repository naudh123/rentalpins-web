"use client";

import type { RefObject } from "react";
import { AnimatePresence } from "framer-motion";
import { GoogleMap } from "@react-google-maps/api";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import type { MapAreaShape } from "@/lib/map-area";
import type { MapViewMode } from "@/lib/map-view-mode";
import { MAP_SATELLITE_AUTO_ZOOM } from "@/lib/map-view-mode";
import type { MapPinLabelTier } from "@/lib/map-zoom-tier";
import { MAP_ROADMAP_BACKGROUND, SILVER_MAP_OPTIONS, applyMapViewSurface } from "@/lib/map-styles";
import { DEFAULT_MAP_ZOOM } from "@/lib/map-viewport";
import type { SearchUrlState } from "@/lib/search-url";
import { loadPersistedMapView } from "@/lib/map-last-view";
import { trackEvent } from "@/lib/ga4";
import type { PlaceSearchResult } from "@/lib/map-place-search";
import type { MapEmptySurfaceProps } from "@/lib/map-empty-props";
import type { MapResultsCountInfo } from "@/lib/map-list-count";
import MapBuildingPreview from "@/components/map/MapBuildingPreview";
import MapListingPreview from "@/components/map/MapListingPreview";
import ListingMarkerCluster from "@/components/map/ListingMarkerCluster";
import MapDensityBanner from "@/components/map/MapDensityBanner";
import MapKeywordChip from "@/components/map/MapKeywordChip";
import MapDensityLayer from "@/components/map/MapDensityLayer";
import MapEmptyOverlay from "@/components/map/MapEmptyOverlay";
import MapEmptyPeekHint from "@/components/map/MapEmptyPeekHint";
import MapLowZoomHint from "@/components/map/MapLowZoomHint";
import MapDrawAreaController, { type DrawMode } from "@/components/map/MapDrawAreaController";
import MapDrawAreaTool from "@/components/map/MapDrawAreaTool";
import MapKeyboardHelp from "@/components/map/MapKeyboardHelp";
import MapMobileViewSwitcher, { type MapMobileView } from "@/components/map/MapMobileViewSwitcher";
import MapViewModeToggle from "@/components/map/MapViewModeToggle";
import MapLocationSearch from "@/components/map/MapLocationSearch";
import AiSearchBar from "@/components/map/AiSearchBar";

const DEFAULT_ZOOM = DEFAULT_MAP_ZOOM;

export interface MapCanvasProps extends MapEmptySurfaceProps {
  mapRegionRef: RefObject<HTMLDivElement | null>;
  mapRef: RefObject<google.maps.Map | null>;
  mobileView: MapMobileView;
  mapPinStatusText: string;
  initialMapView: { center: { lat: number; lng: number }; zoom: number };
  urlState: SearchUrlState;
  urlHasViewport: boolean;
  restoredFromStorageRef: RefObject<boolean>;
  mapInstance: google.maps.Map | null;
  onMapInstance: (map: google.maps.Map | null) => void;
  invalidateFetchCache: () => void;
  syncViewFromMap: (map: google.maps.Map) => void;
  onMapLoad: (map: google.maps.Map) => void;
  onMapIdle: () => void;
  onMapClick: () => void;
  mapViewMode: MapViewMode;
  onMapViewModeChange: (mode: MapViewMode) => void;
  mapZoom: number;
  listings: ListingCardData[];
  selectedId: string | null;
  highlightedId: string | null;
  pinLabelTier: MapPinLabelTier;
  spiderfyEpoch: number;
  onClusterZoom: () => void;
  onSelectListing: (listing: ListingCardData) => void;
  drawMode: DrawMode | null;
  drawnShape: MapAreaShape | null;
  onDrawnShapeChange: (shape: MapAreaShape | null) => void;
  onDrawModeChange: (mode: DrawMode | null) => void;
  densityHint: string | null;
  onDismissDensityBanner?: () => void;
  showLowZoomHint?: boolean;
  onDismissLowZoomHint?: () => void;
  onOpenListFromEmpty?: () => void;
  showEmptyPeekHint?: boolean;
  onDismissEmptyPeekHint?: () => void;
  mapPinsPaused?: boolean;
  onZoomInForMore: () => void;
  onFitAll?: () => void;
  resultsCountInfo: MapResultsCountInfo;
  listPage: number;
  listTotalPages: number;
  mapSearchInputId: string;
  placeQuery: string;
  textQuery: string;
  onPlaceResult: (result: PlaceSearchResult) => void;
  onClearPlace: () => void;
  onUseCurrentLocation: (result: PlaceSearchResult) => void;
  onAiSearch: (query: string) => void;
  onClearKeywords: () => void;
  saleMode?: boolean;
  loading: boolean;
  refreshing?: boolean;
  fetchError: string;
  onFetchRetry: () => void;
  selected: ListingCardData | null | undefined;
  selectedBuildingListings: ListingCardData[] | null;
  showBuildingPreview: boolean;
  onClosePreview: () => void;
  onCloseBuildingPreview: () => void;
  onSelectBuildingUnit: (listing: ListingCardData) => void;
  onMobileViewChange: (view: MapMobileView, method?: string) => void;
}

export default function MapCanvas({
  mapRegionRef,
  mapRef,
  mobileView,
  mapPinStatusText,
  initialMapView,
  urlState,
  urlHasViewport,
  restoredFromStorageRef,
  mapInstance,
  onMapInstance,
  invalidateFetchCache,
  syncViewFromMap,
  onMapLoad,
  onMapIdle,
  onMapClick,
  mapViewMode,
  onMapViewModeChange,
  mapZoom,
  listings,
  selectedId,
  highlightedId,
  pinLabelTier,
  spiderfyEpoch,
  onClusterZoom,
  onSelectListing,
  drawMode,
  drawnShape,
  onDrawnShapeChange,
  onDrawModeChange,
  densityHint,
  onDismissDensityBanner,
  showLowZoomHint = false,
  onDismissLowZoomHint,
  showMapEmpty = false,
  mapEmptyVariant = "no_listings",
  mapEmptyActions = [],
  totalInBounds = 0,
  mapEmptyFiltersActive = false,
  mapEmptyKeywordsActive = false,
  mapEmptyDrawnAreaActive = false,
  mapEmptyKeywordPreview,
  onClearFilters,
  onClearKeywordsFromEmpty,
  onClearDrawnAreaFromEmpty,
  onOpenListFromEmpty,
  showEmptyPeekHint = false,
  onDismissEmptyPeekHint,
  mapPinsPaused = false,
  onZoomInForMore,
  onFitAll,
  resultsCountInfo,
  listPage,
  listTotalPages,
  mapSearchInputId,
  placeQuery,
  textQuery,
  onPlaceResult,
  onClearPlace,
  onUseCurrentLocation,
  onAiSearch,
  onClearKeywords,
  saleMode = false,
  loading,
  refreshing = false,
  fetchError,
  onFetchRetry,
  selected,
  selectedBuildingListings,
  showBuildingPreview,
  onClosePreview,
  onCloseBuildingPreview,
  onSelectBuildingUnit,
  onMobileViewChange,
}: MapCanvasProps) {
  const mapContainerStyle = { width: "100%", height: "100%" };
  const showEmptyOverlay = showMapEmpty && mobileView !== "list";
  const showPeekEmptyHint = showEmptyPeekHint && mobileView === "peek";

  return (
    <div
      ref={mapRegionRef}
      tabIndex={0}
      role="application"
      aria-label="Interactive rental map"
      aria-describedby="map-keyboard-help"
      className="relative z-0 min-h-[60vh] min-w-0 flex-1 overflow-hidden border-[var(--border)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 md:min-h-0 md:border-r"
      style={{ backgroundColor: MAP_ROADMAP_BACKGROUND }}
    >
      <p id="map-keyboard-help" className="sr-only">
        Press M to focus the map. Use arrow keys to browse listing pins, Enter to open the
        selected listing, and Escape to clear selection. On mobile, use the Map and List tabs
        or the sheet handle to switch views; pinch to zoom the map.
      </p>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {mapPinStatusText}
      </span>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialMapView.center}
        zoom={initialMapView.zoom}
        options={SILVER_MAP_OPTIONS}
        onLoad={(map) => {
          mapRef.current = map;
          onMapInstance(map);
          invalidateFetchCache();
          window.requestAnimationFrame(() => {
            google.maps.event.trigger(map, "resize");
          });
          if (urlState.bounds) {
            const b = new google.maps.LatLngBounds(
              { lat: urlState.bounds.south, lng: urlState.bounds.west },
              { lat: urlState.bounds.north, lng: urlState.bounds.east }
            );
            map.fitBounds(b);
          } else if (urlState.centerLat != null && urlState.centerLng != null) {
            map.panTo({ lat: urlState.centerLat, lng: urlState.centerLng });
            if (urlState.zoom != null) map.setZoom(urlState.zoom);
          } else if (!urlHasViewport) {
            const persisted = loadPersistedMapView();
            if (persisted) {
              restoredFromStorageRef.current = true;
              if (persisted.bounds) {
                const b = new google.maps.LatLngBounds(
                  { lat: persisted.bounds.south, lng: persisted.bounds.west },
                  { lat: persisted.bounds.north, lng: persisted.bounds.east }
                );
                map.fitBounds(b);
              } else {
                map.panTo({ lat: persisted.centerLat, lng: persisted.centerLng });
                map.setZoom(persisted.zoom);
              }
            }
          }
          syncViewFromMap(map);
          applyMapViewSurface(map, mapViewMode, map.getZoom() ?? DEFAULT_ZOOM);
          onMapLoad(map);
        }}
        onIdle={onMapIdle}
        onClick={onMapClick}
      />

      <MapDrawAreaController
        map={mapInstance}
        drawMode={drawMode}
        shape={drawnShape}
        paused={mapPinsPaused}
        onShapeChange={onDrawnShapeChange}
        onDrawComplete={() => onDrawModeChange(null)}
      />

      <MapDrawAreaTool
        drawMode={drawMode}
        hasArea={Boolean(drawnShape)}
        filteredCount={listings.length}
        onStartDraw={(mode) => onDrawModeChange(mode)}
        onClearArea={() => {
          onDrawnShapeChange(null);
          onDrawModeChange(null);
        }}
      />

      <MapDensityLayer
        map={mapInstance}
        listings={listings}
        mapZoom={mapZoom}
        paused={mapPinsPaused}
      />

      <ListingMarkerCluster
        map={mapInstance}
        listings={listings}
        selectedId={selectedId}
        highlightedId={highlightedId}
        labelTier={pinLabelTier}
        mapZoom={mapZoom}
        spiderfyEpoch={spiderfyEpoch}
        paused={mapPinsPaused}
        onClusterZoom={onClusterZoom}
        onSelect={onSelectListing}
      />

      {densityHint && (
        <MapDensityBanner
          message={densityHint}
          onZoomIn={onZoomInForMore}
          onFitAll={onFitAll}
          onDismiss={onDismissDensityBanner}
        />
      )}

      <MapEmptyOverlay
        visible={showEmptyOverlay}
        variant={mapEmptyVariant}
        totalInBounds={totalInBounds}
        filtersActive={mapEmptyFiltersActive}
        keywordsActive={mapEmptyKeywordsActive}
        drawnAreaActive={mapEmptyDrawnAreaActive}
        keywordPreview={mapEmptyKeywordPreview}
        onZoomIn={onZoomInForMore}
        onClearFilters={onClearFilters}
        onClearKeywords={onClearKeywordsFromEmpty}
        onClearDrawnArea={onClearDrawnAreaFromEmpty}
      />

      <MapEmptyPeekHint
        visible={showPeekEmptyHint}
        variant={mapEmptyVariant}
        totalInBounds={totalInBounds}
        filtersActive={mapEmptyFiltersActive}
        keywordsActive={mapEmptyKeywordsActive}
        drawnAreaActive={mapEmptyDrawnAreaActive}
        keywordPreview={mapEmptyKeywordPreview}
        actions={mapEmptyActions}
        onZoomIn={onZoomInForMore}
        onClearFilters={onClearFilters}
        onClearKeywords={onClearKeywordsFromEmpty}
        onClearDrawnArea={onClearDrawnAreaFromEmpty}
        onOpenList={onOpenListFromEmpty}
        onDismiss={onDismissEmptyPeekHint}
      />

      <MapLowZoomHint
        visible={showLowZoomHint}
        listingCount={listings.length}
        onDismiss={onDismissLowZoomHint}
      />

      {resultsCountInfo.mapBadge && listings.length > 0 && (
        <div
          className="pointer-events-none absolute left-3 top-[7.5rem] z-10 hidden rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] shadow-sm md:top-[8rem] md:block"
          aria-live="polite"
        >
          {resultsCountInfo.mapBadge}
          {listTotalPages > 1 ? ` · page ${listPage + 1}/${listTotalPages}` : null}
        </div>
      )}

      <MapKeyboardHelp />

      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex flex-col items-center gap-2 px-3 md:px-4">
        <MapLocationSearch
          inputId={mapSearchInputId}
          initialQuery={placeQuery}
          onPlaceResult={onPlaceResult}
          onClear={onClearPlace}
          onUseCurrentLocation={onUseCurrentLocation}
          disabled={loading}
        />
        <AiSearchBar
          onSearch={onAiSearch}
          disabled={loading}
          variant={saleMode ? "sale" : "rent"}
        />
        <MapKeywordChip keywords={textQuery} onClear={onClearKeywords} />
      </div>

      {loading && !fetchError && listings.length === 0 && (
        <div className="pointer-events-none absolute left-3 top-[4.25rem] rp-glass rounded-full px-3 py-1.5 text-xs text-[var(--muted)] md:top-[4.5rem]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand-orange)]" />{" "}
          Loading…
        </div>
      )}
      {refreshing && !loading && !fetchError && listings.length > 0 && (
        <div className="pointer-events-none absolute left-3 top-[4.25rem] rp-glass rounded-full px-3 py-1.5 text-xs text-[var(--muted)] md:top-[4.5rem]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand-orange)]" />{" "}
          Updating…
        </div>
      )}

      {fetchError && (
        <div className="absolute left-3 right-3 top-[4.25rem] z-20 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 shadow-sm md:left-3 md:right-auto md:max-w-md md:top-[4.5rem]">
          <p className="font-medium">Could not load listings</p>
          <p className="mt-0.5 opacity-90">{fetchError}</p>
          <button
            type="button"
            className="mt-2 font-semibold text-[var(--brand-navy)] underline"
            onClick={onFetchRetry}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {showBuildingPreview && selectedBuildingListings ? (
          <MapBuildingPreview
            key={`building-${selectedBuildingListings[0].id}`}
            listings={selectedBuildingListings}
            onClose={onCloseBuildingPreview}
            onSelectUnit={onSelectBuildingUnit}
          />
        ) : selected ? (
          <MapListingPreview
            key={selected.id}
            listing={selected}
            onClose={onClosePreview}
          />
        ) : null}
      </AnimatePresence>

      <MapViewModeToggle
        mode={mapViewMode}
        onChange={onMapViewModeChange}
        showingSatellite={mapViewMode === "auto" && mapZoom >= MAP_SATELLITE_AUTO_ZOOM}
      />

      <MapMobileViewSwitcher
        view={mobileView}
        listingCount={listings.length}
        onChange={onMobileViewChange}
      />
    </div>
  );
}
