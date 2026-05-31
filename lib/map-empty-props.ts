import type { MapEmptyAction, MapEmptyVariant } from "@/lib/map-empty-state";

/** Empty-state props shared by MapCanvas overlays and empty-action hooks. */
export interface MapEmptySurfaceProps {
  showMapEmpty?: boolean;
  mapEmptyVariant?: MapEmptyVariant;
  mapEmptyActions?: MapEmptyAction[];
  totalInBounds?: number;
  mapEmptyFiltersActive?: boolean;
  mapEmptyKeywordsActive?: boolean;
  mapEmptyDrawnAreaActive?: boolean;
  mapEmptyKeywordPreview?: string;
  onClearFilters?: () => void;
  onClearKeywordsFromEmpty?: () => void;
  onClearDrawnAreaFromEmpty?: () => void;
  onZoomInForMore?: () => void;
}

/** List-panel empty props (subset + rename for MapResultsPanel). */
export interface MapEmptyPanelProps {
  mapEmptyVariant?: MapEmptyVariant;
  mapEmptyShow?: boolean;
  mapEmptyTotalInBounds?: number;
  mapEmptyFiltersActive?: boolean;
  mapEmptyKeywordsActive?: boolean;
  mapEmptyDrawnAreaActive?: boolean;
  mapEmptyKeywordPreview?: string;
  onClearFiltersOnly: () => void;
  onClearKeywordsFromEmpty: () => void;
  onClearDrawnAreaFromEmpty: () => void;
  onZoomInForMore: () => void;
}
