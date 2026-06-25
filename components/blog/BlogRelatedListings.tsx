import Link from "next/link";
import ListingsGrid from "@/components/ListingsGrid";
import { appPath } from "@/lib/config";
import type { BlogListingHub } from "@/lib/blog-related-listings";
import type { SeoListingCard } from "@/lib/seo-listings";

interface Props {
  hub: BlogListingHub | { label: string; placeName: string; hubHref: string };
  listings: SeoListingCard[];
  transactionType?: "rent" | "sale";
}

export default function BlogRelatedListings({
  hub,
  listings,
  transactionType = "rent",
}: Props) {
  const isSale = transactionType === "sale";
  const inventoryLabel = isSale ? "sale listings" : "rentals";
  return (
    <section
      aria-labelledby="related-listings-heading"
      className="mt-16 border-t border-slate-200 pt-12"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="related-listings-heading"
            className="font-serif text-2xl font-bold text-[#1E3A6E]"
          >
            {hub.label}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Live {inventoryLabel} from owners on RentalPins — contact directly, no broker.
          </p>
        </div>
        <Link
          href={appPath(hub.hubHref)}
          className="text-sm font-semibold text-[#E8501A] hover:underline"
        >
          View all {hub.placeName} {inventoryLabel}
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="mt-8">
          <ListingsGrid
            listings={listings}
            areaName={hub.placeName}
            transactionType={transactionType}
          />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
          <p className="text-sm text-slate-600">
            No active listings found in {hub.placeName} right now.
          </p>
          <Link
            href={appPath(hub.hubHref)}
            className="mt-4 inline-flex text-sm font-semibold text-[#E8501A] hover:underline"
          >
            Browse {hub.placeName} {inventoryLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
