import {
  geohashPrecisionForZoom,
  gridStepsForPrecision,
  isLikelyResultCapSaturated,
  limitPerPrefixForZoom,
} from "./geohash-bounds";

export const MAP_LIST_PAGE_SIZE = 24;

/** Minimum panel width (px) for two-column listing grid on desktop. */
export const MAP_LIST_TWO_COLUMN_MIN_WIDTH = 420;

const ZOOM_SUBLINE =
  "Not all listings can be shown at this zoom — zoom in for more";

export { ZOOM_SUBLINE };

export interface MapResultsCountInfo {
  /** List panel header line (Zillow-style). */
  headline: string;
  /** Optional secondary hint under headline. */
  subline: string | null;
  /** Compact badge on the map. */
  mapBadge: string | null;
  /** True when viewport likely hides additional listings. */
  areaMayHaveMore: boolean;
}

export function buildMapResultsCountInfo(opts: {
  resultCount: number;
  totalInBounds: number;
  loading: boolean;
  /** @deprecated Refreshing no longer changes header copy — use useStableMapCountInfo. */
  refreshing?: boolean;
  resultsMayBeIncomplete?: boolean;
  mapZoom: number;
  filtersActive?: boolean;
  clientFilterActive?: boolean;
  prefixCapActive?: boolean;
}): MapResultsCountInfo {
  const {
    resultCount,
    totalInBounds,
    loading,
    resultsMayBeIncomplete,
    mapZoom,
    filtersActive = false,
    clientFilterActive = false,
    prefixCapActive = false,
  } = opts;

  if (loading) {
    return {
      headline: "Updating results…",
      subline: null,
      mapBadge: null,
      areaMayHaveMore: false,
    };
  }

  const precision = geohashPrecisionForZoom(mapZoom);
  const steps = gridStepsForPrecision(precision);
  const limit = limitPerPrefixForZoom(mapZoom);
  const areaMayHaveMore =
    Boolean(resultsMayBeIncomplete) ||
    Boolean(prefixCapActive) ||
    isLikelyResultCapSaturated(totalInBounds, steps, limit);

  if (totalInBounds === 0 && resultCount === 0) {
    return {
      headline: "Search or pan the map to load listings",
      subline: null,
      mapBadge: null,
      areaMayHaveMore: false,
    };
  }

  const filteredOut =
    totalInBounds > resultCount && (filtersActive || clientFilterActive);

  if (filteredOut) {
    const headline =
      resultCount === 0
        ? `0 of ${totalInBounds} match filters`
        : `${resultCount} of ${totalInBounds} match filters`;
    return {
      headline,
      subline: areaMayHaveMore ? ZOOM_SUBLINE : null,
      mapBadge: `${resultCount} of ${totalInBounds}`,
      areaMayHaveMore,
    };
  }

  if (areaMayHaveMore) {
    const noun = resultCount === 1 ? "rental" : "rentals";
    const headline =
      resultCount > 0
        ? `${resultCount} ${noun} on map`
        : "Zoom in to load rentals in this area";
    return {
      headline,
      subline: ZOOM_SUBLINE,
      mapBadge:
        resultCount > 0 ? `${resultCount} on map · zoom in` : "Zoom in for listings",
      areaMayHaveMore: true,
    };
  }

  const headline =
    resultCount === 1 ? "1 rental available" : `${resultCount} rentals available`;
  return {
    headline,
    subline: null,
    mapBadge: resultCount === 1 ? "1 listing" : `${resultCount} listings`,
    areaMayHaveMore: false,
  };
}

export function listingPageForIndex(index: number, pageSize = MAP_LIST_PAGE_SIZE): number {
  if (index < 0) return 0;
  return Math.floor(index / pageSize);
}
