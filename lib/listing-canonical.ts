import { appPath, publicSiteUrl } from "@/lib/config";
import {
  buildListingSlugSegment,
  type ListingSlugInput,
} from "@/lib/listing-slug";
import { listingToSlugInput } from "@/lib/listing-path";
import type { ListingDetail } from "@/lib/types/listing";

/** Query params stripped from listing canonical URLs (tracking / pagination noise). */
export const LISTING_SEO_STRIP_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
  "page",
  "sort",
  "view",
  "selected",
  "_ga",
  "_gl",
] as const;

/** Allowed on listing detail URLs for UX (not part of canonical). */
export const LISTING_NAV_QUERY_KEYS = ["from"] as const;

export function listingCanonicalSegment(
  listing: ListingSlugInput | ListingDetail
): string {
  const input =
    "imageUrls" in listing ? listingToSlugInput(listing) : listing;
  return buildListingSlugSegment(input);
}

/** True when the URL segment should 308 to the canonical SEO slug (wrong slug or ID-only). */
export function listingSlugNeedsRedirect(
  slugParam: string,
  listing: ListingSlugInput | ListingDetail
): boolean {
  return slugParam !== listingCanonicalSegment(listing);
}

/** Relative path `/listings/{slug}` — no query string. */
export function listingCanonicalRelPath(
  listing: ListingSlugInput | ListingDetail
): string {
  return appPath(`/listings/${listingCanonicalSegment(listing)}`);
}

/** Absolute https://www.rentalpins.com/listings/{slug} — canonical for metadata & JSON-LD. */
export function listingCanonicalAbsoluteUrl(
  listing: ListingSlugInput | ListingDetail
): string {
  return `${publicSiteUrl()}${listingCanonicalRelPath(listing)}`;
}

/** Preserve only safe navigation params when redirecting slug variants. */
export function buildListingNavigationQuery(
  searchParams: Record<string, string | string[] | undefined>
): string {
  const from = searchParams.from;
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//")) {
    return "";
  }
  return `?from=${encodeURIComponent(from)}`;
}

export function listingPathNeedsSeoQueryCleanup(searchParams: URLSearchParams): boolean {
  for (const key of LISTING_SEO_STRIP_PARAMS) {
    if (searchParams.has(key)) return true;
  }
  const allowed = new URLSearchParams();
  const from = searchParams.get("from");
  if (from?.startsWith("/") && !from.startsWith("//")) {
    allowed.set("from", from);
  }
  return searchParams.toString() !== allowed.toString();
}

export function cleanedListingSearchParams(
  searchParams: URLSearchParams
): URLSearchParams {
  const allowed = new URLSearchParams();
  const from = searchParams.get("from");
  if (from?.startsWith("/") && !from.startsWith("//")) {
    allowed.set("from", from);
  }
  return allowed;
}
