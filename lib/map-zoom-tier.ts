/** Pin label density tiers — icons only regenerate when tier changes, not every zoom tick. */
export type MapPinLabelTier = "dot" | "compact" | "detailed";

/** Below this zoom every listing is a small dot (Zillow city view); price pills from here up. */
export const MAP_PRICE_PILL_MIN_ZOOM = 13;

/**
 * Zillow-style: when only a few listings are in view (small towns, sparse areas)
 * show their prices straight away instead of bare dots, once pins are individual.
 */
export const MAP_SPARSE_PRICE_PILL_MAX = 60;
export const MAP_SPARSE_PRICE_PILL_MIN_ZOOM = 10;

export function mapPinLabelTier(mapZoom: number, pinsInView?: number): MapPinLabelTier {
  if (mapZoom >= 14) return "detailed";
  if (mapZoom >= MAP_PRICE_PILL_MIN_ZOOM) return "compact";
  if (
    pinsInView != null &&
    pinsInView <= MAP_SPARSE_PRICE_PILL_MAX &&
    mapZoom >= MAP_SPARSE_PRICE_PILL_MIN_ZOOM
  ) {
    return "compact";
  }
  return "dot";
}
