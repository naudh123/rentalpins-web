import type { MapBounds } from "@/lib/types/saved-search";
import { boundsAroundCenter } from "@/lib/map-bounds";
import type { ListingFilters } from "@/lib/listing-filters";

export const DEFAULT_MAP_CENTER = { lat: 30.7333, lng: 76.7794 };
export const DEFAULT_MAP_ZOOM = 11;

export function boundsFromMap(map: google.maps.Map): MapBounds | null {
  const b = map.getBounds();
  if (!b) return null;
  const ne = b.getNorthEast();
  const sw = b.getSouthWest();
  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng(),
  };
}

export function boundsForMap(
  map: google.maps.Map,
  defaultCenter = DEFAULT_MAP_CENTER,
  defaultZoom = DEFAULT_MAP_ZOOM
): MapBounds {
  const c = map.getCenter();
  const zoom = map.getZoom() ?? defaultZoom;
  const center = c
    ? { lat: c.lat(), lng: c.lng() }
    : { lat: defaultCenter.lat, lng: defaultCenter.lng };
  return boundsFromMap(map) ?? boundsAroundCenter(center.lat, center.lng, zoom);
}

export function boundsNearlyEqual(a: MapBounds, b: MapBounds, epsilon = 0.0008): boolean {
  return (
    Math.abs(a.north - b.north) < epsilon &&
    Math.abs(a.south - b.south) < epsilon &&
    Math.abs(a.east - b.east) < epsilon &&
    Math.abs(a.west - b.west) < epsilon
  );
}

export function buildBoundsFetchKey(bounds: MapBounds): string {
  return [
    bounds.north.toFixed(4),
    bounds.south.toFixed(4),
    bounds.east.toFixed(4),
    bounds.west.toFixed(4),
  ].join("|");
}

export function buildFetchKey(bounds: MapBounds, filters: ListingFilters): string {
  return [
    buildBoundsFetchKey(bounds),
    filters.category,
    filters.priceMin ?? "",
    filters.priceMax ?? "",
    filters.sort,
  ].join("|");
}

export function nearlyEqualCoord(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}
