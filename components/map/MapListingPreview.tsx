"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListingCard } from "@/lib/types/listing";
import { formatPrice } from "@/lib/format";
import { listingDetailHref } from "@/lib/listing-links";
import { listingToSlugInput } from "@/lib/listing-path";
import { trackListingClick } from "@/lib/ga4";
import ListingSaveButton from "@/components/listings/ListingSaveButton";

interface Props {
  listing: ListingCard;
  onClose: () => void;
}

export default function MapListingPreview({ listing, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const priceLabel = formatPrice(listing.price, listing.priceUnit, listing.homeIso);

  useFocusTrap({
    active: true,
    containerRef: dialogRef,
    initialFocusRef: closeRef,
    onEscape: onClose,
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnPath = (() => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("selected", listing.id);
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  })();
  const href = listingDetailHref(listingToSlugInput(listing), returnPath);

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.div
      id="map-listing-preview"
      ref={dialogRef}
      className="absolute bottom-4 left-4 right-4 z-10 mx-auto max-w-sm md:left-4 md:right-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Listing preview: ${listing.title}`}
      {...motionProps}
    >
      <div className="rp-glass overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] ring-1 ring-[var(--brand-navy)]/8">
        <div className="relative p-3">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-sm text-[var(--muted)] hover:text-[var(--text)]"
            aria-label="Close preview"
          >
            ×
          </button>
          <div className="absolute left-2 top-2 z-10">
            <ListingSaveButton listingId={listing.id} size="sm" />
          </div>
          <Link
            href={href}
            onClick={() => trackListingClick(listing.id, "map")}
            className="flex gap-3 no-underline"
          >
            <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-elevated)]">
              {listing.imageUrl ? (
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xl opacity-40">📷</div>
              )}
            </div>
            <div className="min-w-0 flex-1 pr-8">
              <p className="truncate font-medium leading-snug">{listing.title}</p>
              <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                {listing.locationName || listing.category}
              </p>
              <p className="mt-1.5 font-serif text-[var(--accent)]">{priceLabel}</p>
            </div>
          </Link>
          <Link
            href={href}
            onClick={() => trackListingClick(listing.id, "map")}
            className="rp-btn rp-btn-primary mt-3 w-full py-2.5 text-sm"
          >
            View listing
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
