/** Pin label density tiers — icons only regenerate when tier changes, not every zoom tick. */
export type MapPinLabelTier = "dot" | "compact" | "detailed";

/** Below this zoom every listing is a small dot (Zillow city view); price pills from here up. */
export const MAP_PRICE_PILL_MIN_ZOOM = 13;

export function mapPinLabelTier(mapZoom: number): MapPinLabelTier {
  if (mapZoom >= 14) return "detailed";
  if (mapZoom >= MAP_PRICE_PILL_MIN_ZOOM) return "compact";
  return "dot";
}
