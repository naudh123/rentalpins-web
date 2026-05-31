"use client";

import { isGa4ScriptEnabledOnBuild } from "@/lib/analytics-config";
import { readConsent } from "@/lib/consent";

export {
  GA4_COLLECT_ENDPOINT,
  ga4TagLoaderUrl,
  isGa4ScriptEnabledOnBuild,
} from "@/lib/analytics-config";

/** User accepted analytics cookies (localStorage `rp_analytics_consent`). */
export function isAnalyticsConsentGranted(): boolean {
  return readConsent() === "granted";
}

/** True when events/pageviews are actually sent to GA4 servers. */
export function canCollectGa4(): boolean {
  if (typeof window === "undefined") return false;
  if (!isGa4ScriptEnabledOnBuild()) return false;
  if (!window.gtag) return false;
  return isAnalyticsConsentGranted();
}

export function ga4DebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      sessionStorage.getItem("rp_ga_debug") === "1" ||
      new URLSearchParams(window.location.search).has("ga_debug")
    );
  } catch {
    return false;
  }
}
