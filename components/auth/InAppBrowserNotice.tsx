"use client";

import { useEffect, useState } from "react";
import {
  detectInAppBrowser,
  externalBrowserUrl,
  type InAppBrowserInfo,
} from "@/lib/in-app-browser";
import { trackEvent } from "@/lib/ga4";

interface Props {
  context?: "login" | "search" | "general";
  /** Compact bar for map / ad landing pages */
  variant?: "card" | "compact";
}

export default function InAppBrowserNotice({
  context = "general",
  variant = "card",
}: Props) {
  const [info, setInfo] = useState<InAppBrowserInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const detected = detectInAppBrowser();
    if (!detected.inApp) return;
    setInfo(detected);
    trackEvent("in_app_browser_detected", {
      browser_kind: detected.kind || "unknown",
      page_context: context,
    });
  }, [context]);

  if (!info?.inApp || dismissed) return null;

  const url = externalBrowserUrl();

  function handleOpenExternal() {
    trackEvent("in_app_browser_open_external_clicked", {
      browser_kind: info?.kind || "unknown",
      page_context: context,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (variant === "compact") {
    return (
      <div
        className="pointer-events-auto absolute left-2 right-2 top-2 z-[60] flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-2 text-xs text-amber-950 shadow-md backdrop-blur-sm md:left-4 md:right-auto md:max-w-lg"
        role="status"
      >
        <span className="min-w-0 flex-1 leading-snug">
          Open in <strong>Chrome</strong> or <strong>Safari</strong> to sign in or post (OTP fails
          in {info.label}).
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleOpenExternal}
            className="rounded-lg bg-[var(--brand-orange)] px-3 py-1.5 text-xs font-semibold text-white"
          >
            Open browser
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="px-1 text-amber-900/80"
            aria-label="Dismiss"
          >
            ×
          </button>
        </span>
      </div>
    );
  }

  return (
    <div
      className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950"
      role="status"
    >
      <p className="font-semibold">Opened from {info.label}?</p>
      <p className="mt-1 leading-relaxed">
        Phone OTP often fails inside {info.label}&apos;s built-in browser. For sign-in and
        posting, open RentalPins in <strong>Chrome</strong> or <strong>Safari</strong>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleOpenExternal}
          className="rp-btn rp-btn-primary px-4 py-2 text-sm"
        >
          Open in browser
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-amber-900 underline-offset-2 hover:underline"
        >
          Continue here
        </button>
      </div>
      <p className="mt-2 text-xs text-amber-800/90">
        Or tap ⋮ / … in {info.label} and choose &quot;Open in browser&quot;.
      </p>
    </div>
  );
}
