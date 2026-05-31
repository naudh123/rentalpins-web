import type { ListingFilters } from "@/lib/listing-filters";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";
import type { MapAreaShape } from "@/lib/map-area";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  nearlyEqualCoord,
} from "@/lib/map-viewport";

interface Options {
  filters: ListingFilters;
  placeQuery: string;
  textQuery: string;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  drawnShape: MapAreaShape | null;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

/** Whether the map search has diverged from the default viewport / filters. */
export function mapViewCanReset({
  filters,
  placeQuery,
  textQuery,
  mapCenter,
  mapZoom,
  drawnShape,
  defaultCenter = DEFAULT_MAP_CENTER,
  defaultZoom = DEFAULT_MAP_ZOOM,
}: Options): boolean {
  const filtersChanged =
    filters.category !== DEFAULT_LISTING_FILTERS.category ||
    filters.sort !== DEFAULT_LISTING_FILTERS.sort ||
    filters.priceMin != null ||
    filters.priceMax != null;
  const queryChanged = placeQuery.trim().length > 0 || textQuery.trim().length > 0;
  const viewportChanged =
    !nearlyEqualCoord(mapCenter.lat, defaultCenter.lat) ||
    !nearlyEqualCoord(mapCenter.lng, defaultCenter.lng) ||
    mapZoom !== defaultZoom;
  return filtersChanged || queryChanged || viewportChanged || drawnShape != null;
}
