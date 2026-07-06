"use client";

import { useEffect, useRef, useState } from "react";
import { trackListingShared } from "@/lib/ga4";
import { buildListingSharePayload } from "@/lib/listing-share-copy";
import type { ListingDetail } from "@/lib/types/listing";
import { whatsappListingShareUrl } from "@/lib/whatsapp";

interface Props {
  listing: Pick<
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
  /** Single icon button — sticky bars, map preview, tight layouts. */
  iconOnly?: boolean;
}

function ShareLinkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

export default function ListingShareBar({ listing, iconOnly = false }: Props) {
  const payload = buildListingSharePayload(listing as ListingDetail);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const copiedResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
    };
  }, []);

  async function shareListing() {
    setError("");
    setBusy(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: payload.nativeShareTitle,
          text: payload.nativeShareText,
          url: payload.url,
        });
        trackListingShared(listing.id, "native_share");
        return;
      }
      await navigator.clipboard.writeText(payload.whatsAppText);
      setCopied(true);
      trackListingShared(listing.id, "clipboard");
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
      copiedResetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (typeof window !== "undefined") {
        window.prompt("Copy this listing link:", payload.whatsAppText);
        trackListingShared(listing.id, "manual_prompt");
        return;
      }
      setError("Share failed");
    } finally {
      setBusy(false);
    }
  }

  const whatsAppShareHref = whatsappListingShareUrl(payload.whatsAppText);

  const shareButton = (
    <button
      type="button"
      onClick={() => void shareListing()}
      disabled={busy}
      aria-busy={busy}
      aria-label={copied ? "Link copied" : "Share listing link"}
      title={copied ? "Link copied" : "Share listing link"}
      className={
        iconOnly
          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--brand-navy)] hover:border-[var(--brand-navy)] disabled:opacity-60"
          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--brand-navy)] transition hover:border-[var(--brand-navy)] disabled:opacity-60"
      }
    >
      {copied ? <span className="text-xs font-bold">✓</span> : <ShareLinkIcon />}
    </button>
  );

  if (iconOnly) {
    return (
      <>
        {shareButton}
        <span className="sr-only" aria-live="polite">
          {busy
            ? "Sharing listing."
            : copied
              ? "Listing link copied with preview text."
              : error
                ? `Share failed. ${error}`
                : ""}
        </span>
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={whatsAppShareHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackListingShared(listing.id, "whatsapp_share")}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
      >
        WhatsApp
      </a>
      {shareButton}
      <span className="sr-only" aria-live="polite">
        {busy
          ? "Sharing listing."
          : copied
            ? "Listing link copied with preview text."
            : error
              ? `Share failed. ${error}`
              : ""}
      </span>
      {error ? (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
