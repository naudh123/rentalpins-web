import type { MapBounds } from "@/lib/types/saved-search";

/** Stable key for dismissible map hints tied to the current viewport. */
export function buildMapViewportKey(
  mapBounds: MapBounds | null,
  mapZoom: number
): string {
  if (!mapBounds) return `z${mapZoom.toFixed(0)}`;
  return [
    mapBounds.north.toFixed(3),
    mapBounds.south.toFixed(3),
    mapBounds.east.toFixed(3),
    mapBounds.west.toFixed(3),
    mapZoom.toFixed(0),
  ].join("|");
}
