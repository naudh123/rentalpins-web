import Link from "next/link";
import {
  getBrowseHref,
  getListForSaleHref,
  getListPropertyHref,
  type SupplyIntent,
} from "@/lib/seo-links";
import type { TransactionType } from "@/lib/transaction-type";

interface Props {
  browseHref?: string;
  listHref?: string;
  citySlug?: string;
  areaSlug?: string;
  intent?: SupplyIntent;
  placeQuery?: string;
  transactionType?: TransactionType;
}

/** Mobile-only sticky dual CTA for SEO landing pages. */
export default function StickySeoCTA({
  browseHref,
  listHref,
  citySlug,
  areaSlug,
  intent = "general",
  placeQuery,
  transactionType = "rent",
}: Props) {
  const isSale = transactionType === "sale";
  const browse =
    browseHref ??
    getBrowseHref({ placeQuery, transactionType });
  const list =
    listHref ??
    (isSale
      ? getListForSaleHref({ citySlug, areaSlug, intent })
      : getListPropertyHref({ citySlug, areaSlug, intent }));
  const listCta = isSale ? "list-for-sale" : "list-property-free";
  const browseCta = isSale ? "browse-sale-listings" : "browse-rentals";
  const listLabel = isSale ? "List for Sale" : "List Property Free";
  const browseLabel = isSale ? "Explore Sale Map" : "Browse Rentals";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
        role="region"
        aria-label="Quick actions"
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <Link
            href={browse}
            data-cta={browseCta}
            data-location="sticky"
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-secondary min-h-11 flex-1 px-3 py-2.5 text-sm"
          >
            {browseLabel}
          </Link>
          <Link
            href={list}
            data-cta={listCta}
            data-location="sticky"
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-primary min-h-11 flex-1 px-3 py-2.5 text-sm"
          >
            {listLabel}
          </Link>
        </div>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
