import type { MapBounds } from "@/lib/types/listing";

export type BoundsValidationResult =
  | { ok: true; bounds: MapBounds }
  | { ok: false; status: 400; error: string };

/** Validate listing API viewport bounds query params. */
export function validateListingsBoundsQuery(
  northRaw: string | null,
  southRaw: string | null,
  eastRaw: string | null,
  westRaw: string | null
): BoundsValidationResult {
  const north = parseFloat(northRaw || "");
  const south = parseFloat(southRaw || "");
  const east = parseFloat(eastRaw || "");
  const west = parseFloat(westRaw || "");

  if ([north, south, east, west].some((n) => Number.isNaN(n))) {
    return { ok: false, status: 400, error: "north, south, east, west required" };
  }

  const inLat = (n: number) => n >= -90 && n <= 90;
  const inLng = (n: number) => n >= -180 && n <= 180;
  if (!inLat(north) || !inLat(south) || !inLng(east) || !inLng(west) || north <= south) {
    return { ok: false, status: 400, error: "Invalid bounds" };
  }

  const latSpan = north - south;
  const lngSpan = west <= east ? east - west : 360 - (west - east);
  if (latSpan > 170 && lngSpan > 350) {
    return { ok: false, status: 400, error: "Viewport too large" };
  }

  return { ok: true, bounds: { north, south, east, west } };
}
