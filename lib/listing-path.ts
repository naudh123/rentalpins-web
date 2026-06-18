import { appPath } from "@/lib/config";
import {
  buildListingCanonicalPath,
  normalizeListingSeo,
} from "@/lib/seo/listing-seo";
import type { ListingSlugInput } from "@/lib/listing-slug";
import type { ListingCard, ListingDetail } from "@/lib/types/listing";

/** Relative listing detail path — segmented canonical URL. */
export function listingDetailBasePath(listing: ListingSlugInput): string {
  return buildListingCanonicalPath(listing);
}

/** Relative listing detail path with SEO slug (no query string). */
export function listingPublicPath(listing: ListingSlugInput): string {
  return listingDetailBasePath(listing);
}

export function listingToSlugInput(
  listing: Pick<
    ListingCard,
    | "id"
    | "title"
    | "locationName"
    | "lat"
    | "lng"
    | "subCategory"
    | "category"
    | "attributes"
    | "urlSlug"
    | "transactionType"
  > & { searchableTitle?: string }
): ListingSlugInput {
  return {
    id: listing.id,
    title: listing.title,
    locationName: listing.locationName,
    lat: listing.lat,
    lng: listing.lng,
    subCategory: listing.subCategory,
    category: listing.category,
    attributes: listing.attributes,
    searchableTitle: listing.searchableTitle,
    urlSlug: listing.urlSlug,
    transactionType: listing.transactionType,
  };
}

export function listingPublicPathFromCard(
  listing: ListingCard | ListingDetail
): string {
  return listingPublicPath(listingToSlugInput(listing));
}

/** Post-activation / owner links when only activate-page fields are loaded. */
export function listingPublicPathFromActivateListing(listing: {
  id: string;
  title: string;
  locationName?: string;
  lat: number | null;
  lng: number | null;
  category?: string;
  subCategory?: string;
  urlSlug?: string;
}): string {
  return listingPublicPath(
    listingToSlugInput({
      id: listing.id,
      title: listing.title,
      locationName: listing.locationName ?? "",
      lat: listing.lat ?? 0,
      lng: listing.lng ?? 0,
      category: listing.category ?? "",
      subCategory: listing.subCategory ?? "",
      urlSlug: listing.urlSlug,
    })
  );
}
