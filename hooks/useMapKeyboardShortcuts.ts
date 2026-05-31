"use client";

import { useEffect, useRef, type RefObject } from "react";
import { trackEvent } from "@/lib/ga4";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.tagName === "BUTTON" ||
    el.tagName === "A" ||
    el.getAttribute("role") === "button" ||
    el.isContentEditable
  );
}

interface Options {
  listings: ListingCardData[];
  selectedId: string | null;
  mapSearchInputId: string;
  mapRegionRef: RefObject<HTMLElement | null>;
  onClearSelection: () => void;
  onNavigateListing: (listing: ListingCardData) => void;
  onOpenListing: (listingId: string) => void;
  onFitAll?: () => void;
  onCycleMobileView?: () => void;
  loading: boolean;
}

export function useMapKeyboardShortcuts({
  listings,
  selectedId,
  mapSearchInputId,
  mapRegionRef,
  onClearSelection,
  onNavigateListing,
  onOpenListing,
  onFitAll,
  onCycleMobileView,
  loading,
}: Options): void {
  const trackedRef = useRef(new Set<string>());

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      const blockingDialog = document.querySelector(
        "[role='dialog']:not(#map-listing-preview)"
      );
      if (blockingDialog && e.key !== "Escape") return;

      if (e.key === "Escape") {
        if (document.getElementById("map-listing-preview")) return;
        if (!selectedId) return;
        e.preventDefault();
        if (!trackedRef.current.has("escape_clear_selection")) {
          trackedRef.current.add("escape_clear_selection");
          trackEvent("map_keyboard_shortcut_used", {
            key: "escape",
            action: "clear_selection",
          });
        }
        onClearSelection();
        return;
      }

      if (e.key === "Enter") {
        const targetId = selectedId ?? listings[0]?.id;
        if (!targetId) return;
        e.preventDefault();
        if (!trackedRef.current.has("enter_open")) {
          trackedRef.current.add("enter_open");
          trackEvent("map_keyboard_shortcut_used", { key: "enter", action: "open_listing" });
        }
        onOpenListing(targetId);
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!listings.length) return;
        e.preventDefault();
        if (!trackedRef.current.has("arrow_navigate")) {
          trackedRef.current.add("arrow_navigate");
          trackEvent("map_keyboard_shortcut_used", { key: "arrows", action: "navigate_listings" });
        }
        const idx = selectedId ? listings.findIndex((l) => l.id === selectedId) : -1;
        const nextIdx =
          e.key === "ArrowDown"
            ? idx < 0
              ? 0
              : Math.min(idx + 1, listings.length - 1)
            : idx < 0
              ? 0
              : Math.max(idx - 1, 0);
        const next = listings[nextIdx];
        if (next && next.id !== selectedId) onNavigateListing(next);
        return;
      }

      if (e.key === "m" || e.key === "M") {
        if (document.querySelector("[role='dialog']")) return;
        const region = mapRegionRef.current;
        if (!region) return;
        e.preventDefault();
        if (!trackedRef.current.has("m_focus_map")) {
          trackedRef.current.add("m_focus_map");
          trackEvent("map_keyboard_shortcut_used", { key: "m", action: "focus_map" });
        }
        region.focus();
        return;
      }

      if ((e.key === "f" || e.key === "F") && onFitAll && listings.length >= 2) {
        if (blockingDialog) return;
        e.preventDefault();
        if (!trackedRef.current.has("f_fit_all")) {
          trackedRef.current.add("f_fit_all");
          trackEvent("map_keyboard_shortcut_used", { key: "f", action: "fit_all" });
        }
        onFitAll();
        return;
      }

      if ((e.key === "l" || e.key === "L") && onCycleMobileView) {
        if (blockingDialog) return;
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        e.preventDefault();
        if (!trackedRef.current.has("l_mobile_view")) {
          trackedRef.current.add("l_mobile_view");
          trackEvent("map_keyboard_shortcut_used", { key: "l", action: "cycle_mobile_view" });
        }
        onCycleMobileView();
        return;
      }

      if (e.key === "/") {
        if (blockingDialog) return;
        const input = document.getElementById(mapSearchInputId) as HTMLInputElement | null;
        if (!input || input.disabled || loading) return;
        e.preventDefault();
        if (!trackedRef.current.has("slash_focus")) {
          trackedRef.current.add("slash_focus");
          trackEvent("map_keyboard_shortcut_used", { key: "/", action: "focus_search" });
        }
        input.focus();
        input.select();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    listings,
    loading,
    mapRegionRef,
    mapSearchInputId,
    onClearSelection,
    onNavigateListing,
    onOpenListing,
    onFitAll,
    onCycleMobileView,
    listings.length,
    selectedId,
  ]);
}

/** map → peek → list → map */
export function nextMapMobileView(view: MapMobileView): MapMobileView {
  if (view === "map") return "peek";
  if (view === "peek") return "list";
  return "map";
}
