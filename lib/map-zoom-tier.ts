/** Pin label density tiers — icons only regenerate when tier changes, not every zoom tick. */
export type MapPinLabelTier = "compact" | "detailed";

export function mapPinLabelTier(mapZoom: number): MapPinLabelTier {
  return mapZoom >= 14 ? "detailed" : "compact";
}
