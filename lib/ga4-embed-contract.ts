/**
 * postMessage contract for Flutter web → marketing site GA4 forwarding.
 * Keep in sync with `apps/rentit_clean/lib/core/embed/parent_ga4_forward_web.dart`
 * and [kGa4EmbedParentQuery] in `ga4_parent_config.dart` (embed_parent key).
 */
export const GA4_EMBED_SOURCE = "rentalpins-ga4";
export const GA4_EMBED_TYPE = "ga4_event";

/** Default GA4 web stream; must match Flutter `DefaultFirebaseOptions.web.measurementId`. */
export const GA4_WEB_MEASUREMENT_ID_DEFAULT = "G-VGVQGGL24W" as const;

/** Target origins used by Flutter `parent.postMessage(..., origin)` when `embed_parent` is absent. */
export const GA4_FLUTTER_PARENT_ORIGINS = [
  "https://www.rentalpins.com",
  "https://rentalpins.com",
] as const;

/** Pass on the map iframe URL as `embed_parent` so Flutter relays GA4 only to this origin (no mismatch warnings). */
export const GA4_EMBED_PARENT_QUERY = "embed_parent" as const;

/** Iframe query flag — Flutter skips splash / uses embed gesture mode when set. */
export const GA4_FLUTTER_EMBED_QUERY = "embed" as const;

/**
 * Cross-domain linker: stitch sessions when users move www → app (top-level) or future iframe embed.
 * Must match linker config on app.rentalpins.com (Firebase web / gtag).
 */
export const GA4_LINKER_DOMAINS = [
  "www.rentalpins.com",
  "rentalpins.com",
  "app.rentalpins.com",
] as const;
