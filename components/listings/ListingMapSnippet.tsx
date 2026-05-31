"use client";

import { useEffect, useRef, useState } from "react";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";
import { mapSearchUrl } from "@/lib/map-search-url";
import ListingMapLink from "@/components/listings/ListingMapLink";

interface Props {
  listingId: string;
  lat: number;
  lng: number;
  locationName?: string;
}

export default function ListingMapSnippet({
  listingId,
  lat,
  lng,
  locationName,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackedRef = useRef(false);
  const [showMap, setShowMap] = useState(false);

  const hasGeo =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180;

  const searchHref = hasGeo ? appPath(mapSearchUrl(lat, lng, 14, listingId)) : "";
  const embedSrc = hasGeo
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
    : "";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !hasGeo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!showMap) setShowMap(true);
        if (trackedRef.current) return;
        trackedRef.current = true;
        trackEvent("listing_map_snippet_shown", { listing_id: listingId });
      },
      { rootMargin: "120px 0px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasGeo, listingId, showMap]);

  if (!hasGeo) return null;

  return (
    <section
      id="listing-location"
      ref={sectionRef}
      className="rp-card mt-4 overflow-hidden p-0"
      aria-labelledby="listing-location-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3">
        <div>
          <h2 id="listing-location-heading" className="rp-label mb-0 uppercase tracking-wider">
            Location
          </h2>
          {locationName && (
            <p className="mt-1 text-sm text-[var(--muted)]">{locationName}</p>
          )}
        </div>
        <ListingMapLink
          href={searchHref}
          listingId={listingId}
          linkSource="location_snippet"
          className="text-xs font-semibold text-[var(--brand-orange)] hover:underline"
        >
          View on map →
        </ListingMapLink>
      </div>
      <div className="relative h-52 w-full bg-[var(--surface)] md:h-56">
        {showMap ? (
          <iframe
            title={locationName ? `Map: ${locationName}` : "Listing location"}
            src={embedSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-xs text-[var(--muted)]"
            aria-hidden
          >
            Loading map…
          </div>
        )}
      </div>
    </section>
  );
}
