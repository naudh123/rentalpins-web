import Link from "next/link";
import { appPath } from "@/lib/config";
import { BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { getBrowseHref, getListForSaleHref, getListPropertyHref } from "@/lib/seo-links";

interface Props {
  cityName?: string;
  citySlug?: string;
  variant?: "blog" | "bottom";
}

/** Dual rent + buy CTAs for neutral editorial posts. */
export default function BlogNeutralCTA({
  cityName,
  citySlug,
  variant = "blog",
}: Props) {
  const locationAttr = variant === "blog" ? "blog" : "bottom";
  const place = cityName ?? "your area";
  const rentBrowse = getBrowseHref({ placeQuery: place });
  const saleBrowse = getBrowseHref({ placeQuery: place, transactionType: "sale" });

  return (
    <section
      className={
        variant === "blog"
          ? "my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
          : "mx-auto max-w-3xl px-4 py-8"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Rent or buy in {place}
      </p>
      <h2 className="mt-2 font-serif text-xl text-[#1E3A6E] sm:text-2xl">
        Explore rentals and sale listings on RentalPins
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        Compare owner-direct rent and buy map inventory in {place} — contact
        listers without brokerage search fees.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={rentBrowse}
          data-cta="browse-rentals"
          data-location={locationAttr}
          data-city={citySlug ?? ""}
          className="rp-btn rp-btn-secondary px-5 py-2.5"
        >
          Browse Rentals
        </Link>
        <Link
          href={saleBrowse}
          data-cta="browse-sale-listings"
          data-location={locationAttr}
          data-city={citySlug ?? ""}
          className="rp-btn rp-btn-secondary px-5 py-2.5"
        >
          Explore Sale Map
        </Link>
        <Link
          href={getListPropertyHref({ citySlug })}
          data-cta="list-property-free"
          data-location={locationAttr}
          data-city={citySlug ?? ""}
          className="rp-btn rp-btn-primary px-5 py-2.5"
        >
          List Property Free
        </Link>
        <Link
          href={getListForSaleHref({ citySlug })}
          data-cta="list-for-sale"
          data-location={locationAttr}
          data-city={citySlug ?? ""}
          className="rp-btn rp-btn-primary px-5 py-2.5"
        >
          List for Sale
        </Link>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        <Link href={appPath(BUY_SEARCH_PATH)} className="font-medium text-[#1E3A6E] hover:underline">
          Open RentalPins Buy map →
        </Link>
      </p>
    </section>
  );
}
