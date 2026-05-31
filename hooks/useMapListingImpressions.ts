"use client";

import { useEffect, useRef } from "react";
import { trackListingImpression } from "@/lib/ga4";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";

interface Options {
  listings: ListingCardData[];
  max?: number;
}

/** Track first-seen list impressions once per session (top N listings). */
export function useMapListingImpressions({
  listings,
  max = 20,
}: Options): void {
  const impressedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const listing of listings.slice(0, max)) {
      if (impressedIdsRef.current.has(listing.id)) continue;
      impressedIdsRef.current.add(listing.id);
      trackListingImpression(listing.id, "map");
    }
  }, [listings, max]);
}
