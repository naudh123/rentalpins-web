"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ListingCard as ListingCardType } from "@/lib/types/listing";
import { formatPrice } from "@/lib/format";
import { listingDetailHref } from "@/lib/listing-links";
import { listingToSlugInput } from "@/lib/listing-path";
import { trackListingClick } from "@/lib/ga4";
import ListingSaveButton from "@/components/listings/ListingSaveButton";
import ContactNotVerifiedBadge from "@/components/listings/ContactNotVerifiedBadge";
import { showContactNotVerifiedBadge } from "@/lib/listing-contact";

interface Props {
  listing: ListingCardType;
  source?: "map" | "list";
  selected?: boolean;
  highlighted?: boolean;
  /** Overrides return `from` query (e.g. current listing detail path). */
  returnPath?: string;
  /** Vertical card for two-column map grid (Zillow-style). */
  layout?: "row" | "stack";
}

export default function ListingCard({
  listing,
  source = "list",
  selected = false,
  highlighted = false,
  returnPath: returnPathOverride,
  layout = "row",
}: Props) {
  const router = useRouter();
  const priceLabel = formatPrice(listing.price, listing.priceUnit, listing.homeIso);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnPath =
    returnPathOverride ??
    (source === "map"
      ? (() => {
          const p = new URLSearchParams(searchParams.toString());
          p.set("selected", listing.id);
          const qs = p.toString();
          return `${pathname}${qs ? `?${qs}` : ""}`;
        })()
      : undefined);
  const href = listingDetailHref(listingToSlugInput(listing), returnPath);
  const isStack = layout === "stack";

  function openListing(e: React.MouseEvent<HTMLAnchorElement>) {
    trackListingClick(listing.id, source);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    e.preventDefault();
    router.push(href);
  }

  return (
    <Link
      href={href}
      onClick={openListing}
      aria-current={source === "map" && selected ? "true" : undefined}
      className={`group relative rounded-[var(--radius-lg)] border p-3 transition-all duration-200 motion-reduce:transition-none ${
        isStack ? "flex flex-col gap-2" : "flex gap-3"
      } ${
        selected
          ? "border-[var(--brand-orange)] bg-[color-mix(in_srgb,var(--brand-orange)_8%,var(--surface))] shadow-[var(--shadow-glow)]"
          : highlighted
            ? "border-[color-mix(in_srgb,var(--brand-orange)_45%,var(--border))] bg-[color-mix(in_srgb,var(--brand-navy)_4%,var(--surface))] shadow-sm"
            : "border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--brand-navy)_25%,var(--border))] hover:bg-[var(--surface-hover)]"
      }`}
    >
      <div className={`absolute z-10 ${isStack ? "right-2 top-2" : "right-3 top-3"}`}>
        <ListingSaveButton listingId={listing.id} size="sm" />
      </div>
      <div
        className={`relative shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-elevated)] ${
          isStack ? "aspect-[4/3] w-full" : "h-[5.5rem] w-[5.5rem]"
        }`}
      >
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes={isStack ? "(max-width: 767px) 100vw, 200px" : "88px"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl opacity-40">
            📷
          </div>
        )}
        {listing.isPromoted && (
          <span className="absolute left-1.5 top-1.5 rp-badge">Featured</span>
        )}
      </div>
      <div className={`flex min-w-0 flex-1 flex-col ${isStack ? "justify-start" : "justify-center"}`}>
        <p className={`font-medium leading-snug group-hover:text-[var(--brand-navy)] ${isStack ? "line-clamp-2 text-sm" : "truncate"}`}>
          {listing.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
          {listing.locationName || listing.category}
        </p>
        {(() => {
          const a = listing.attributes;
          if (!a) return null;
          const specs = [
            a.bhk,
            a.furnishing,
            a.areaSqft ? `${a.areaSqft} sq ft` : null,
          ].filter(Boolean);
          if (!specs.length) return null;
          return (
            <p className="mt-1 truncate text-[11px] font-medium text-[var(--brand-navy)]">
              {specs.join(" · ")}
            </p>
          );
        })()}
        <div className="mt-2 flex items-center gap-2">
          <p className="font-serif text-base leading-none text-[var(--brand-orange)]">
            {priceLabel}
          </p>
          <span
            className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-emerald-700"
            title="Rent directly from the owner — no brokerage"
          >
            <span aria-hidden>₹</span>No brokerage
          </span>
          {showContactNotVerifiedBadge(listing) && (
            <ContactNotVerifiedBadge />
          )}
        </div>
      </div>
    </Link>
  );
}
