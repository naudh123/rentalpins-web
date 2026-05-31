"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { canCollectGa4, isGa4ScriptEnabledOnBuild } from "@/lib/analytics-guard";
import { gaMeasurementId } from "@/lib/config";
import { applyConsentToGtag, readConsent, writeConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/ga4";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const [consentState, setConsentState] = useState<
    "granted" | "denied" | null
  >(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  // Initialise consent state once on mount
  useEffect(() => {
    const stored = readConsent();
    setConsentState(stored);
    if (stored === null) {
      setBannerVisible(true);
    } else {
      applyConsentToGtag(stored);
    }
  }, []);

  // SPA pageview — fires on every route change when analytics allowed
  useEffect(() => {
    if (!gaMeasurementId) return;
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    if (!canCollectGa4()) return;

    trackEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  function acceptConsent() {
    writeConsent("granted");
    setConsentState("granted");
    applyConsentToGtag("granted");
    setBannerVisible(false);
    // Fire the deferred pageview now
    if (gaMeasurementId) {
      trackEvent("page_view", {
        page_path: pathname,
        page_location: window.location.href,
      });
    }
  }

  function denyConsent() {
    writeConsent("denied");
    setConsentState("denied");
    applyConsentToGtag("denied");
    setBannerVisible(false);
  }

  if (!isGa4ScriptEnabledOnBuild()) return null;
  if (!bannerVisible || consentState !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-[7.75rem] z-[60] mx-auto max-w-lg px-4 sm:bottom-4"
    >
      <div className="rp-glass rounded-2xl border border-[var(--border)] p-4 shadow-lg">
        <p className="text-sm text-[var(--text)]">
          We use analytics cookies to improve RentalPins. No ads, no third-party tracking.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={acceptConsent}
            className="rp-btn rp-btn-primary flex-1 py-2.5 text-sm"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={denyConsent}
            className="rp-btn rp-btn-secondary flex-1 py-2.5 text-sm"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
