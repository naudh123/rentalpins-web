"use client";

import { gaMeasurementId } from "./config";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "consent" | "set",
      target: string,
      params?: GtagParams | Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  name: string,
  params?: GtagParams
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

export function trackSearchInitiated(queryType: string, location?: string): void {
  trackEvent("search_initiated", { query_type: queryType, location });
}

export function trackListingClick(
  listingId: string,
  source: "map" | "list"
): void {
  trackEvent(source === "map" ? "listing_pin_clicked" : "listing_card_clicked", {
    listing_id: listingId,
  });
}

export function trackLeadStarted(
  listingId: string,
  mode: string,
  placement?: string
): void {
  trackEvent("contact_owner_started", {
    listing_id: listingId,
    contact_mode: mode,
    ...(placement ? { lead_placement: placement } : {}),
  });
}

export function trackLeadSubmitted(
  listingId: string,
  mode: string,
  placement?: string
): void {
  trackEvent("lead_submitted", {
    listing_id: listingId,
    contact_mode: mode,
    ...(placement ? { lead_placement: placement } : {}),
  });
}

export function trackSearchAlertCreated(
  searchId: string,
  category?: string
): void {
  trackEvent("search_alert_created", {
    search_id: searchId,
    category: category ?? "All",
  });
}

export function trackMapViewportChanged(input: {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom: number;
}): void {
  trackEvent("map_viewport_changed", {
    north: Number(input.north.toFixed(4)),
    south: Number(input.south.toFixed(4)),
    east: Number(input.east.toFixed(4)),
    west: Number(input.west.toFixed(4)),
    zoom: Math.round(input.zoom),
  });
}

export function trackListingImpression(
  listingId: string,
  source: "map" | "list"
): void {
  trackEvent("listing_impression", {
    listing_id: listingId,
    source,
  });
}

export function trackListingSaved(listingId: string): void {
  trackEvent("listing_saved", { listing_id: listingId });
}

export function trackListingShared(
  listingId: string,
  method: "native_share" | "clipboard" | "manual_prompt" | "whatsapp_share"
): void {
  trackEvent("listing_shared", { listing_id: listingId, method });
}

export { gaMeasurementId };
