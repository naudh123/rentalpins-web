import { appPath } from "@/lib/config";
import { resolveListingPlaceLabel } from "@/lib/listing-slug-location";
import { generateSeoSlug, type ListingSlugInput } from "@/lib/listing-slug";
import type { ListingDetail } from "@/lib/types/listing";
import type { TransactionType } from "@/lib/transaction-type";
import {
  listingSegmentBasePath,
  resolveListingCategorySegment,
  type ListingCategorySegment,
} from "@/lib/seo/listing-category-segments";

export interface ListingSeoFields {
  seoTitle: string;
  seoDescription: string;
  seoSlug: string;
  seoKeywords: string[];
  normalizedCategoryLabel: string;
  normalizedLocationLabel: string;
}

export interface NormalizedListingSeo extends ListingSeoFields {
  categorySegment: ListingCategorySegment | null;
  transactionType: TransactionType;
  transactionLabel: "Rent" | "Sale";
  canonicalPath: string;
  canonicalAbsoluteUrl: string;
}

type ListingSeoInput = ListingSlugInput | ListingDetail;

const EQUIPMENT_KEYWORDS: Record<string, string> = {
  palle: "Scaffolding (Palle)",
  palli: "Scaffolding (Palle)",
  scaffolding: "Scaffolding",
  mixer: "Concrete Mixer",
  jcb: "JCB Excavator",
  excavator: "Excavator",
  crane: "Crane",
};

const PROPERTY_TYPE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b(\d)\s*bhk\b/i, label: "$1 BHK" },
  { re: /\b1\s*rk\b/i, label: "1 RK" },
  { re: /\bpg\b|\bhostel\b|\bpaying\s*guest\b/i, label: "PG" },
  { re: /\bflat\b|\bapartment\b/i, label: "Flat" },
  { re: /\bhouse\b|\bindependent\b/i, label: "House" },
  { re: /\bvilla\b/i, label: "Villa" },
  { re: /\bshop\b|\bshowroom\b/i, label: "Shop" },
  { re: /\boffice\b|\bco-?working\b/i, label: "Office Space" },
  { re: /\bwarehouse\b|\bgodown\b/i, label: "Warehouse" },
  { re: /\bplot\b|\bland\b/i, label: "Plot" },
  { re: /\broom\b/i, label: "Room" },
];

function listingInput(listing: ListingSeoInput): ListingSlugInput {
  if ("imageUrls" in listing) {
    const detail = listing as ListingDetail & {
      searchableTitle?: string;
      urlSlug?: string;
    };
    return {
      id: detail.id,
      title: detail.title,
      locationName: detail.locationName,
      lat: detail.lat,
      lng: detail.lng,
      subCategory: detail.subCategory,
      category: detail.category,
      attributes: detail.attributes,
      searchableTitle: detail.searchableTitle,
      urlSlug: detail.urlSlug,
      transactionType: detail.transactionType,
    };
  }
  return listing;
}

function transactionTypeOf(listing: ListingSeoInput): TransactionType {
  return listing.transactionType === "sale" ? "sale" : "rent";
}

function parseLocalityAndCity(locationName: string, placeLabel: string): {
  locality: string;
  city: string;
} {
  const parts = locationName
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const city = parts[parts.length - 1] ?? placeLabel;
    const locality = parts.slice(0, -1).join(", ") || (parts[0] ?? "");
    return { locality: locality || city, city: city || placeLabel };
  }

  if (placeLabel) {
    return { locality: parts[0] ?? placeLabel, city: placeLabel };
  }

  return { locality: parts[0] ?? "", city: "" };
}

function inferPropertyTypeLabel(listing: ListingSlugInput): string {
  const raw = [
    listing.searchableTitle,
    listing.title,
    listing.subCategory,
    listing.attributes?.bhk,
  ]
    .filter(Boolean)
    .join(" ");

  for (const { re, label } of PROPERTY_TYPE_PATTERNS) {
    const match = raw.match(re);
    if (match) {
      if (label.includes("$1")) {
        return label.replace("$1", match[1] ?? "");
      }
      if (/bhk/i.test(raw) && /flat|apartment/i.test(label)) {
        const bhk = raw.match(/\b(\d)\s*bhk\b/i);
        return bhk ? `${bhk[1]} BHK Flat` : "Flat";
      }
      return label;
    }
  }

  const sub = listing.subCategory?.trim();
  if (sub && sub.toLowerCase() !== "others") return sub;

  return listing.category === "Property" ? "Property" : listing.category || "Rental Item";
}

function inferEquipmentLabel(listing: ListingSlugInput): string {
  const raw = `${listing.title} ${listing.subCategory}`.toLowerCase();
  for (const [key, label] of Object.entries(EQUIPMENT_KEYWORDS)) {
    if (raw.includes(key)) return label;
  }
  const sub = listing.subCategory?.trim();
  if (sub && sub.toLowerCase() !== "others") return sub;
  return "Construction Equipment";
}

function inferItemTypeLabel(
  listing: ListingSlugInput,
  segment: ListingCategorySegment | null
): string {
  if (segment === "property") return inferPropertyTypeLabel(listing);
  if (segment === "equipment") return inferEquipmentLabel(listing);

  const sub = listing.subCategory?.trim();
  if (sub && sub.toLowerCase() !== "others") return sub;

  const category = listing.category?.trim();
  if (category) return category;

  return "Item";
}

function furnishingHint(title: string): string | null {
  if (/\bsemi[\s-]?furnish/i.test(title)) return "Semi-Furnished";
  if (/\bun[\s-]?furnish/i.test(title)) return "Unfurnished";
  if (/\bfurnish/i.test(title)) return "Furnished";
  return null;
}

function buildSeoTitle(
  listing: ListingSlugInput,
  segment: ListingCategorySegment | null,
  transactionLabel: "Rent" | "Sale",
  locality: string,
  city: string
): string {
  let itemType = inferItemTypeLabel(listing, segment);

  if (segment === "property") {
    const furnish = furnishingHint(listing.title ?? "");
    if (furnish && !itemType.toLowerCase().includes(furnish.toLowerCase())) {
      itemType = `${itemType.replace(/\s*flat/i, "")} ${furnish} Flat`.replace(/\s+/g, " ").trim();
      if (!/flat|house|villa|room|pg|shop|office|warehouse|plot/i.test(itemType)) {
        itemType = `${furnish} ${itemType}`;
      }
    }
  }

  const action = transactionLabel === "Sale" ? "Sale" : "Rent";
  const locationPart = [locality, city].filter(Boolean).join(", ");

  if (locationPart) {
    return `${itemType} for ${action} in ${locationPart}`;
  }
  return `${itemType} for ${action}`;
}

function buildSeoDescription(
  listing: ListingSlugInput,
  segment: ListingCategorySegment | null,
  transactionLabel: "Rent" | "Sale",
  locality: string,
  city: string
): string {
  const itemType = inferItemTypeLabel(listing, segment).toLowerCase();
  const action = transactionLabel === "Sale" ? "sale" : "rent";
  const locationPart = [locality, city].filter(Boolean).join(", ");

  if (segment === "equipment") {
    return `Rent ${itemType} in ${locationPart || "your area"} through RentalPins. Compare nearby listings and contact owners directly.`;
  }

  if (locationPart) {
    return `Find ${itemType} for ${action} in ${locationPart} on RentalPins. View price, location, photos, and contact the owner directly.`;
  }

  return `Explore this ${itemType} for ${transactionLabel === "Sale" ? "buy" : "rent"} on RentalPins. View price, location, photos, and contact the owner directly.`;
}

function buildSeoSlugPart(
  listing: ListingSlugInput,
  segment: ListingCategorySegment | null,
  locality: string,
  city: string
): string {
  const itemType = inferItemTypeLabel(listing, segment);
  const furnish = segment === "property" ? furnishingHint(listing.title ?? "") : null;
  const transaction = transactionTypeOf(listing) === "sale" ? "for-sale" : "for-rent";

  const parts = [
    itemType,
    furnish && !itemType.toLowerCase().includes(furnish.toLowerCase()) ? furnish : null,
    segment === "equipment" ? transaction : null,
    locality,
    city,
  ].filter(Boolean) as string[];

  const combined = parts.join(" ");
  const slug = generateSeoSlug(combined, 64);
  return slug || generateSeoSlug(itemType) || "listing";
}

function buildSeoKeywords(
  listing: ListingSlugInput,
  segment: ListingCategorySegment | null,
  locality: string,
  city: string
): string[] {
  const itemType = inferItemTypeLabel(listing, segment);
  const action = transactionTypeOf(listing) === "sale" ? "sale" : "rent";
  const location = [locality, city].filter(Boolean).join(" ");

  const keywords = [
    `${itemType} for ${action}`,
    location ? `${itemType} ${location}` : itemType,
    listing.subCategory,
    listing.category,
    "RentalPins",
    "no broker",
    "owner direct",
  ].filter((k): k is string => Boolean(k?.trim()));

  return [...new Set(keywords.map((k) => k.trim()))];
}

/** Build enhanced SEO slug segment `{slug}-{id}` without overwriting user content. */
export function buildSeoSlugSegment(listing: ListingSeoInput): string {
  const input = listingInput(listing);
  if (input.urlSlug?.trim()) return input.urlSlug.trim();

  const segment = resolveListingCategorySegment(input);
  const placeLabel = resolveListingPlaceLabel({
    lat: input.lat,
    lng: input.lng,
    locationName: input.locationName,
  });
  const { locality, city } = parseLocalityAndCity(input.locationName ?? "", placeLabel);
  const slugPart = buildSeoSlugPart(input, segment, locality, city);

  return `${slugPart}-${input.id}`;
}

/** Normalize listing SEO fields — computed layer, never overwrites user title/description. */
export function normalizeListingSeo(listing: ListingSeoInput): NormalizedListingSeo {
  const input = listingInput(listing);
  const transactionType = transactionTypeOf(input);
  const transactionLabel = transactionType === "sale" ? "Sale" : "Rent";
  const categorySegment = resolveListingCategorySegment(input);

  const placeLabel = resolveListingPlaceLabel({
    lat: input.lat,
    lng: input.lng,
    locationName: input.locationName,
  });
  const { locality, city } = parseLocalityAndCity(input.locationName ?? "", placeLabel);
  const normalizedLocationLabel = [locality, city].filter(Boolean).join(", ");

  const normalizedCategoryLabel =
    input.subCategory?.trim() && input.subCategory.toLowerCase() !== "others"
      ? input.subCategory.trim()
      : input.category?.trim() || "Rental";

  const seoSlug = buildSeoSlugSegment(input);
  const seoTitle = buildSeoTitle(input, categorySegment, transactionLabel, locality, city);
  const seoDescription = buildSeoDescription(
    input,
    categorySegment,
    transactionLabel,
    locality,
    city
  );
  const seoKeywords = buildSeoKeywords(input, categorySegment, locality, city);
  const canonicalPath = buildListingCanonicalPathInternal(
    input,
    seoSlug,
    categorySegment,
    transactionType
  );

  return {
    seoTitle,
    seoDescription,
    seoSlug,
    seoKeywords,
    normalizedCategoryLabel,
    normalizedLocationLabel,
    categorySegment,
    transactionType,
    transactionLabel,
    canonicalPath,
    canonicalAbsoluteUrl: `https://www.rentalpins.com${appPath(canonicalPath)}`,
  };
}

function buildListingCanonicalPathInternal(
  _listing: ListingSlugInput,
  seoSlug: string,
  segment: ListingCategorySegment | null,
  transactionType: TransactionType
): string {
  if (segment) {
    const base = listingSegmentBasePath(segment, transactionType);
    return `${base}/${seoSlug}`;
  }
  return `/listings/${seoSlug}`;
}

/** Central canonical URL builder for listing detail pages. */
export function buildListingCanonicalUrl(listing: ListingSeoInput): string {
  return normalizeListingSeo(listing).canonicalAbsoluteUrl;
}

/** Relative canonical path for a listing. */
export function buildListingCanonicalPath(listing: ListingSeoInput): string {
  return normalizeListingSeo(listing).canonicalPath;
}

/** Metadata title with brand suffix applied by layout template. */
export function listingSeoPageTitle(listing: ListingSeoInput): string {
  return normalizeListingSeo(listing).seoTitle;
}

/** True when the current path is a legacy listing URL that should redirect. */
export function isLegacyListingPath(pathname: string): boolean {
  const decoded = pathname.replace(/\/+$/, "");
  if (/^\/listings\/[^/]+$/.test(decoded)) return true;
  if (/^\/buy\/listings\/[^/]+$/.test(decoded)) return true;
  return false;
}

/** True when pathname matches the canonical SEO path for a listing. */
export function listingPathMatchesCanonical(
  pathname: string,
  listing: ListingSeoInput
): boolean {
  const canonical = buildListingCanonicalPath(listing);
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === appPath(canonical) || normalized === canonical;
}
