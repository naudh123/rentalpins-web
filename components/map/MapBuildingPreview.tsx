"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListingCard } from "@/lib/types/listing";
import { listingDetailHref } from "@/lib/listing-links";
import { trackListingClick } from "@/lib/ga4";
import { primaryListingInGroup, unitPriceChips } from "@/lib/map-building-groups";

interface Props {
  listings: ListingCard[];
  onClose: () => void;
  onSelectUnit: (listing: ListingCard) => void;
}

export default function MapBuildingPreview({
  listings,
  onClose,
  onSelectUnit,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const primary = primaryListingInGroup(listings);
  const chips = unitPriceChips(listings);
  const title = primary.locationName || primary.title;

  useFocusTrap({
    active: true,
    containerRef: dialogRef,
    initialFocusRef: closeRef,
    onEscape: onClose,
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();

  function returnPathFor(listingId: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("selected", listingId);
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

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
      id="map-building-preview"
      ref={dialogRef}
      className="absolute bottom-4 left-4 right-4 z-10 mx-auto max-w-sm md:left-4 md:right-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${listings.length} listings at ${title}`}
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
          <p className="pr-8 font-medium leading-snug text-[var(--brand-navy)]">{title}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {listings.length} rentals at this address — pick a unit
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip) => {
              const listing = listings.find((l) => l.id === chip.listingId);
              const href = listingDetailHref(chip.listingId, returnPathFor(chip.listingId));
              return (
                <button
                  key={chip.listingId}
                  type="button"
                  onClick={() => {
                    if (listing) onSelectUnit(listing);
                    trackListingClick(chip.listingId, "map");
                  }}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-orange)]"
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
          <Link
            href={listingDetailHref(primary.id, returnPathFor(primary.id))}
            onClick={() => trackListingClick(primary.id, "map")}
            className="rp-btn rp-btn-primary mt-3 w-full py-2.5 text-sm no-underline"
          >
            View all {listings.length} listings
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
