import type { Metadata } from "next";
import type { ListingDetail } from "@/lib/types/listing";
import { appPath, publicSiteUrl } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import {
  listingPublicPath,
  listingPublicPathFromCard,
} from "@/lib/listing-path";
import type { ListingSlugInput } from "@/lib/listing-slug";

export const LISTING_OG_WIDTH = 1200;
export const LISTING_OG_HEIGHT = 630;

function listingPath(listing: ListingSlugInput | ListingDetail): string {
  return "imageUrls" in listing
    ? listingPublicPathFromCard(listing)
    : listingPublicPath(listing);
}

/** Public listing URL — absolute, slug path when listing fields are available. */
export function listingCanonicalUrl(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") {
    return `${publicSiteUrl()}${appPath(`/listings/${listingOrId}`)}`;
  }
  return `${publicSiteUrl()}${listingPath(listingOrId)}`;
}

/** Path to dynamic OG image (resolved via metadataBase). */
export function listingOgImagePath(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") {
    return `${appPath(`/listings/${listingOrId}`)}/opengraph-image`;
  }
  return `${listingPath(listingOrId)}/opengraph-image`;
}

export function listingShareDescription(listing: ListingDetail): string {
  const snippet = listing.description.replace(/\s+/g, " ").trim().slice(0, 140);
  const price = formatPrice(listing.price, listing.priceUnit, listing.homeIso);
  const loc = listing.locationName ? ` · ${listing.locationName}` : "";
  if (snippet) return `${snippet}${loc}`;
  return `${listing.title} — ${price}${loc} · Rent on RentalPins`;
}

export function listingShareMetadata(listing: ListingDetail): Metadata {
  const canonical = listingCanonicalUrl(listing);
  const title = listing.title;
  const description = listingShareDescription(listing);
  const ogImage = listingOgImagePath(listing);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "RentalPins",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: LISTING_OG_WIDTH,
          height: LISTING_OG_HEIGHT,
          alt: `${title} on RentalPins`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
