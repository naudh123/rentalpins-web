import { resolveListingPlaceLabel } from "@/lib/listing-slug-location";

/** Firebase document id (no hyphens — slug separator). */
export const FIREBASE_LISTING_ID_RE = /^[a-zA-Z0-9_]{15,28}$/;

const MAX_SLUG_CHARS = 72;
const TITLE_SLUG_MAX = 48;

export interface ListingSlugInput {
  id: string;
  title: string;
  locationName?: string;
  lat: number;
  lng: number;
  subCategory?: string;
  category?: string;
  attributes?: { bhk?: string };
  searchableTitle?: string;
  /** Persisted on activation — stable public URL segment. */
  urlSlug?: string;
  transactionType?: import("@/lib/transaction-type").TransactionType;
}

/** Lowercase ASCII slug segment (no id suffix). */
export function generateSeoSlug(text: string, maxLen = TITLE_SLUG_MAX): string {
  const normalized = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/[\s_-]+/g, " ")
    .trim();

  const hyphenated = normalized.replace(/\s+/g, "-").replace(/-+/g, "-");
  if (hyphenated.length <= maxLen) return hyphenated;
  return hyphenated.slice(0, maxLen).replace(/-+$/g, "");
}

const TITLE_NOISE_RE =
  /\b(owner\s*free|no\s*broker(?:age)?|direct\s*owner|call\s*now|whatsapp|contact)\b/gi;

function cleanTitleForSlug(title: string): string {
  return title
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, " ")
    .replace(/\|/g, " ")
    .replace(TITLE_NOISE_RE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildTitleSlugPart(listing: ListingSlugInput): string {
  const raw =
    listing.searchableTitle?.trim() ||
    listing.title?.trim() ||
    listing.subCategory?.trim() ||
    listing.category?.trim() ||
    "rental";

  let base = cleanTitleForSlug(raw);
  if (listing.attributes?.bhk && !/bhk/i.test(base)) {
    base = `${listing.attributes.bhk} ${base}`;
  }

  const slug = generateSeoSlug(base);
  if (slug) return slug;

  if (listing.subCategory) {
    return generateSeoSlug(listing.subCategory);
  }
  return "rental";
}

/** Path segment after `/listings/` — `{title-slug}-in-{place}-{id}`. */
export function buildListingSlugSegment(listing: ListingSlugInput): string {
  const stored = listing.urlSlug?.trim();
  if (stored) return stored;

  const titlePart = buildTitleSlugPart(listing);
  const place = resolveListingPlaceLabel({
    lat: listing.lat,
    lng: listing.lng,
    locationName: listing.locationName,
  });
  const placePart = place ? generateSeoSlug(place, 24) : "";

  let combined = placePart
    ? `${titlePart}-in-${placePart}`
    : titlePart;
  combined = combined.replace(/-+/g, "-").replace(/^-|-$/g, "");

  if (combined.length > MAX_SLUG_CHARS) {
    combined = combined.slice(0, MAX_SLUG_CHARS).replace(/-+$/g, "");
  }

  return `${combined}-${listing.id}`;
}

export function extractListingIdFromSlugParam(param: string): string | null {
  const decoded = decodeURIComponent(param).trim();
  if (!decoded) return null;
  if (FIREBASE_LISTING_ID_RE.test(decoded)) return decoded;

  const lastHyphen = decoded.lastIndexOf("-");
  if (lastHyphen <= 0) return null;

  const candidate = decoded.slice(lastHyphen + 1);
  if (FIREBASE_LISTING_ID_RE.test(candidate)) return candidate;
  return null;
}

export function listingSlugMatchesListing(
  param: string,
  listing: ListingSlugInput
): boolean {
  const id = extractListingIdFromSlugParam(param);
  if (!id || id !== listing.id) return false;
  return param === listing.id || param === buildListingSlugSegment(listing);
}
