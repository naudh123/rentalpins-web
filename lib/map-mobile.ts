/** Mobile map UX helpers (search page, below md breakpoint). */

export const MOBILE_MAP_MAX_ZOOM = 15;
/** Max zoom after fit-bounds / cluster expand on phones. */
export const MOBILE_MAP_MAX_FIT_ZOOM = 14;
export const MOBILE_MAP_MIN_FOCUS_ZOOM = 12;

export function isMobileMapLayout(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );
}

export function clampMapZoom(
  map: google.maps.Map,
  max = MOBILE_MAP_MAX_ZOOM
): void {
  const z = map.getZoom();
  if (z != null && z > max) map.setZoom(max);
}

/** Gentle pan-to-listing zoom on mobile (pinch zoom handles the rest). */
export function ensureMobileListingFocusZoom(map: google.maps.Map): void {
  const z = map.getZoom() ?? 0;
  if (z < MOBILE_MAP_MIN_FOCUS_ZOOM) {
    map.setZoom(Math.min(MOBILE_MAP_MIN_FOCUS_ZOOM, MOBILE_MAP_MAX_ZOOM));
  }
}

export function afterFitBoundsClampMobile(map: google.maps.Map): void {
  if (!isMobileMapLayout() || typeof google === "undefined") return;
  google.maps.event.addListenerOnce(map, "idle", () => {
    clampMapZoom(map, MOBILE_MAP_MAX_FIT_ZOOM);
  });
}
