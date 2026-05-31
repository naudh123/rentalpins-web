import type { ListingCard } from "./types/listing";
import type { MapBounds } from "./types/saved-search";

export function listingInBounds(
  listing: Pick<ListingCard, "lat" | "lng">,
  bounds: MapBounds
): boolean {
  if (listing.lat < bounds.south || listing.lat > bounds.north) return false;
  if (bounds.west <= bounds.east) {
    return listing.lng >= bounds.west && listing.lng <= bounds.east;
  }
  return listing.lng >= bounds.west || listing.lng <= bounds.east;
}

/** Extra margin around the viewport — wider when zoomed out, generous when zoomed in. */
export function viewportPaddingRatio(zoom: number): number {
  if (zoom >= 16) return 0.4;
  if (zoom >= 14) return 0.28;
  if (zoom >= 12) return 0.2;
  if (zoom >= 10) return 0.15;
  return 0.12;
}

export function boundsWithZoomPadding(bounds: MapBounds, zoom: number): MapBounds {
  return expandMapBounds(bounds, viewportPaddingRatio(zoom));
}

/**
 * Keep pins stable when geohash sampling misses listings on small pans.
 * New fetch results win; previously loaded listings stay if still in padded viewport.
 */
export function mergeViewportListings(
  previous: ListingCard[],
  fetched: ListingCard[],
  strictBounds: MapBounds,
  zoom: number
): ListingCard[] {
  const activeBounds = boundsWithZoomPadding(strictBounds, zoom);
  const merged = new Map<string, ListingCard>();
  for (const listing of fetched) {
    if (listingInBounds(listing, activeBounds)) merged.set(listing.id, listing);
  }
  for (const listing of previous) {
    if (merged.has(listing.id)) continue;
    if (listingInBounds(listing, activeBounds)) merged.set(listing.id, listing);
  }
  return Array.from(merged.values());
}

/** Drop listings far outside the current view (prevents zoom-9 data polluting zoom-15). */
export function pruneListingsToViewport(
  listings: ListingCard[],
  strictBounds: MapBounds,
  zoom: number
): ListingCard[] {
  const activeBounds = boundsWithZoomPadding(strictBounds, zoom);
  return listings.filter((l) => listingInBounds(l, activeBounds));
}

/** Slightly expand bounds for fetch so edge pins survive micro-pans. */
export function expandMapBounds(bounds: MapBounds, paddingRatio = 0.12): MapBounds {
  const latSpan = bounds.north - bounds.south;
  const lngSpan =
    bounds.west <= bounds.east
      ? bounds.east - bounds.west
      : 360 - (bounds.west - bounds.east);
  const latPad = latSpan * paddingRatio;
  const lngPad = lngSpan * paddingRatio;
  return {
    north: Math.min(90, bounds.north + latPad),
    south: Math.max(-90, bounds.south - latPad),
    east: bounds.west <= bounds.east ? Math.min(180, bounds.east + lngPad) : bounds.east,
    west: bounds.west <= bounds.east ? Math.max(-180, bounds.west - lngPad) : bounds.west,
  };
}
