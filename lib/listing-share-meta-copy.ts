import { formatListingPrice } from "@/lib/listing-price";
import { normalizeListingSeo } from "@/lib/seo/listing-seo";
import {
  DEFAULT_LISTING_SHARE_DESCRIPTION,
  DEFAULT_LISTING_SHARE_TITLE,
} from "@/lib/listing-og-image";
import type { ListingDetail } from "@/lib/types/listing";

const MAX_OG_TITLE = 95;
const MAX_OG_DESCRIPTION = 160;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

/** Social / OG title: listing title, price, and location. */
export function listingShareMetaTitle(listing: ListingDetail): string {
  const seo = normalizeListingSeo(listing);
  const base =
    listing.title?.trim() ||
    seo.seoTitle?.trim() ||
    DEFAULT_LISTING_SHARE_TITLE;

  const priceLabel = formatListingPrice({
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    subCategory: listing.subCategory,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso,
  });

  const location =
    listing.locationName?.trim() || seo.normalizedLocationLabel || "";

  const parts = [base];
  if (priceLabel && !/contact/i.test(priceLabel)) parts.push(priceLabel);
  if (location) parts.push(location);

  return truncate(parts.join(" · "), MAX_OG_TITLE);
}

const MAX_SEARCH_TITLE = 62;

/**
 * Search-result <title>: "{type} for Rent in {Locality}, {City} · ₹12,000 per month".
 * Google matches "2 BHK for rent in Sector 70 Mohali" mostly on the title, so the
 * normalized type + place leads; the owner's own wording stays in the H1 and OG.
 * Falls back to the share title when no place can be resolved.
 */
export function listingSearchTitle(listing: ListingDetail): string {
  const seo = normalizeListingSeo(listing);
  if (!seo.normalizedLocationLabel || !seo.seoTitle?.trim()) {
    return listingShareMetaTitle(listing);
  }

  const priceLabel = formatListingPrice({
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    subCategory: listing.subCategory,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso,
  });

  const core = seo.seoTitle.trim();
  const withPrice =
    priceLabel && !/contact/i.test(priceLabel) ? `${core} · ${priceLabel}` : core;
  // Drop the price before truncating the place name.
  if (withPrice.length <= MAX_SEARCH_TITLE) return withPrice;
  return truncate(core, MAX_OG_TITLE);
}

/** Social / meta description: user description when available, else composed fallback. */
export function listingShareMetaDescription(listing: ListingDetail): string {
  const userDesc = listing.description?.trim().replace(/\s+/g, " ");
  if (userDesc && userDesc.length >= 30) {
    return truncate(userDesc, MAX_OG_DESCRIPTION);
  }

  const seo = normalizeListingSeo(listing);
  if (seo.seoDescription?.trim()) {
    return truncate(seo.seoDescription.trim(), MAX_OG_DESCRIPTION);
  }

  const priceLabel = formatListingPrice({
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    subCategory: listing.subCategory,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso,
  });

  const location =
    listing.locationName?.trim() || seo.normalizedLocationLabel || "";
  const mode = listing.transactionType === "sale" ? "for sale" : "for rent";
  const title = listing.title?.trim() || "Rental listing";

  const composed = [
    `${title} ${mode}`,
    priceLabel && !/contact/i.test(priceLabel) ? `at ${priceLabel}` : null,
    location ? `in ${location}` : null,
    "— view photos and contact the owner on RentalPins.",
  ]
    .filter(Boolean)
    .join(" ");

  return truncate(composed, MAX_OG_DESCRIPTION) || DEFAULT_LISTING_SHARE_DESCRIPTION;
}
