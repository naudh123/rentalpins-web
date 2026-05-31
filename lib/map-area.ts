import type { MapBounds } from "@/lib/types/saved-search";

export interface LatLngPoint {
  lat: number;
  lng: number;
}

/** A user-drawn search area: an axis-aligned rectangle or a free polygon. */
export type MapAreaShape =
  | { type: "rect"; bounds: MapBounds }
  | { type: "poly"; path: LatLngPoint[] };

function round5(n: number): number {
  return Math.round(n * 1e5) / 1e5;
}

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Compact, URL-safe encoding of a drawn area.
 * - rect: `r:north,south,east,west`
 * - poly: `p:lat,lng_lat,lng_...` (min 3 points)
 */
export function encodeMapArea(shape: MapAreaShape | null): string | null {
  if (!shape) return null;
  if (shape.type === "rect") {
    const { north, south, east, west } = shape.bounds;
    if (![north, south, east, west].every(isFiniteNum)) return null;
    return `r:${round5(north)},${round5(south)},${round5(east)},${round5(west)}`;
  }
  if (shape.path.length < 3) return null;
  const pts = shape.path
    .filter((p) => isFiniteNum(p.lat) && isFiniteNum(p.lng))
    .map((p) => `${round5(p.lat)},${round5(p.lng)}`);
  if (pts.length < 3) return null;
  return `p:${pts.join("_")}`;
}

/** Parse the `area` query param back into a shape, or null if invalid. */
export function decodeMapArea(raw: string | null | undefined): MapAreaShape | null {
  if (!raw) return null;
  const value = raw.trim();
  if (value.startsWith("r:")) {
    const parts = value.slice(2).split(",").map(Number);
    if (parts.length !== 4 || !parts.every(isFiniteNum)) return null;
    const [north, south, east, west] = parts;
    return { type: "rect", bounds: { north, south, east, west } };
  }
  if (value.startsWith("p:")) {
    const path = value
      .slice(2)
      .split("_")
      .map((pair) => {
        const [lat, lng] = pair.split(",").map(Number);
        return { lat, lng };
      })
      .filter((p) => isFiniteNum(p.lat) && isFiniteNum(p.lng));
    if (path.length < 3) return null;
    return { type: "poly", path };
  }
  return null;
}

/** Axis-aligned bounds enclosing the shape (for map fitting / SSR hints). */
export function shapeToBounds(shape: MapAreaShape): MapBounds | null {
  if (shape.type === "rect") return shape.bounds;
  if (shape.path.length === 0) return null;
  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;
  for (const p of shape.path) {
    north = Math.max(north, p.lat);
    south = Math.min(south, p.lat);
    east = Math.max(east, p.lng);
    west = Math.min(west, p.lng);
  }
  return { north, south, east, west };
}
