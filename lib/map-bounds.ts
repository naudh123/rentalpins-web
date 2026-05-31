import type { MapBounds } from "@/lib/types/saved-search";

/** Approximate viewport bounds from center + zoom (server + client safe). */
export function boundsAroundCenter(
  lat: number,
  lng: number,
  zoom: number
): MapBounds {
  const km = zoom >= 14 ? 8 : zoom >= 12 ? 15 : zoom >= 10 ? 35 : 60;
  const latDelta = km / 111;
  const lngDelta = km / (111 * Math.cos((lat * Math.PI) / 180));
  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta,
  };
}
