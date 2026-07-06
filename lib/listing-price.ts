import { formatPrice } from "@/lib/format";

/** Minimum plausible monthly rent (INR) before showing compact or schema prices. */
export const PROPERTY_RENT_MIN_THRESHOLD_BY_COUNTRY: Record<string, number> = {
  IN: 3000,
  IND: 3000,
  GB: 150,
  US: 200,
  AE: 500,
  KE: 5000,
  NG: 15000,
};

const PROPERTY_CATEGORIES = new Set([
  "property",
  "pg",
  "hostel",
  "commercial",
  "office",
  "shop",
  "warehouse",
]);

export interface ListingPriceInput {
  price: number;
  priceUnit?: string;
  category?: string;
  subCategory?: string;
  transactionType?: string;
  homeIso?: string;
}

export function isPropertyListing(listing: ListingPriceInput): boolean {
  const cat = (listing.category ?? "").toLowerCase();
  const sub = (listing.subCategory ?? "").toLowerCase();
  if (PROPERTY_CATEGORIES.has(cat)) return true;
  return (
    cat.includes("property") ||
    cat.includes("pg") ||
    sub.includes("flat") ||
    sub.includes("bhk") ||
    sub.includes("apartment") ||
    sub.includes("villa") ||
    sub.includes("room")
  );
}

function isLongTermRentUnit(priceUnit?: string): boolean {
  const unit = (priceUnit ?? "").toLowerCase();
  return (
    unit.includes("month") ||
    unit.includes("year") ||
    unit.includes("week") ||
    unit === "total" ||
    unit === ""
  );
}

export function rentThresholdForIso(homeIso?: string): number {
  const iso = (homeIso ?? "IN").toUpperCase();
  return PROPERTY_RENT_MIN_THRESHOLD_BY_COUNTRY[iso] ?? PROPERTY_RENT_MIN_THRESHOLD_BY_COUNTRY.IN!;
}

/** True when a property rent/sale price is likely bad data — treat as no price in UI/schema. */
export function isSuspiciousPropertyPrice(listing: ListingPriceInput): boolean {
  if (!isPropertyListing(listing)) return false;
  if (listing.price <= 0) return false;

  const isSale = listing.transactionType === "sale";
  if (isSale) {
    const iso = (listing.homeIso ?? "IN").toUpperCase();
    const minSale = iso === "IN" || iso === "IND" ? 100_000 : 5_000;
    return listing.price < minSale;
  }

  if (!isLongTermRentUnit(listing.priceUnit)) return false;

  return listing.price < rentThresholdForIso(listing.homeIso);
}

/** Price for display — suspicious low property prices become 0 (Ask / price on request). */
export function effectiveListingPrice(listing: ListingPriceInput): number {
  if (listing.price <= 0) return 0;
  if (isSuspiciousPropertyPrice(listing)) return 0;
  return listing.price;
}

export interface FormatListingPriceOptions {
  sale?: boolean;
  /** Compact labels for map pins only — never use on listing cards. */
  compact?: boolean;
}

/**
 * Display listing price with property-quality rules.
 * Property rents use full locale formatting (₹13,000/mo), not misleading ₹1.3K/mo.
 */
export function formatListingPrice(
  listing: ListingPriceInput,
  options: FormatListingPriceOptions = {}
): string {
  const price = effectiveListingPrice(listing);
  if (price <= 0) return "Price on request";

  const isProperty = isPropertyListing(listing);

  if (isProperty && !options.compact) {
    return formatPrice(price, listing.priceUnit ?? "per month", listing.homeIso);
  }

  if (options.compact) {
    return formatCompactPrice(price, listing.homeIso, options.sale);
  }

  return formatPrice(price, listing.priceUnit ?? "per month", listing.homeIso);
}

function formatCompactPrice(
  price: number,
  homeIso?: string,
  sale = false
): string {
  const locale = homeIso === "IN" || homeIso === "IND" ? "en-IN" : undefined;
  if (!sale && price < rentThresholdForIso(homeIso)) return "Ask";
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(1)}Cr`;
  if (price >= 100_000) return `₹${Math.round(price / 100_000)}L`;
  if (price >= 10_000) return `₹${Math.round(price / 1000)}k`;
  return price.toLocaleString(locale, { maximumFractionDigits: 0 });
}

/** Price safe for JSON-LD Offer — omits suspicious property values. */
export function schemaOfferPrice(
  listing: ListingPriceInput
): number | undefined {
  if (isSuspiciousPropertyPrice(listing)) return undefined;
  if (listing.price <= 0) return undefined;
  return listing.price;
}
