import Link from "next/link";
import ListingsGrid from "@/components/ListingsGrid";
import { appPath } from "@/lib/config";
import type { SeoListingCard } from "@/lib/seo-listings";

interface Props {
  title: string;
  placeName: string;
  browseHref: string;
  listings: SeoListingCard[];
}

export default function LiveListingsBlock({ title, placeName, browseHref, listings }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12" aria-labelledby="live-listings-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="live-listings-heading" className="rp-section-title text-xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Live owner listings on RentalPins — contact directly, no broker search fee.
          </p>
        </div>
        <Link href={appPath(browseHref)} className="text-sm font-semibold text-[var(--brand-orange)] hover:underline">
          View all {placeName} rentals
        </Link>
      </div>
      {listings.length > 0 ? (
        <div className="mt-8">
          <ListingsGrid listings={listings} areaName={placeName} />
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-8 text-center text-sm text-[var(--muted)]">
          No active listings in this filter right now — browse the map or save a search for alerts.
        </p>
      )}
    </section>
  );
}
