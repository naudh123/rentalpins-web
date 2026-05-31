"use client";

/**
 * Minimal cookie-consent store.
 * Key: "rp_analytics_consent"
 * Values: "granted" | "denied" | null (undecided)
 *
 * We use localStorage so the choice persists across sessions without a server cookie.
 * On first visit the value is null → GA4 fires in denied/limited mode (no cookies).
 * Once the user clicks Accept we upgrade to "granted" and call gtag consent update.
 */

const STORAGE_KEY = "rp_analytics_consent";

export type ConsentState = "granted" | "denied" | null;

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

export function writeConsent(state: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, state);
}

export function applyConsentToGtag(state: "granted" | "denied"): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: state,
    ad_storage: "denied",
  });
}
