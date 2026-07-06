import type { SeoListingCard } from "@/lib/seo-listings";
import type { RentalCategoryConfig } from "@/lib/seo/categories";

/** Strict category match for programmatic SEO hubs — never show cross-category listings. */
export function listingMatchesRentalCategory(
  listing: SeoListingCard,
  category: RentalCategoryConfig
): boolean {
  if (listing.category !== category.mainCategory) return false;
  if (category.subCategories.length === 0) return true;

  const sub = (listing.subCategory ?? "").trim();
  if (!sub) return false;

  const subLower = sub.toLowerCase();
  return category.subCategories.some((canonical) => {
    const c = canonical.toLowerCase();
    return subLower === c || subLower.includes(c) || c.includes(subLower);
  });
}

export function filterListingsForRentalCategory(
  listings: SeoListingCard[],
  category: RentalCategoryConfig
): SeoListingCard[] {
  return listings.filter((l) => listingMatchesRentalCategory(l, category));
}
