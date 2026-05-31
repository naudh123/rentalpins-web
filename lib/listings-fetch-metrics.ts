export interface ListingsFetchMetrics {
  zoom: number | null | undefined;
  rawPrefixCount: number;
  queriedPrefixCount: number;
  prefixCapActive: boolean;
  primaryWaveCount: number;
  boostWaveCount: number;
  limitPerPrefix: number;
  boostLimitPerPrefix?: number;
  totalInBounds: number;
  filteredCount: number;
  resultsMayBeIncomplete: boolean;
}

/** Dev-only console trace for geohash fetch cost (prefix/wave counts). */
export function logListingsFetchMetrics(metrics: ListingsFetchMetrics): void {
  if (process.env.NODE_ENV === "production") return;
  console.debug("[listings-fetch]", metrics);
}
