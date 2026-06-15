import type { LatLngPoint } from "@/lib/map-area";

/** Bounds literal from two corner LatLngs (rectangle drag). */
export function boundsFromCorners(
  a: google.maps.LatLng,
  b: google.maps.LatLng
): google.maps.LatLngBoundsLiteral {
  return {
    north: Math.max(a.lat(), b.lat()),
    south: Math.min(a.lat(), b.lat()),
    east: Math.max(a.lng(), b.lng()),
    west: Math.min(a.lng(), b.lng()),
  };
}

/** Reject accidental clicks — ~10 m minimum at mid-latitudes. */
export function isMeaningfulRectBounds(bounds: google.maps.LatLngBounds): boolean {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return Math.abs(ne.lat() - sw.lat()) > 0.0001 && Math.abs(ne.lng() - sw.lng()) > 0.0001;
}

/** True when screen distance between points is within threshold (close polygon). */
export function isNearFirstPoint(
  map: google.maps.Map,
  point: LatLngPoint,
  first: LatLngPoint,
  pxThreshold = 14
): boolean {
  const projection = map.getProjection();
  if (!projection) return false;
  const zoom = map.getZoom() ?? 12;
  const scale = 2 ** zoom * 256;
  const a = projection.fromLatLngToPoint(new google.maps.LatLng(point.lat, point.lng));
  const b = projection.fromLatLngToPoint(new google.maps.LatLng(first.lat, first.lng));
  if (!a || !b) return false;
  const dx = (a.x - b.x) * scale;
  const dy = (a.y - b.y) * scale;
  return Math.hypot(dx, dy) <= pxThreshold;
}

export const MAP_AREA_PREVIEW_STYLE: google.maps.RectangleOptions = {
  fillColor: "#E8501A",
  fillOpacity: 0.12,
  strokeColor: "#E8501A",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  clickable: false,
  editable: false,
  draggable: false,
  zIndex: 2,
};
