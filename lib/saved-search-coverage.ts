import { boundsAroundCenter } from "@/lib/map-bounds";
import { shapeToBounds } from "@/lib/map-area";
import { isLikelyGeohashPrefixCapped } from "@/lib/geohash-bounds";
import type { SavedSearch, MapBounds } from "@/lib/types/saved-search";
import type { SearchAlert } from "@/lib/types/search-alert";
import type { SearchUrlState } from "@/lib/search-url";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";

/** Minimum zoom for fuller geohash coverage on saved-search alerts. */
export const SAVED_SEARCH_COVERAGE_ZOOM = 15;

/** Viewport bounds used to estimate geohash coverage for a saved search. */
export function boundsForSavedSearchCoverage(search: SavedSearch): MapBounds | null {
  if (search.drawnArea) return shapeToBounds(search.drawnArea);
  if (search.bounds) return search.bounds;
  if (search.centerLat != null && search.centerLng != null) {
    return boundsAroundCenter(
      search.centerLat,
      search.centerLng,
      search.zoom ?? 12
    );
  }
  return null;
}

export function isSavedSearchCoverageLimited(search: SavedSearch): boolean {
  const bounds = boundsForSavedSearchCoverage(search);
  if (!bounds) return false;
  return isLikelyGeohashPrefixCapped(bounds, search.zoom);
}

export function hasCoverageLimitedSavedSearches(searches: SavedSearch[]): boolean {
  return searches.some(isSavedSearchCoverageLimited);
}

export function hasCoverageLimitedAlerts(alerts: SearchAlert[]): boolean {
  return alerts.some((a) => a.coverageMayBeIncomplete === true);
}

export function savedSearchCoverageHint(search: SavedSearch): string {
  const zoom = search.zoom ?? 12;
  return `Saved at zoom ${zoom} — open on map and zoom to street level (${SAVED_SEARCH_COVERAGE_ZOOM}+) for fuller alert coverage.`;
}

/** URL state with zoom bumped for coverage-limited saved searches. */
export function savedSearchZoomInUrlState(search: SavedSearch): SearchUrlState {
  const baseZoom = search.zoom ?? 12;
  const zoom = Math.max(baseZoom, SAVED_SEARCH_COVERAGE_ZOOM);
  return {
    filters: {
      transactionType: DEFAULT_LISTING_FILTERS.transactionType,
      category: search.category,
      subCategory: search.subCategory ?? "",
      priceMin: search.priceMin,
      priceMax: search.priceMax,
      sort: search.sort,
      bhk: search.bhk ?? "",
      furnishing: search.furnishing ?? "",
      tenantPreference: search.tenantPreference ?? "",
      areaMin: search.areaMin,
      areaMax: search.areaMax,
    },
    centerLat: search.centerLat,
    centerLng: search.centerLng,
    zoom,
    bounds: search.bounds,
    placeQuery: search.placeQuery ?? null,
    keywords: search.keywords ?? null,
    selectedId: null,
    drawnArea: search.drawnArea ?? null,
  };
}

export function showSavedSearchCoverageBanner(
  searches: SavedSearch[],
  alerts: SearchAlert[]
): boolean {
  return (
    hasCoverageLimitedSavedSearches(searches) || hasCoverageLimitedAlerts(alerts)
  );
}
