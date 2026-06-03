"use client";

import type { RefObject } from "react";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import type { ListingFilters } from "@/lib/listing-filters";
import type { MapAreaShape } from "@/lib/map-area";
import type { MapListingDisplayItem } from "@/lib/map-building-groups";
import type { MapBounds } from "@/lib/types/saved-search";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";
import type { MapEmptyPanelProps } from "@/lib/map-empty-props";
import { MAP_LIST_PAGE_SIZE } from "@/lib/map-list-count";
import type { MapResultsCountInfo } from "@/lib/map-list-count";
import MapResultsEmptyState from "@/components/map/MapResultsEmptyState";
import SearchFilters from "@/components/map/SearchFilters";
import MapResultsList from "@/components/map/MapResultsList";
import MapListPagination from "@/components/map/MapListPagination";
import MapListingCardSkeleton from "@/components/map/MapListingCardSkeleton";
import CopySearchLinkButton from "@/components/map/CopySearchLinkButton";
import SaveSearchButton from "@/components/map/SaveSearchButton";

export interface MapResultsPanelProps extends MapEmptyPanelProps {
  panelRef: RefObject<HTMLElement | null>;
  sheetHandleRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  panelWidth: number;
  mobileView: MapMobileView;
  onMobileViewChange: (view: MapMobileView, method: "drag_handle") => void;
  onSheetTrigger: (el: HTMLButtonElement) => void;
  onPanelResizeStart: (e: React.MouseEvent) => void;
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  listings: ListingCardData[];
  filteredListings: ListingCardData[];
  totalInBounds: number;
  mapZoom: number;
  resultsMayBeIncomplete: boolean;
  loading: boolean;
  refreshing: boolean;
  fetchError: string;
  drawnShape: MapAreaShape | null;
  mapBounds: MapBounds | null;
  mapCenter: { lat: number; lng: number };
  placeQuery: string;
  textQuery: string;
  selectedId: string | null;
  highlightedId: string | null;
  listDisplayItems: MapListingDisplayItem[];
  paginatedListItems: MapListingDisplayItem[];
  listPage: number;
  listTotalPages: number;
  onListPageChange: (page: number) => void;
  showListSkeletons: boolean;
  liveStatusText: string;
  countInfo: MapResultsCountInfo;
  activeFilterCount: number;
  canResetView: boolean;
  onFitAll: () => void;
  onResetView: () => void;
  onHighlight: (listing: ListingCardData) => void;
}

export default function MapResultsPanel({
  panelRef,
  sheetHandleRef,
  listRef,
  panelWidth,
  mobileView,
  onMobileViewChange,
  onSheetTrigger,
  onPanelResizeStart,
  filters,
  onFiltersChange,
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
  onListPageChange,
  showListSkeletons,
  liveStatusText,
  countInfo,
  activeFilterCount,
  canResetView,
  onFitAll,
  onResetView,
  onClearFiltersOnly,
  onClearKeywordsFromEmpty,
  onClearDrawnAreaFromEmpty,
  onZoomInForMore,
  mapEmptyShow = false,
  mapEmptyVariant = "no_listings",
  mapEmptyTotalInBounds = 0,
  mapEmptyFiltersActive = false,
  mapEmptyKeywordsActive = false,
  mapEmptyDrawnAreaActive = false,
  mapEmptyKeywordPreview,
  onHighlight,
}: MapResultsPanelProps) {
  return (
    <aside
      id="map-results-panel"
      ref={panelRef}
      tabIndex={-1}
      className={`rp-map-results-panel fixed inset-x-0 bottom-0 z-30 flex flex-col border-t border-[var(--border)] bg-[var(--bg)] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:static md:max-h-none md:shrink-0 md:translate-y-0 md:border-l md:border-t-0 md:pb-0 md:shadow-none md:relative ${
        mobileView === "map"
          ? "pointer-events-none translate-y-full max-md:invisible"
          : "max-h-[min(92dvh,100%)] translate-y-0 pointer-events-auto"
      }`}
      style={{ ["--map-panel-width" as string]: `${panelWidth}px` }}
      role={mobileView === "list" ? "dialog" : undefined}
      aria-modal={mobileView === "list" ? true : undefined}
      aria-label="Map results"
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize results panel"
        className="absolute left-0 top-0 z-40 hidden h-full w-1.5 cursor-col-resize touch-none bg-transparent hover:bg-[var(--brand-orange)]/30 md:block"
        onMouseDown={onPanelResizeStart}
      />
      <button
        type="button"
        ref={sheetHandleRef}
        className="mx-auto mt-2 min-h-8 w-16 rounded-full bg-[var(--border)] md:hidden"
        aria-label={mobileView === "list" ? "Collapse listings panel" : "Expand listings panel"}
        onClick={(e) => {
          onSheetTrigger(e.currentTarget);
          if (mobileView === "list") onMobileViewChange("map", "drag_handle");
          else onMobileViewChange("list", "drag_handle");
        }}
        aria-expanded={mobileView === "list"}
        aria-controls="map-results-list"
      />
      <div className="h-1 shrink-0 bg-gradient-to-r from-[var(--brand-navy)] via-[var(--brand-orange)] to-[var(--brand-navy)] md:rounded-tl-none" />
      <SearchFilters
        filters={filters}
        onChange={onFiltersChange}
        resultCount={listings.length}
        totalCount={drawnShape ? filteredListings.length : totalInBounds}
        mapZoom={mapZoom}
        resultsMayBeIncomplete={resultsMayBeIncomplete}
        loading={loading}
        filtersActive={activeFilterCount > 0}
        clientFilterActive={Boolean(textQuery.trim() || drawnShape)}
        refreshing={refreshing}
        countInfo={countInfo}
        saveSearchSlot={
          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              className="rp-btn rp-btn-ghost !px-2.5 text-xs"
              onClick={onFitAll}
              title="Zoom map to show all current results (F)"
              disabled={loading || listings.length < 2}
            >
              Fit all
            </button>
            <button
              type="button"
              className="rp-btn rp-btn-ghost !px-2.5 text-xs"
              onClick={onResetView}
              title="Reset map to default view"
              disabled={!canResetView}
            >
              Reset view
            </button>
            <CopySearchLinkButton disabled={loading} />
            <SaveSearchButton
              filters={filters}
              bounds={mapBounds}
              centerLat={mapCenter.lat}
              centerLng={mapCenter.lng}
              zoom={mapZoom}
              placeQuery={placeQuery}
              keywords={textQuery}
              drawnArea={drawnShape}
              disabled={loading}
            />
          </div>
        }
      />
      <div className="border-b border-[var(--border-subtle)] px-3 py-1.5 text-[10px] text-[var(--muted)]">
        <span className="hidden md:inline">
          Tip: / search · M map · ↑↓ browse · Enter open · F fit all · L cycle view · Esc clear
        </span>
        <span className="md:hidden">
          Tip: tap <strong className="font-semibold text-[var(--brand-navy)]">List</strong> below,
          then tap a card to open · pins open preview on map
        </span>
      </div>
      <span className="sr-only" aria-live="polite">
        {liveStatusText}
      </span>
      <div
        id="map-results-list"
        ref={listRef}
        className="relative flex-1 overflow-y-auto p-3"
        role="listbox"
        aria-label="Listings in current map area"
        aria-busy={loading || refreshing}
        aria-activedescendant={
          selectedId
            ? `map-listing-${selectedId}`
            : highlightedId
              ? `map-listing-${highlightedId}`
              : undefined
        }
      >
        {showListSkeletons && (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <MapListingCardSkeleton key={`sk-${i}`} />
            ))}
          </div>
        )}
        {!showListSkeletons && listDisplayItems.length > 0 && (
          <MapResultsList
            items={paginatedListItems}
            selectedId={selectedId}
            highlightedId={highlightedId}
            onHover={onHighlight}
          />
        )}
        {fetchError && listings.length > 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Could not refresh listings. Showing previous results. {fetchError}
          </p>
        )}
        {!listings.length && !loading && mapEmptyShow && (
          <MapResultsEmptyState
            variant={mapEmptyVariant}
            totalInBounds={mapEmptyTotalInBounds}
            filtersActive={mapEmptyFiltersActive}
            keywordsActive={mapEmptyKeywordsActive}
            drawnAreaActive={mapEmptyDrawnAreaActive}
            keywordPreview={mapEmptyKeywordPreview}
            canResetView={canResetView}
            onZoomIn={onZoomInForMore}
            onClearFilters={onClearFiltersOnly}
            onClearKeywords={onClearKeywordsFromEmpty}
            onClearDrawnArea={onClearDrawnAreaFromEmpty}
            onResetView={onResetView}
          />
        )}
      </div>
      <MapListPagination
        page={listPage}
        totalPages={listTotalPages}
        totalItems={listDisplayItems.length}
        pageSize={MAP_LIST_PAGE_SIZE}
        onPageChange={onListPageChange}
        disabled={loading}
      />
    </aside>
  );
}
