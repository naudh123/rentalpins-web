"use client";

import { useEffect } from "react";
import { GA4_EMBED_SOURCE, GA4_EMBED_TYPE } from "@/lib/ga4-embed-contract";
import {
  isCheckoutFrameNoise,
  isTrustedFlutterEmbedOrigin,
  parseEmbedPostMessage,
} from "@/lib/embed-message";
import { flushGa4Queue, sanitizeGa4Params, trackGa4Event } from "@/lib/gtag";
import {
  flushMetaPixelQueue,
  trackListingSubmitted,
  trackSearch,
} from "@/lib/meta-pixel";

/**
 * Single postMessage listener for app.rentalpins.com (iframe or popup).
 * Forwards GA4 (`rentalpins-ga4`) and Meta (`rentalpins-embed`) in one pass — no duplicate listeners.
 */
export default function EmbedPostMessageBridge() {
  useEffect(() => {
    const flushTimer = window.setInterval(() => {
      flushGa4Queue();
      flushMetaPixelQueue();
    }, 1000);

    function onMessage(ev: MessageEvent) {
      if (!isTrustedFlutterEmbedOrigin(ev.origin)) return;

      const d = ev.data;
      if (isCheckoutFrameNoise(d)) return;

      const msg = parseEmbedPostMessage(d);
      if (!msg) return;

      // ── GA4 (Flutter GA4_WEB_PARENT_ONLY / BRIDGE) ─────────────────
      if (msg.source === GA4_EMBED_SOURCE && msg.type === GA4_EMBED_TYPE) {
        const name =
          msg.event_name != null ? String(msg.event_name).trim() : "";
        if (name) {
          trackGa4Event(name, sanitizeGa4Params(msg.params as Record<string, unknown>));
        }
        return;
      }

      // ── Meta Pixel (listing funnel) ──────────────────────────────
      if (msg.source !== "rentalpins-embed") return;

      if (process.env.NODE_ENV === "development") {
        console.log("[EmbedPostMessageBridge]", ev.origin, msg.type ?? msg);
      }

      if (msg.type === "ListingSubmitted") {
        trackListingSubmitted({
          property_type:
            msg.property_type != null ? String(msg.property_type) : "",
          city: msg.city != null ? String(msg.city) : "",
          rent:
            typeof msg.rent === "number"
              ? msg.rent
              : msg.rent != null
                ? String(msg.rent)
                : "",
        });
      }

      if (
        msg.type === "SearchApplied" ||
        msg.type === "FilterApplied" ||
        msg.type === "Search"
      ) {
        const rawSearch =
          msg.search_string ??
          msg.search ??
          msg.query ??
          msg.location ??
          msg.city ??
          "";
        if (rawSearch != null && String(rawSearch).trim().length > 0) {
          trackSearch({ search_string: String(rawSearch) });
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(flushTimer);
    };
  }, []);

  return null;
}
