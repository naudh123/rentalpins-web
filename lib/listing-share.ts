import type { Metadata } from "next";
import type { ListingDetail } from "@/lib/types/listing";
import { appPath, publicSiteUrl } from "@/lib/config";
import { listingCanonicalAbsoluteUrl } from "@/lib/listing-canonical";
import { normalizeListingSeo } from "@/lib/seo/listing-seo";
import type { ListingSlugInput } from "@/lib/listing-slug";
import { LISTING_OG_WIDTH, LISTING_OG_HEIGHT } from "@/lib/listing-share-constants";

export { LISTING_OG_WIDTH, LISTING_OG_HEIGHT };

/** Absolute canonical listing URL — full SEO slug when listing object is provided. */
export function listingCanonicalUrl(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") {
    return `${publicSiteUrl()}${appPath(`/listings/${listingOrId}`)}`;
  }
  return listingCanonicalAbsoluteUrl(listingOrId);
}

/** Path to dynamic OG image — served from legacy /listings route (stable image generation). */
export function listingOgImagePath(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") {
    return `${appPath(`/listings/${listingOrId}`)}/opengraph-image`;
  }
  const id = listingOrId.id;
  const legacySlug =
    "imageUrls" in listingOrId && listingOrId.urlSlug
      ? listingOrId.urlSlug
      : id;
  return `${appPath(`/listings/${legacySlug}`)}/opengraph-image`;
}

export function listingShareDescription(listing: ListingDetail): string {
  const seo = normalizeListingSeo(listing);
  return seo.seoDescription;
}

export function listingShareMetadata(listing: ListingDetail): Metadata {
  const seo = normalizeListingSeo(listing);
  const canonical = seo.canonicalAbsoluteUrl;
  const title = seo.seoTitle;
  const description = seo.seoDescription;
  const ogImage = listingOgImagePath(listing);

  return {
    title,
    description,
    keywords: seo.seoKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | RentalPins`,
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
      title: `${title} | RentalPins`,
      description,
      images: [ogImage],
    },
  };
}

export function listingInactiveMetadata(listing: ListingDetail): Metadata {
  const seo = normalizeListingSeo(listing);
  return {
    ...listingShareMetadata(listing),
    robots: { index: false, follow: true },
    alternates: { canonical: seo.canonicalAbsoluteUrl },
  };
}
