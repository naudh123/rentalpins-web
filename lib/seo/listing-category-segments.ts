import type { ListingSlugInput } from "@/lib/listing-slug";
import type { TransactionType } from "@/lib/transaction-type";

/** URL path segment for segmented listing detail pages. */
export type ListingCategorySegment =
  | "property"
  | "equipment"
  | "vehicles"
  | "furniture"
  | "electronics"
  | "appliances";

export const LISTING_CATEGORY_SEGMENTS: readonly ListingCategorySegment[] = [
  "property",
  "equipment",
  "vehicles",
  "furniture",
  "electronics",
  "appliances",
] as const;

const EQUIPMENT_CATEGORIES = new Set([
  "construction equipment",
  "heavy machinery",
]);

const SEGMENT_CATEGORY_MAP: Record<ListingCategorySegment, string[]> = {
  property: ["property"],
  equipment: ["construction equipment", "heavy machinery"],
  vehicles: ["vehicles"],
  furniture: ["furniture"],
  electronics: ["electronics & gadgets"],
  appliances: ["home appliances"],
};

function normalizeCategoryName(category: string): string {
  return category.trim().toLowerCase();
}

/** Resolve the SEO category segment for a listing, or null for fallback `/listings/` URLs. */
export function resolveListingCategorySegment(
  listing: Pick<ListingSlugInput, "category" | "subCategory" | "transactionType">
): ListingCategorySegment | null {
  const main = normalizeCategoryName(listing.category ?? "");

  if (main === "property") return "property";
  if (main === "vehicles") return "vehicles";
  if (main === "furniture") return "furniture";
  if (main === "electronics & gadgets") return "electronics";
  if (main === "home appliances") return "appliances";
  if (EQUIPMENT_CATEGORIES.has(main)) return "equipment";

  return null;
}

export function isListingCategorySegment(value: string): value is ListingCategorySegment {
  return (LISTING_CATEGORY_SEGMENTS as readonly string[]).includes(value);
}

/** Base path prefix for a segmented listing (no slug suffix). */
export function listingSegmentBasePath(
  segment: ListingCategorySegment,
  transactionType: TransactionType = "rent"
): string {
  if (segment === "property" && transactionType === "sale") {
    return "/buy/property";
  }
  return `/rentals/${segment}`;
}

export function segmentMatchesCategory(
  segment: ListingCategorySegment,
  category: string
): boolean {
  const main = normalizeCategoryName(category);
  return SEGMENT_CATEGORY_MAP[segment].includes(main);
}
