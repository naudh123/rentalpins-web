"use client";

import { useEffect, useRef } from "react";
import MessageOwnerButton from "@/components/listings/MessageOwnerButton";
import { MOBILE_BOTTOM_NAV_HEIGHT } from "@/lib/config";
import { trackEvent, trackLeadStarted, trackLeadSubmitted } from "@/lib/ga4";
import { listingWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";

interface Props {
  listingId: string;
  title: string;
  ownerPhone: string;
  ownerUid: string;
  listingImage: string;
  listingUrl: string;
}

const mobileBtn =
  "flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-2 py-2.5 text-xs font-semibold leading-tight sm:text-sm";

export default function ListingActions({
  listingId,
  title,
  ownerPhone,
  ownerUid,
  listingImage,
  listingUrl,
}: Props) {
  const contactRef = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);

  const wa = ownerPhone
    ? whatsappUrl(ownerPhone, listingWhatsAppMessage(title, listingUrl))
    : "";

  const telHref = ownerPhone ? `tel:${ownerPhone.replace(/\s/g, "")}` : "";

  useEffect(() => {
    const el = contactRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || trackedRef.current) return;
        trackedRef.current = true;
        trackEvent("listing_contact_section_viewed", { listing_id: listingId });
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [listingId]);

  function onWhatsAppClick(placement: "desktop" | "mobile") {
    trackLeadStarted(listingId, "whatsapp", placement);
    trackLeadSubmitted(listingId, "whatsapp", placement);
  }

  function onCallClick(placement: "desktop" | "mobile") {
    trackLeadStarted(listingId, "call", placement);
    trackLeadSubmitted(listingId, "call", placement);
  }

  const hasChatFallback = Boolean(ownerUid);
  const mobileBottom = `calc(${MOBILE_BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`;

  const desktopContact = (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onWhatsAppClick("desktop")}
          className="rp-btn flex flex-1 items-center justify-center bg-[#25D366] py-3.5 font-medium text-white shadow-none hover:brightness-105"
        >
          WhatsApp
        </a>
      ) : hasChatFallback ? (
        <p className="flex-1 text-center text-sm text-[var(--muted)]">
          Phone not listed — message the owner below.
        </p>
      ) : (
        <p className="flex-1 text-center text-sm text-[var(--muted)]">
          Owner contact not available.
        </p>
      )}
      {telHref && (
        <a
          href={telHref}
          onClick={() => onCallClick("desktop")}
          className="rp-btn rp-btn-secondary flex flex-1 py-3.5"
        >
          Call
        </a>
      )}
      <MessageOwnerButton
        listingId={listingId}
        sellerUid={ownerUid}
        listingTitle={title}
        listingImage={listingImage}
        leadPlacement="desktop"
        className="flex-1 [&_button]:rp-btn [&_button]:rp-btn-secondary [&_button]:w-full [&_button]:py-3.5"
      />
    </div>
  );

  const mobileActions = (
    <div
      className={`grid w-full gap-2 ${
        wa && telHref && hasChatFallback
          ? "grid-cols-3"
          : [wa, telHref, hasChatFallback].filter(Boolean).length === 2
            ? "grid-cols-2"
            : "grid-cols-1"
      }`}
    >
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onWhatsAppClick("mobile")}
          className={`${mobileBtn} bg-[#25D366] text-white shadow-none hover:brightness-105`}
        >
          <span className="truncate">WhatsApp</span>
        </a>
      ) : null}
      {telHref ? (
        <a
          href={telHref}
          onClick={() => onCallClick("mobile")}
          className={`${mobileBtn} rp-btn-secondary border border-[var(--border)] bg-[var(--surface)]`}
        >
          <span className="truncate">Call</span>
        </a>
      ) : null}
      {hasChatFallback ? (
        <MessageOwnerButton
          listingId={listingId}
          sellerUid={ownerUid}
          listingTitle={title}
          listingImage={listingImage}
          leadPlacement="mobile"
          compact
          className="min-w-0 flex-1"
        />
      ) : !wa ? (
        <p className="col-span-full text-center text-xs text-[var(--muted)]">
          Owner contact not available.
        </p>
      ) : null}
    </div>
  );

  return (
    <div id="listing-contact" ref={contactRef} className="scroll-mt-24">
      <div className="rp-card mt-4 hidden p-4 sm:block" aria-label="Contact owner">
        <p className="rp-label mb-3">Contact owner</p>
        {desktopContact}
      </div>

      <div
        className="fixed inset-x-0 z-40 border-t border-[var(--border-subtle)] rp-glass px-3 py-2.5 sm:hidden"
        aria-label="Contact owner"
        style={{ bottom: mobileBottom }}
      >
        <div className="mx-auto w-full max-w-lg">{mobileActions}</div>
      </div>

      <div
        className="sm:hidden"
        style={{
          height: `calc(${MOBILE_BOTTOM_NAV_HEIGHT} + 4.5rem + env(safe-area-inset-bottom, 0px))`,
        }}
        aria-hidden
      />
    </div>
  );
}
