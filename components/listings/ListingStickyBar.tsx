"use client";

import { useEffect, useState } from "react";
import ListingSaveButton from "@/components/listings/ListingSaveButton";
import ListingShareBar from "@/components/listings/ListingShareBar";
import { trackLeadStarted, trackLeadSubmitted } from "@/lib/ga4";
import type { ListingDetail } from "@/lib/types/listing";

const SENTINEL_ID = "listing-detail-sentinel";

type ShareListing = Pick<
  ListingDetail,
  | "id"
  | "title"
  | "price"
  | "priceUnit"
  | "category"
  | "subCategory"
  | "locationName"
  | "transactionType"
  | "homeIso"
  | "attributes"
  | "imageUrls"
  | "imageUrl"
  | "urlSlug"
  | "lat"
  | "lng"
  | "description"
  | "isPromoted"
  | "viewsCount"
  | "inquiryCount"
  | "ownerPhone"
  | "ownerUid"
  | "createdAt"
  | "updatedAt"
>;

interface Props {
  listing: ShareListing;
  listingId: string;
  title: string;
  priceLabel: string;
  whatsAppHref: string;
  telHref?: string;
}

function StickyBarInner({
  listing,
  listingId,
  title,
  priceLabel,
  whatsAppHref,
  telHref,
  variant,
}: Props & { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={
        isMobile
          ? "fixed inset-x-0 top-14 z-40 flex border-b border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 py-2 shadow-sm backdrop-blur-md sm:hidden"
          : "fixed inset-x-0 top-14 z-40 hidden border-b border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 py-2.5 shadow-sm backdrop-blur-md sm:flex"
      }
    >
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--brand-navy)]">{title}</p>
          <p
            className={`font-serif leading-none text-[var(--brand-orange)] ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            {priceLabel}
          </p>
        </div>
        <ListingSaveButton listingId={listingId} size="sm" />
        <ListingShareBar listing={listing} iconOnly />
        {!isMobile && telHref ? (
          <a
            href={telHref}
            onClick={() => {
              trackLeadStarted(listingId, "call", "sticky_bar");
              trackLeadSubmitted(listingId, "call", "sticky_bar");
            }}
            className="rp-btn rp-btn-secondary shrink-0 px-3 py-2 text-sm"
          >
            Call
          </a>
        ) : null}
        {!isMobile && whatsAppHref ? (
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackLeadStarted(listingId, "whatsapp", "sticky_bar");
              trackLeadSubmitted(listingId, "whatsapp", "sticky_bar");
            }}
            className="rp-btn shrink-0 bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-none hover:brightness-105"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function ListingStickyBar(props: Props) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const el = document.getElementById(SENTINEL_ID);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!pinned) return null;

  return (
    <>
      <StickyBarInner {...props} variant="mobile" />
      <StickyBarInner {...props} variant="desktop" />
    </>
  );
}

/** Place directly after the main listing summary card. */
export function ListingDetailScrollSentinel() {
  return <div id={SENTINEL_ID} className="h-px w-full" aria-hidden />;
}
