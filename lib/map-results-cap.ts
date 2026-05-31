import {
  geohashPrecisionForZoom,
  gridStepsForPrecision,
  isLikelyGeohashPrefixCapped,
  isLikelyResultCapSaturated,
  limitPerPrefixForZoom,
} from "@/lib/geohash-bounds";
import type { MapBounds } from "@/lib/types/saved-search";

export function mapDensityHint(
  totalInBounds: number,
  mapZoom: number,
  resultsMayBeIncomplete?: boolean,
  visibleCount?: number,
  opts?: { bounds?: MapBounds | null; prefixCapActive?: boolean }
): string | null {
  const shown =
    visibleCount != null && visibleCount >= 0 ? visibleCount : totalInBounds;

  const prefixCapActive =
    opts?.prefixCapActive ??
    (opts?.bounds ? isLikelyGeohashPrefixCapped(opts.bounds, mapZoom) : false);

  if (resultsMayBeIncomplete || prefixCapActive) {
    return shown > 0
      ? `Showing ${shown} pins — zoom in to load more in this area`
      : "Zoom in to discover listings in this area";
  }
  const precision = geohashPrecisionForZoom(mapZoom);
  const steps = gridStepsForPrecision(precision);
  const limit = limitPerPrefixForZoom(mapZoom);
  if (isLikelyResultCapSaturated(totalInBounds, steps, limit)) {
    return shown > 0
      ? `Showing ${shown} pins — dense area, zoom in for more`
      : "Many listings here — zoom in for the full picture";
  }
  return null;
}
