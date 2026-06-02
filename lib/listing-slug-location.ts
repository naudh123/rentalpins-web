import { ALL_AREAS, type AreaConfig } from "@/lib/area-config";

export interface ListingPlaceInput {
  lat: number;
  lng: number;
  locationName?: string;
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

/** Prefer the smallest-radius SEO area hub that contains the pin. */
export function resolveAreaFromCoordinates(
  lat: number,
  lng: number
): AreaConfig | null {
  const matches = ALL_AREAS.map((area) => ({
    area,
    distanceKm: haversineKm(lat, lng, area.center.lat, area.center.lng),
  })).filter(({ area, distanceKm }) => distanceKm <= area.radiusKm);

  if (matches.length === 0) return null;

  matches.sort(
    (a, b) =>
      a.area.radiusKm - b.area.radiusKm ||
      a.distanceKm - b.distanceKm
  );
  return matches[0]!.area;
}

const LOCATION_NAME_CITY_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bmohali\b|\bsahibzada\s+ajit\s+singh\s+nagar\b|\bsas\s+nagar\b/i, label: "Mohali" },
  { re: /\bchandigarh\b/i, label: "Chandigarh" },
  { re: /\bpanchkula\b/i, label: "Panchkula" },
  { re: /\bzirakpur\b/i, label: "Zirakpur" },
  { re: /\bkharar\b/i, label: "Kharar" },
  { re: /\bludhiana\b/i, label: "Ludhiana" },
  { re: /\bdelhi\b|\bnew\s+delhi\b/i, label: "Delhi" },
  { re: /\bnoida\b/i, label: "Noida" },
  { re: /\bgurugram\b|\bgurgaon\b/i, label: "Gurugram" },
  { re: /\bjaipur\b/i, label: "Jaipur" },
  { re: /\blucknow\b/i, label: "Lucknow" },
  { re: /\bmumbai\b|\bbombay\b/i, label: "Mumbai" },
  { re: /\blondon\b/i, label: "London" },
  { re: /\bnairobi\b/i, label: "Nairobi" },
  { re: /\blagos\b/i, label: "Lagos" },
];

function parseCityFromLocationName(locationName: string): string | null {
  const normalized = locationName.replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  for (const { re, label } of LOCATION_NAME_CITY_PATTERNS) {
    if (re.test(normalized)) return label;
  }

  const parts = normalized.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const candidate = parts[parts.length - 2] ?? "";
    if (candidate.length >= 3 && candidate.length <= 40 && !/^\d/.test(candidate)) {
      return candidate;
    }
  }
  return null;
}

function hasValidCoords(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

/**
 * Human place label for slugs: geohash SEO areas first, then parsed `locationName`.
 */
export function resolveListingPlaceLabel(input: ListingPlaceInput): string {
  if (!hasValidCoords(input.lat, input.lng)) {
    const parsed = parseCityFromLocationName(input.locationName ?? "");
    return parsed ?? "";
  }

  const fromCoords = resolveAreaFromCoordinates(input.lat, input.lng);
  if (fromCoords && fromCoords.slug !== "chandigarh") {
    return fromCoords.name;
  }
  if (fromCoords?.slug === "chandigarh") {
    const parsed = parseCityFromLocationName(input.locationName ?? "");
    if (parsed && parsed !== "Chandigarh Tricity") return parsed;
    return fromCoords.name;
  }

  const parsed = parseCityFromLocationName(input.locationName ?? "");
  if (parsed) return parsed;

  return "";
}
