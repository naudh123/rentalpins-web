"use client";

import { useEffect } from "react";
import { trackSeoCtaClick } from "@/lib/ga4";

/** Delegated click tracking for SEO CTAs using data-cta attributes. */
export default function SeoCtaTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cta]"
      );
      if (!target) return;

      trackSeoCtaClick({
        cta: target.dataset.cta ?? "unknown",
        location: target.dataset.ctaLocation ?? target.dataset.cta ?? "",
        city: target.dataset.city,
        area: target.dataset.area,
        intent: target.dataset.intent,
        href: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
