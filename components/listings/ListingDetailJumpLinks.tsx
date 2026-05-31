"use client";

import { useEffect, useRef, useState } from "react";
import { getRecentlyViewedIds } from "@/lib/recently-viewed";
import { trackEvent } from "@/lib/ga4";

type JumpSection =
  | "reviews"
  | "location"
  | "description"
  | "contact"
  | "owner_rail"
  | "similar_rail"
  | "recently_viewed";

interface LinkDef {
  section: JumpSection;
  label: string;
  hash: string;
}

interface Props {
  listingId: string;
  hasGeo: boolean;
  hasDescription: boolean;
  hasContact: boolean;
  hasOwnerRail?: boolean;
  hasSimilarRail?: boolean;
  /** When set, shows Recent jump link if browser history has other listings. */
  excludeListingId?: string;
}

const BASE_LINKS: LinkDef[] = [
  { section: "reviews", label: "Reviews", hash: "#listing-reviews" },
  { section: "location", label: "Location", hash: "#listing-location" },
  { section: "description", label: "Description", hash: "#listing-description" },
  { section: "contact", label: "Contact", hash: "#listing-contact" },
];

const RAIL_LINKS: LinkDef[] = [
  { section: "recently_viewed", label: "Recent", hash: "#listing-recently-viewed" },
  { section: "owner_rail", label: "Lister", hash: "#listing-owner-rail" },
  { section: "similar_rail", label: "Similar", hash: "#listing-similar-rail" },
];

export default function ListingDetailJumpLinks({
  listingId,
  hasGeo,
  hasDescription,
  hasContact,
  hasOwnerRail = false,
  hasSimilarRail = false,
  excludeListingId,
}: Props) {
  const [hasRecentlyViewed, setHasRecentlyViewed] = useState(false);
  const [trackedShown, setTrackedShown] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const focusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    const filtered = excludeListingId
      ? ids.filter((itemId) => itemId !== excludeListingId)
      : ids;
    setHasRecentlyViewed(filtered.length > 0);
  }, [excludeListingId]);

  const visible: LinkDef[] = [
    ...BASE_LINKS.filter((link) => {
      if (link.section === "location") return hasGeo;
      if (link.section === "description") return hasDescription;
      if (link.section === "contact") return hasContact;
      return true;
    }),
    ...RAIL_LINKS.filter((link) => {
      if (link.section === "owner_rail") return hasOwnerRail;
      if (link.section === "similar_rail") return hasSimilarRail;
      if (link.section === "recently_viewed") return hasRecentlyViewed;
      return false;
    }),
  ];

  useEffect(() => {
    if (trackedShown || visible.length <= 1) return;
    setTrackedShown(true);
    trackEvent("listing_detail_jump_links_shown", {
      listing_id: listingId,
      link_count: visible.length,
      sections: visible.map((link) => link.section).join(","),
    });
  }, [listingId, trackedShown, visible]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncHash = () => setActiveHash(window.location.hash || "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    return () => {
      if (focusTimerRef.current != null) {
        window.clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  if (visible.length <= 1) return null;

  function focusSection(hash: string) {
    if (typeof document === "undefined") return;
    const id = hash.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", hash);
      setActiveHash(hash);
    }
    // Delay focus slightly so screen readers announce the landed section.
    if (focusTimerRef.current != null) {
      window.clearTimeout(focusTimerRef.current);
    }
    focusTimerRef.current = window.setTimeout(() => {
      target.focus({ preventScroll: true });
      focusTimerRef.current = null;
    }, prefersReducedMotion ? 0 : 120);
  }

  return (
    <nav
      className="mt-2 flex flex-wrap items-center gap-3 text-xs"
      aria-label="Jump to listing sections"
    >
      {visible.map((link) => (
        <a
          key={link.section}
          href={link.hash}
          className={`font-semibold text-[var(--brand-orange)] transition-colors hover:underline ${
            activeHash === link.hash
              ? "underline decoration-2 underline-offset-4"
              : "decoration-transparent"
          }`}
          aria-current={activeHash === link.hash ? "location" : undefined}
          onClick={(e) => {
            e.preventDefault();
            focusSection(link.hash);
            trackEvent("listing_detail_section_jump", {
              listing_id: listingId,
              section: link.section,
            });
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
