import type { Metadata } from "next";
import type { ListingDetail } from "@/lib/types/listing";
import { appPath, publicSiteUrl } from "@/lib/config";
import { listingCanonicalAbsoluteUrl } from "@/lib/listing-canonical";
import { listingToSlugInput } from "@/lib/listing-path";
import { buildSeoSlugSegment, normalizeListingSeo } from "@/lib/seo/listing-seo";
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

function listingOgSlugSegment(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") return listingOrId;
  if ("imageUrls" in listingOrId) {
    const stored = listingOrId.urlSlug?.trim();
    if (stored) return stored;
    return buildSeoSlugSegment(listingToSlugInput(listingOrId)) || listingOrId.id;
  }
  return buildSeoSlugSegment(listingOrId) || listingOrId.id;
}

/** Relative path to dynamic OG image (stable /listings/… route). */
export function listingOgImagePath(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  const slug = listingOgSlugSegment(listingOrId);
  return `${appPath(`/listings/${slug}`)}/opengraph-image`;
}

/** Absolute OG image URL — required for WhatsApp, iMessage, Slack link previews. */
export function listingOgImageAbsoluteUrl(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  return `${publicSiteUrl()}${listingOgImagePath(listingOrId)}`;
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
  const ogImage = listingOgImageAbsoluteUrl(listing);
  const isSale = listing.transactionType === "sale";

  return {
    title,
    description,
    keywords: seo.seoKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${isSale ? "RentalPins Buy" : "RentalPins"}`,
      description,
      url: canonical,
      siteName: isSale ? "RentalPins Buy" : "RentalPins",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: LISTING_OG_WIDTH,
          height: LISTING_OG_HEIGHT,
          alt: `${title} — ${isSale ? "property for sale" : "rental listing"} on RentalPins`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${isSale ? "RentalPins Buy" : "RentalPins"}`,
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
