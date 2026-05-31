/** Listing pin validation and display-name helpers (no Google Maps dependency). */

const COORD_ONLY_LABEL_RE =
  /^\s*-?\d{1,3}\.\d+\s*,\s*-?\d{1,3}\.\d+\s*$/;

/** Rough India bounding box for optional warnings (ISO IN). */
const INDIA_LAT = { min: 6, max: 38 } as const;
const INDIA_LNG = { min: 68, max: 98 } as const;

export function isValidListingCoordinate(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return false;
  if (lat === 0 && lng === 0) return false;
  return true;
}

export function isCoordOnlyLocationLabel(label: string): boolean {
  return COORD_ONLY_LABEL_RE.test(label.trim());
}

/** Non-blocking hint when pin looks wrong for the user's home market. */
export function listingCoordinateWarning(
  lat: number,
  lng: number,
  homeIso?: string | null
): string | null {
  if (!isValidListingCoordinate(lat, lng)) {
    return "Invalid map coordinates. Pick a location on the map.";
  }
  const iso = (homeIso || "").toUpperCase();
  if (
    iso === "IN" &&
    (lat < INDIA_LAT.min ||
      lat > INDIA_LAT.max ||
      lng < INDIA_LNG.min ||
      lng > INDIA_LNG.max)
  ) {
    return "This pin looks outside India. Confirm the location is correct.";
  }
  return null;
}

/** Prefer a human-readable name for Firestore / AI when the label is only lat,lng. */
export function pickListingLocationName(
  label: string,
  geocodedLabel?: string | null
): string {
  const trimmed = label.trim();
  if (!isCoordOnlyLocationLabel(trimmed)) return trimmed;
  const geo = geocodedLabel?.trim();
  if (geo && !isCoordOnlyLocationLabel(geo)) return geo;
  return trimmed;
}
