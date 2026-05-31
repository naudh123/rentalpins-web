"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/ga4";

/** On initial load with a #hash, move focus to the destination section. */
export default function ListingHashFocusRestorer() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace("#", "");
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;
    let timer: number | null = null;

    function tryFocus() {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (target) {
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
        trackEvent("listing_detail_hash_focus_restored", {
          section_id: id,
          attempt_count: attempts + 1,
        });
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) return;
      timer = window.setTimeout(tryFocus, 120);
    }

    // Wait one frame so layout/streamed sections can mount first.
    window.requestAnimationFrame(tryFocus);

    return () => {
      cancelled = true;
      if (timer != null) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return null;
}
