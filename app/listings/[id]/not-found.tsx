"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

export default function ListingDetailNotFound() {
  const params = useParams<{ id: string }>();
  const listingId = params?.id ?? "";

  useEffect(() => {
    trackEvent("listing_detail_not_found_viewed", {
      ...(listingId ? { listing_id: listingId } : {}),
    });
  }, [listingId]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rp-card p-8">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Listing not found</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This listing may have been removed or is no longer active.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={appPath("/search")}
            className="rp-btn rp-btn-primary px-6 py-2.5"
            onClick={() =>
              trackEvent("listing_detail_not_found_cta_clicked", {
                destination: "search",
                ...(listingId ? { listing_id: listingId } : {}),
              })
            }
          >
            Browse map
          </Link>
          <Link
            href={appPath("/saved-listings")}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
            onClick={() =>
              trackEvent("listing_detail_not_found_cta_clicked", {
                destination: "saved_listings",
                ...(listingId ? { listing_id: listingId } : {}),
              })
            }
          >
            Saved listings
          </Link>
        </div>
      </div>
    </div>
  );
}
