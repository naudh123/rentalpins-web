import { boundsAroundCenter } from "@/lib/map-bounds";
import { resetListingFilters } from "@/lib/listing-filter-reset";
import { buildSearchUrl, type SearchUrlState } from "@/lib/search-url";
import type { TransactionType } from "@/lib/transaction-type";
import type { MapBounds } from "@/lib/types/saved-search";

/** Deep-link into rent or buy map search with full shareable viewport. */
export function mapSearchUrl(
  lat: number,
  lng: number,
  zoom = 12,
  selectedListingId?: string,
  category?: string | null,
  bounds?: MapBounds | null,
  keywords?: string | null,
  placeQuery?: string | null,
  transactionType: TransactionType = "rent"
): string {
  const baseFilters = resetListingFilters(transactionType);
  const state: SearchUrlState = {
    filters: {
      ...baseFilters,
      category:
        transactionType === "sale"
          ? "Property"
          : category && category !== "All"
            ? category
            : baseFilters.category,
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
