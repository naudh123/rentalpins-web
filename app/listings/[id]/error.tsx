"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ListingDetailError({ error, reset }: Props) {
  const params = useParams<{ id: string }>();
  const listingId = params?.id ?? "";

  useEffect(() => {
    trackEvent("listing_detail_error_viewed", {
      message: error.message || "unknown_error",
      ...(listingId ? { listing_id: listingId } : {}),
      ...(error.digest ? { digest: error.digest } : {}),
    });
  }, [error.digest, error.message, listingId]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rp-card p-8">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">
          Could not load listing
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {error.message || "Something went wrong while loading this listing."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              trackEvent("listing_detail_error_retry_clicked", {
                ...(listingId ? { listing_id: listingId } : {}),
              });
              reset();
            }}
            className="rp-btn rp-btn-primary px-6 py-2.5"
          >
            Try again
          </button>
          <Link
            href={appPath("/search")}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
            onClick={() =>
              trackEvent("listing_detail_error_back_to_map_clicked", {
                ...(listingId ? { listing_id: listingId } : {}),
              })
            }
          >
            Back to map
          </Link>
        </div>
      </div>
    </div>
  );
}
