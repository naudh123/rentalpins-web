"use client";

import { useEffect, useRef } from "react";
import MessageOwnerButton from "@/components/listings/MessageOwnerButton";
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
  const contactRow = (placement: "desktop" | "mobile") => (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onWhatsAppClick(placement)}
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
          onClick={() => onCallClick(placement)}
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
        leadPlacement={placement}
        className="flex-1 [&_button]:rp-btn [&_button]:rp-btn-secondary [&_button]:w-full [&_button]:py-3.5"
      />
    </div>
  );

  return (
    <div id="listing-contact" ref={contactRef} className="scroll-mt-24">
      <div className="rp-card mt-4 hidden p-4 sm:block" aria-label="Contact owner">
        <p className="rp-label mb-3">Contact owner</p>
        {contactRow("desktop")}
      </div>

      <div
        className="fixed inset-x-0 bottom-[4.25rem] z-40 border-t border-[var(--border-subtle)] rp-glass p-3 sm:bottom-0 sm:hidden"
        aria-label="Contact owner"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {contactRow("mobile")}
      </div>
      <div className="h-36 sm:hidden" aria-hidden />
    </div>
  );
}
