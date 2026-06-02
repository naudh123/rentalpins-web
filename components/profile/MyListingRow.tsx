import Image from "next/image";
import Link from "next/link";
import type { OwnerListing } from "@/lib/my-listings";
import { appPath } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { listingPublicPath } from "@/lib/listing-path";

interface Props {
  listing: OwnerListing;
}

export default function MyListingRow({ listing }: Props) {
  const priceLabel = formatPrice(listing.price, listing.priceUnit, listing.homeIso);
  const href = listing.isActive
    ? listingPublicPath({
        id: listing.id,
        title: listing.title,
        locationName: listing.locationName,
        lat: 0,
        lng: 0,
        category: listing.category,
      })
    : appPath(`/post?listingId=${listing.id}`);

  return (
    <Link
      href={href}
      className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:border-[color-mix(in_srgb,var(--brand-navy)_25%,var(--border))]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-elevated)]">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xl opacity-40">📷</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium text-[var(--brand-navy)]">{listing.title}</p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              listing.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {listing.isActive ? "Live" : "Draft"}
          </span>
          {listing.isPromoted && listing.isActive && (
            <span className="rp-badge shrink-0">Featured</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
          {listing.locationName || listing.category}
        </p>
        <p className="mt-1 text-sm text-[var(--brand-orange)]">{priceLabel}</p>
        {listing.isActive && (
          <p className="mt-1 text-[10px] text-[var(--muted)]">
            {listing.viewsCount} views · {listing.inquiryCount} inquiries
          </p>
        )}
        {!listing.isActive && (
          <p className="mt-1 text-xs font-medium text-[var(--brand-orange)]">
            Tap to edit draft →
          </p>
        )}
      </div>
    </Link>
  );
}
