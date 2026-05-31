import { boundsAroundCenter } from "@/lib/map-bounds";
import { buildSearchUrl, type SearchUrlState } from "@/lib/search-url";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";
import type { MapBounds } from "@/lib/types/saved-search";

/** Deep-link into map search with full shareable viewport (bounds when possible). */
export function mapSearchUrl(
  lat: number,
  lng: number,
  zoom = 12,
  selectedListingId?: string,
  category?: string | null,
  bounds?: MapBounds | null,
  keywords?: string | null,
  placeQuery?: string | null
): string {
  const state: SearchUrlState = {
    filters: {
      ...DEFAULT_LISTING_FILTERS,
      category: category && category !== "All" ? category : DEFAULT_LISTING_FILTERS.category,
    },
    centerLat: lat,
    centerLng: lng,
    zoom,
    bounds: bounds ?? boundsAroundCenter(lat, lng, zoom),
    placeQuery: placeQuery?.trim() || null,
    keywords: keywords?.trim() || null,
    selectedId: selectedListingId ?? null,
    drawnArea: null,
  };
  return buildSearchUrl(state);
}
