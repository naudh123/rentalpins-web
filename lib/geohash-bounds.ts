import ngeohash from "ngeohash";
import type { MapBounds } from "@/lib/types/saved-search";

/** Geohash precision by map zoom — finer cells when zoomed in. */
export function geohashPrecisionForZoom(zoom: number | null | undefined): number {
  const z = zoom ?? 11;
  if (z >= 16) return 7;
  if (z >= 10) return 6; // city / metro — finer cells for dense hubs (was z11+)
  return 4;
}

/** Grid divisions per axis (inclusive steps → (steps+1)² prefixes). */
export function gridStepsForPrecision(precision: number): number {
  if (precision >= 7) return 8;
  if (precision >= 6) return 6; // 81 cells — better coverage in dense hubs
  if (precision >= 5) return 6;
  return 5;
}

export function limitPerPrefixForZoom(zoom: number | null | undefined): number {
  const z = zoom ?? 11;
  if (z >= 16) return 78;
  if (z >= 15) return 70;
  if (z >= 14) return 58;
  if (z >= 13) return 52;
  return 40;
}

/** Inner viewport slice (centered) for extra tiling at metro zoom. */
export function shrinkBoundsTowardCenter(
  bounds: MapBounds,
  spanFactor = 0.5
): MapBounds {
  const latSpan = bounds.north - bounds.south;
  const insetLat = (latSpan * (1 - spanFactor)) / 2;
  let east = bounds.east;
  let west = bounds.west;
  if (bounds.west <= bounds.east) {
    const lngSpan = bounds.east - bounds.west;
    const insetLng = (lngSpan * (1 - spanFactor)) / 2;
    east = bounds.east - insetLng;
    west = bounds.west + insetLng;
  }
  return {
    north: bounds.north - insetLat,
    south: bounds.south + insetLat,
    east,
    west,
  };
}

/** Base grid plus finer center tiles at city zoom (12–14) for dense metros. */
export function geohashPrefixesForViewport(
  bounds: MapBounds,
  zoom: number | null | undefined
): { prefixes: string[]; precision: number; gridSteps: number } {
  const precision = geohashPrecisionForZoom(zoom);
  const gridSteps = gridStepsForPrecision(precision);
  const base = geohashPrefixesForBounds(bounds, precision, gridSteps);
  const z = zoom ?? 11;

  if (z >= 16) {
    const inner = shrinkBoundsTowardCenter(bounds, 0.42);
    const innerSteps = 5;
    const innerPrefixes = geohashPrefixesForBounds(inner, precision, innerSteps);
    return {
      prefixes: [...new Set([...base, ...innerPrefixes])],
      precision,
      gridSteps,
    };
  }

  if (z >= 14 && z <= 15) {
    const inner = shrinkBoundsTowardCenter(bounds, 0.5);
    const innerPrecision = Math.min(precision + 1, 7);
    const innerSteps = Math.max(3, Math.floor(gridSteps / 2));
    const innerPrefixes = geohashPrefixesForBounds(inner, innerPrecision, innerSteps);
    return {
      prefixes: [...new Set([...base, ...innerPrefixes])],
      precision,
      gridSteps,
    };
  }

  return { prefixes: base, precision, gridSteps };
}

/** Geohash prefixes covering map bounds. */
export function geohashPrefixesForBounds(
  bounds: MapBounds,
  precision = 5,
  gridSteps = 4
): string[] {
  const latStep = (bounds.north - bounds.south) / gridSteps;
  const lngStep = (bounds.east - bounds.west) / gridSteps;
  const prefixes = new Set<string>();
  for (let i = 0; i <= gridSteps; i++) {
    for (let j = 0; j <= gridSteps; j++) {
      const lat = bounds.south + latStep * i;
      const lng = bounds.west + lngStep * j;
      prefixes.add(ngeohash.encode(lat, lng, precision));
    }
  }
  return [...prefixes];
}

/** Fetch viewport center cells first so dense areas show nearby pins sooner. */
export function sortGeohashPrefixesNearCenter(
  prefixes: string[],
  centerLat: number,
  centerLng: number
): string[] {
  return [...prefixes].sort((a, b) => {
    const ac = ngeohash.decode(a);
    const bc = ngeohash.decode(b);
    const da =
      (ac.latitude - centerLat) ** 2 + (ac.longitude - centerLng) ** 2;
    const db =
      (bc.latitude - centerLat) ** 2 + (bc.longitude - centerLng) ** 2;
    return da - db;
  });
}

/** Legacy chunk size (tests/docs); queries now run in one parallel wave. */
export const GEOHASH_QUERY_BATCH_SIZE = 32;

/** Safety cap — prefer center cells when the viewport grid exceeds budget (cost guard). */
export const GEOHASH_MAX_PREFIXES = 80;

/** Zoom-aware prefix budget — fewer cells = faster fetch on mobile. */
export function geohashMaxPrefixesForZoom(zoom: number | null | undefined): number {
  const z = zoom ?? 11;
  if (z >= 16) return 72;
  if (z >= 14) return GEOHASH_MAX_PREFIXES;
  if (z >= 12) return 56;
  if (z >= 10) return 44;
  return 36;
}

/** True when the viewport grid exceeds the zoom-aware prefix budget (center cells kept). */
export function isLikelyGeohashPrefixCapped(
  bounds: MapBounds,
  zoom: number | null | undefined
): boolean {
  const { prefixes } = geohashPrefixesForViewport(bounds, zoom);
  return prefixes.length > geohashMaxPrefixesForZoom(zoom);
}

export function capGeohashPrefixesNearCenter(
  prefixes: string[],
  centerLat: number,
  centerLng: number,
  max = GEOHASH_MAX_PREFIXES
): string[] {
  if (prefixes.length <= max) return prefixes;
  return sortGeohashPrefixesNearCenter(prefixes, centerLat, centerLng).slice(0, max);
}

/** Re-query center cells with a higher limit when the first pass hits the cap. */
export const GEOHASH_CENTER_BOOST_PREFIXES = 10;

/** Hard cap on per-prefix limit for the center boost pass. */
export const GEOHASH_BOOST_LIMIT_CAP = 96;

export function bonusLimitPerPrefix(baseLimit: number): number {
  return Math.min(baseLimit + 24, GEOHASH_BOOST_LIMIT_CAP);
}

export function estimateGeohashResultCap(gridSteps: number, limitPerPrefix: number): number {
  const cells = (gridSteps + 1) ** 2;
  return cells * limitPerPrefix;
}

/** True when raw result count is near the theoretical query cap (dense area). */
export function isLikelyResultCapSaturated(
  rawCount: number,
  gridSteps: number,
  limitPerPrefix: number,
  threshold = 0.82
): boolean {
  const cap = estimateGeohashResultCap(gridSteps, limitPerPrefix);
  return rawCount >= cap * threshold;
}
