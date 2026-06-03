"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListingCard as ListingCardType } from "@/lib/types/listing";
import { formatPrice } from "@/lib/format";
import { listingDetailHref } from "@/lib/listing-links";
import { listingToSlugInput } from "@/lib/listing-path";
import { trackListingClick } from "@/lib/ga4";
import { primaryListingInGroup, unitPriceChips } from "@/lib/map-building-groups";
import ListingSaveButton from "@/components/listings/ListingSaveButton";
import ContactNotVerifiedBadge from "@/components/listings/ContactNotVerifiedBadge";
import { showContactNotVerifiedBadge } from "@/lib/listing-contact";

interface Props {
  listings: ListingCardType[];
  source?: "map" | "list";
  selectedId?: string | null;
  highlightedId?: string | null;
}

/** Zillow-style card when multiple listings share the same building pin. */
export default function MapBuildingListingCard({
  listings,
  source = "map",
  selectedId = null,
  highlightedId = null,
}: Props) {
  const primary = primaryListingInGroup(listings);
  const chips = unitPriceChips(listings);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSelected = listings.some((l) => l.id === selectedId);
  const isHighlighted =
    !isSelected && listings.some((l) => l.id === highlightedId);
  const priceLabel = formatPrice(primary.price, primary.priceUnit, primary.homeIso);
  const title = primary.locationName || primary.title;
  const subtitle = primary.title !== title ? primary.title : primary.category;

  function returnPathFor(listingId: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("selected", listingId);
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  const primaryHref = listingDetailHref(
    listingToSlugInput(primary),
    returnPathFor(primary.id)
  );

  return (
    <article
      id={`map-listing-${primary.id}`}
      data-listing-id={primary.id}
      role="listitem"
      className={`group relative overflow-hidden rounded-[var(--radius-lg)] border transition-all duration-200 motion-reduce:transition-none ${
        isSelected
          ? "border-[var(--brand-orange)] bg-[color-mix(in_srgb,var(--brand-orange)_8%,var(--surface))] shadow-[var(--shadow-glow)]"
          : isHighlighted
            ? "border-[color-mix(in_srgb,var(--brand-orange)_45%,var(--border))] bg-[color-mix(in_srgb,var(--brand-navy)_4%,var(--surface))] shadow-sm"
            : "border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--brand-navy)_25%,var(--border))]"
      }`}
    >
      <div className="absolute right-3 top-3 z-10">
        <ListingSaveButton listingId={primary.id} size="sm" />
      </div>
      <Link
        href={primaryHref}
        onClick={() => trackListingClick(primary.id, source)}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)] no-underline"
      >
        {primary.imageUrl ? (
          <Image
            src={primary.imageUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl opacity-40">📷</div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-[var(--brand-navy)] px-2 py-1 text-[11px] font-bold text-white shadow-sm">
          {listings.length} listings here
        </span>
      </Link>
      <div className="space-y-2 p-3">
        <Link
          href={primaryHref}
          onClick={() => trackListingClick(primary.id, source)}
          className="block no-underline"
        >
          <p className="truncate font-semibold leading-snug text-[var(--brand-navy)]">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{subtitle}</p>
          )}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-serif text-lg leading-none text-[var(--brand-orange)]">
            {priceLabel}
            {listings.length > 1 ? "+" : ""}
          </p>
          {showContactNotVerifiedBadge(primary) && <ContactNotVerifiedBadge />}
        </div>
        {chips.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => {
              const unit = listings.find((l) => l.id === chip.listingId);
              const href = listingDetailHref(
                unit ? listingToSlugInput(unit) : chip.listingId,
                returnPathFor(chip.listingId)
              );
              return (
                <Link
                  key={chip.listingId}
                  href={href}
                  onClick={() => trackListingClick(chip.listingId, source)}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-navy)] no-underline hover:border-[var(--brand-navy)]"
                >
                  {chip.label}
                </Link>
              );
            })}
          </div>
        )}
        <Link
          href={primaryHref}
          onClick={() => trackListingClick(primary.id, source)}
          className="rp-btn rp-btn-primary mt-1 w-full py-2.5 text-sm no-underline"
        >
          View {listings.length} listings
        </Link>
      </div>
    </article>
  );
}
