"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ListingRelatedListingCard from "@/components/listings/ListingRelatedListingCard";
import { trackEvent } from "@/lib/ga4";
import { getRecentlyViewedIds } from "@/lib/recently-viewed";
import { subscribeListingCardsByIds } from "@/lib/saved-listing-cards";
import type { ListingCard as ListingCardType } from "@/lib/types/listing";

interface Props {
  /** Hide the current listing from the rail (detail page). */
  excludeId?: string;
  limit?: number;
  className?: string;
}

export default function RecentlyViewedRail({
  excludeId,
  limit = 4,
  className = "",
}: Props) {
  const [ids, setIds] = useState<string[]>([]);
  const [cards, setCards] = useState<ListingCardType[]>([]);
  const railTrackedRef = useRef(false);

  useEffect(() => {
    setIds(getRecentlyViewedIds());
  }, [excludeId]);

  useEffect(() => {
    const onStorage = () => setIds(getRecentlyViewedIds());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const displayIds = useMemo(() => {
    const filtered = excludeId ? ids.filter((id) => id !== excludeId) : ids;
    return filtered.slice(0, limit);
  }, [ids, excludeId, limit]);

  useEffect(() => {
    if (!displayIds.length) {
      setCards([]);
      return;
    }
    return subscribeListingCardsByIds(
      displayIds,
      setCards,
      undefined,
      displayIds
    );
  }, [displayIds]);

  useEffect(() => {
    if (!cards.length || railTrackedRef.current) return;
    railTrackedRef.current = true;
    trackEvent("listing_recently_viewed_rail_shown", {
      listing_count: cards.length,
      ...(excludeId ? { source_listing_id: excludeId } : {}),
      context: excludeId ? "detail" : "home",
    });
  }, [cards.length, excludeId]);

  if (!cards.length) return null;

  return (
    <section
      id="listing-recently-viewed"
      className={`scroll-mt-24 ${className}`}
      aria-labelledby="listing-recently-viewed-heading"
    >
      <h2 id="listing-recently-viewed-heading" className="font-serif text-xl">
        Recently viewed
      </h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Picks from this browser — sign in to save favourites permanently.
      </p>
      <div className="mt-4 grid gap-3">
        {cards.map((listing) => (
          <ListingRelatedListingCard
            key={listing.id}
            listing={listing}
            section="recently_viewed"
            sourceListingId={excludeId ?? ""}
          />
        ))}
      </div>
    </section>
  );
}
