import type { Metadata } from "next";
import type { ListingDetail } from "@/lib/types/listing";
import { appPath, publicSiteUrl } from "@/lib/config";
import { formatPrice } from "@/lib/format";

export const LISTING_OG_WIDTH = 1200;
export const LISTING_OG_HEIGHT = 630;

/** Public listing URL — always absolute, www host in production. */
export function listingCanonicalUrl(listingId: string): string {
  return `${publicSiteUrl()}${appPath(`/listings/${listingId}`)}`;
}

/** Path to dynamic OG image (resolved via metadataBase). */
export function listingOgImagePath(listingId: string): string {
  return `${appPath(`/listings/${listingId}`)}/opengraph-image`;
}

export function listingShareDescription(listing: ListingDetail): string {
  const snippet = listing.description.replace(/\s+/g, " ").trim().slice(0, 140);
  const price = formatPrice(listing.price, listing.priceUnit, listing.homeIso);
  const loc = listing.locationName ? ` · ${listing.locationName}` : "";
  if (snippet) return `${snippet}${loc}`;
  return `${listing.title} — ${price}${loc} · Rent on RentalPins`;
}

export function listingShareMetadata(
  listing: ListingDetail,
  listingId: string
): Metadata {
  const canonical = listingCanonicalUrl(listingId);
  const title = listing.title;
  const description = listingShareDescription(listing);
  const ogImage = listingOgImagePath(listingId);

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
