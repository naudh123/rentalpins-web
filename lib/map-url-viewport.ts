import {
  boundsFromMap,
  boundsNearlyEqual,
  nearlyEqualCoord,
} from "@/lib/map-viewport";
import type { SearchUrlState } from "@/lib/search-url";

/** True when the live map camera already matches URL viewport (skip redundant fit). */
export function urlMapViewMatchesState(
  map: google.maps.Map,
  state: SearchUrlState,
  epsilon = 0.002
): boolean {
  const bounds = boundsFromMap(map);
  if (state.bounds && bounds && boundsNearlyEqual(bounds, state.bounds, epsilon)) {
    return true;
  }
  const c = map.getCenter();
  const zoom = map.getZoom();
  if (
    c &&
    state.centerLat != null &&
    state.centerLng != null &&
    nearlyEqualCoord(c.lat(), state.centerLat, epsilon) &&
    nearlyEqualCoord(c.lng(), state.centerLng, epsilon) &&
    (state.zoom == null || zoom == null || Math.abs(zoom - state.zoom) < 1)
  ) {
    return true;
  }
  return false;
}
