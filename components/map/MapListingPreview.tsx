"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListingCard } from "@/lib/types/listing";
import { formatListingPrice } from "@/lib/listing-price";
import { listingDetailHref, persistListingReturnPath } from "@/lib/listing-links";
import { listingToSlugInput } from "@/lib/listing-path";
import { trackListingClick } from "@/lib/ga4";
import ListingShareBar from "@/components/listings/ListingShareBar";
import ListingSaveButton from "@/components/listings/ListingSaveButton";

function listingForShare(card: ListingCard) {
  return {
    ...card,
    imageUrls: card.imageUrl ? [card.imageUrl] : [],
    ownerUid: "",
  };
}

interface Props {
  listing: ListingCard;
  onClose: () => void;
}

export default function MapListingPreview({ listing, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const priceLabel = formatListingPrice({
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    subCategory: listing.subCategory,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso,
  });

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
  const href = listingDetailHref(listingToSlugInput(listing));

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
          <div className="absolute right-2 top-2">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-sm text-[var(--muted)] hover:text-[var(--text)]"
              aria-label="Close preview"
            >
              ×
            </button>
          </div>
          <div className="absolute left-2 top-2 z-10">
            <ListingSaveButton listingId={listing.id} size="sm" />
          </div>
          <Link
            href={href}
            onClick={() => {
              persistListingReturnPath(returnPath);
              trackListingClick(listing.id, "map");
            }}
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
            <div className="min-w-0 flex-1 pr-6">
              <p className="line-clamp-2 font-medium leading-snug text-[var(--brand-navy)]">
                {listing.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                {listing.locationName || listing.category}
              </p>
              <p className="mt-1.5 font-serif text-[var(--brand-navy)]">{priceLabel}</p>
            </div>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href={href}
              onClick={() => {
                persistListingReturnPath(returnPath);
                trackListingClick(listing.id, "map");
              }}
              className="rp-btn rp-btn-primary min-w-0 flex-1 py-2.5 text-sm"
            >
              View listing
            </Link>
            <ListingShareBar listing={listingForShare(listing)} iconOnly />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
