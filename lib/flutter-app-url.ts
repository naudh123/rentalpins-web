import {
  GA4_EMBED_PARENT_QUERY,
  GA4_FLUTTER_EMBED_QUERY,
} from "./ga4-embed-contract";

/**
 * Flutter web app URLs (top-level handoff or iframe embed).
 * Bump [FLUTTER_EMBED_VERSION] when you ship a new `flutter build web` (keep in line with app `pubspec.yaml`).
 * Override at build time with `NEXT_PUBLIC_FLUTTER_EMBED_VERSION` if needed.
 */
export const FLUTTER_APP_ORIGIN = "https://app.rentalpins.com";
/** Sync with rentit_clean pubspec version (marketing cache-bust for iframe src). */
export const FLUTTER_EMBED_VERSION = "1.1.2";

export function withFlutterEmbedCacheBust(url: string): string {
  const v =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_FLUTTER_EMBED_VERSION?.trim()) ||
    FLUTTER_EMBED_VERSION;
  if (!v) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(v)}`;
}

export type FlutterAppUrlOptions = {
  listingId?: string | null;
  /** When true, adds embed=1 + embed_parent for iframe + GA4 parent relay (Flutter GA4_WEB_PARENT_ONLY). */
  asIframeEmbed?: boolean;
  extraParams?: Record<string, string>;
};

/** Handoff or iframe URL to app.rentalpins.com with standard query params. */
export function buildFlutterAppUrl(options: FlutterAppUrlOptions = {}): string {
  const params = new URLSearchParams({ web: "1", skipSplash: "1" });
  if (options.listingId) params.set("listing", options.listingId);
  if (options.asIframeEmbed) {
    params.set(GA4_FLUTTER_EMBED_QUERY, "1");
    if (typeof window !== "undefined" && window.location?.origin) {
      params.set(GA4_EMBED_PARENT_QUERY, window.location.origin);
    }
  }
  if (options.extraParams) {
    for (const [k, v] of Object.entries(options.extraParams)) {
      if (v) params.set(k, v);
    }
  }
  return withFlutterEmbedCacheBust(`${FLUTTER_APP_ORIGIN}/?${params.toString()}`);
}
