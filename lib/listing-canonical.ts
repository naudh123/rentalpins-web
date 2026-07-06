import {
  buildSeoSlugSegment,
  normalizeListingSeo,
} from "@/lib/seo/listing-seo";
import {
  buildListingSlugSegment,
  type ListingSlugInput,
} from "@/lib/listing-slug";
import { listingToSlugInput } from "@/lib/listing-path";
import type { ListingDetail } from "@/lib/types/listing";

/** Query params stripped from listing canonical URLs (tracking / navigation noise). */
export const LISTING_SEO_STRIP_PARAMS = [
  "from",
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

/** @deprecated Listing return paths use sessionStorage — never append ?from= to URLs. */
export const LISTING_NAV_QUERY_KEYS = [] as const;

export function listingCanonicalSegment(
  listing: ListingSlugInput | ListingDetail
): string {
  const input =
    "imageUrls" in listing ? listingToSlugInput(listing) : listing;
  return buildSeoSlugSegment(input);
}

/** Relative listing detail path — segmented by category (property, equipment, etc.). */
export function listingDetailBasePathForListing(
  listing: ListingSlugInput | ListingDetail
): string {
  return normalizeListingSeo(listing).canonicalPath;
}

/** True when the URL segment should 308 to the canonical SEO slug (wrong slug or ID-only). */
export function listingSlugNeedsRedirect(
  slugParam: string,
  listing: ListingSlugInput | ListingDetail
): boolean {
  const canonical = listingCanonicalSegment(listing);
  if (slugParam === canonical) return false;
  const input =
    "imageUrls" in listing ? listingToSlugInput(listing) : listing;
  if (slugParam === buildListingSlugSegment(input)) return true;
  if (slugParam === input.id) return true;
  return slugParam !== canonical;
}

/** Relative path — no query string. */
export function listingCanonicalRelPath(
  listing: ListingSlugInput | ListingDetail
): string {
  return listingDetailBasePathForListing(listing);
}

/** Absolute canonical listing URL for metadata & JSON-LD. */
export function listingCanonicalAbsoluteUrl(
  listing: ListingSlugInput | ListingDetail
): string {
  return normalizeListingSeo(listing).canonicalAbsoluteUrl;
}

/** Re-export centralized canonical URL builder. */
export { buildListingCanonicalUrl, buildListingCanonicalPath } from "@/lib/seo/listing-seo";

/** Legacy slug segment (title-in-place-id) — for redirects from old stored slugs. */
export function legacyListingSlugSegment(
  listing: ListingSlugInput | ListingDetail
): string {
  const input =
    "imageUrls" in listing ? listingToSlugInput(listing) : listing;
  return buildListingSlugSegment(input);
}

/** @deprecated Return paths are stored client-side; redirects must not preserve ?from=. */
export function buildListingNavigationQuery(
  _searchParams: Record<string, string | string[] | undefined>
): string {
  return "";
}

export function listingPathNeedsSeoQueryCleanup(searchParams: URLSearchParams): boolean {
  for (const key of LISTING_SEO_STRIP_PARAMS) {
    if (searchParams.has(key)) return true;
  }
  return searchParams.toString().length > 0;
}

export function cleanedListingSearchParams(
  _searchParams: URLSearchParams
): URLSearchParams {
  return new URLSearchParams();
}
