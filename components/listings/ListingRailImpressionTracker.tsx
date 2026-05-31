"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/ga4";

interface Props {
  listingId: string;
  rail: "owner" | "similar";
  listingCount: number;
}

/** Fires once when an owner/similar rail enters the viewport. */
export default function ListingRailImpressionTracker({
  listingId,
  rail,
  listingCount,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || trackedRef.current) return;
        trackedRef.current = true;
        trackEvent(
          rail === "owner" ? "listing_owner_rail_viewed" : "listing_similar_rail_viewed",
          {
            listing_id: listingId,
            listing_count: listingCount,
          }
        );
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [listingCount, listingId, rail]);

  return <div ref={ref} className="h-px w-full" aria-hidden />;
}
