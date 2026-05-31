import type { MapBounds } from "@/lib/types/saved-search";
import type { LatLngPoint, MapAreaShape } from "@/lib/map-area";

/** True when lat/lng lies inside axis-aligned bounds. */
export function pointInBounds(
  lat: number,
  lng: number,
  bounds: MapBounds
): boolean {
  if (lat < bounds.south || lat > bounds.north) return false;
  if (bounds.west <= bounds.east) {
    return lng >= bounds.west && lng <= bounds.east;
  }
  return lng >= bounds.west || lng <= bounds.east;
}

/** Ray-casting point-in-polygon test (lng = x, lat = y). */
export function pointInPolygon(
  lat: number,
  lng: number,
  path: LatLngPoint[]
): boolean {
  if (path.length < 3) return false;
  let inside = false;
  for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
    const xi = path[i].lng;
    const yi = path[i].lat;
    const xj = path[j].lng;
    const yj = path[j].lat;
    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** True when a point falls within a drawn area (rectangle or polygon). */
export function pointInArea(
  lat: number,
  lng: number,
  shape: MapAreaShape
): boolean {
  if (shape.type === "rect") return pointInBounds(lat, lng, shape.bounds);
  return pointInPolygon(lat, lng, shape.path);
}

export function googleBoundsToMapBounds(b: google.maps.LatLngBounds): MapBounds {
  const ne = b.getNorthEast();
  const sw = b.getSouthWest();
  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng(),
  };
}

export function mapBoundsToGoogleLiteral(bounds: MapBounds): google.maps.LatLngBoundsLiteral {
  return {
    north: bounds.north,
    south: bounds.south,
    east: bounds.east,
    west: bounds.west,
  };
}
