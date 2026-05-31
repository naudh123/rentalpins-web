import type { ListingCard } from "@/lib/types/listing";

export const MAP_HEATMAP_MAX_POINTS = 200;

/** Brand navy → orange gradient (legacy HeatmapLayer — kept for reference). */
export const MAP_HEATMAP_GRADIENT = [
  "rgba(247, 244, 240, 0)",
  "rgba(30, 58, 110, 0.35)",
  "rgba(30, 58, 110, 0.55)",
  "rgba(232, 80, 26, 0.75)",
  "rgba(232, 80, 26, 1)",
] as const;

export function sampleListingsForHeatmap(
  listings: ListingCard[],
  max = MAP_HEATMAP_MAX_POINTS
): ListingCard[] {
  const valid = listings.filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng));
  if (valid.length <= max) return valid;
  const step = Math.ceil(valid.length / max);
  return valid.filter((_, i) => i % step === 0).slice(0, max);
}

export function heatmapRadiusForZoom(mapZoom: number): number {
  if (mapZoom <= 6) return 48;
  if (mapZoom <= 8) return 36;
  return 28;
}

export function heatmapWeight(listing: ListingCard): number {
  return listing.isPromoted ? 2 : 1;
}
