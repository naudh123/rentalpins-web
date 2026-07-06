import type { Metadata } from "next";
import type { ListingDetail } from "@/lib/types/listing";
import { appPath, publicSiteUrl } from "@/lib/config";
import { listingCanonicalAbsoluteUrl } from "@/lib/listing-canonical";
import { listingToSlugInput } from "@/lib/listing-path";
import {
  DEFAULT_LISTING_SHARE_DESCRIPTION,
  DEFAULT_LISTING_SHARE_TITLE,
  listingGeneratedOgImageAbsoluteUrl,
  listingOgImageOpenGraphEntry,
  resolveListingOgImageAbsoluteUrl,
} from "@/lib/listing-og-image";
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

/** Relative path to dynamic OG image on canonical listing route. */
export function listingOgImagePath(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") {
    return `${appPath(`/listings/${listingOrId}`)}/opengraph-image`;
  }
  const seo = normalizeListingSeo(listingOrId);
  return `${appPath(seo.canonicalPath)}/opengraph-image`;
}

/** Absolute OG image URL — cover photo for crawlers, or site default. */
export function listingOgImageAbsoluteUrl(
  listingOrId: string | ListingSlugInput | ListingDetail
): string {
  if (typeof listingOrId === "string") {
    return listingGeneratedOgImageAbsoluteUrl(`/listings/${listingOrId}`);
  }
  if ("imageUrls" in listingOrId) {
    return resolveListingOgImageAbsoluteUrl(listingOrId);
  }
  return listingGeneratedOgImageAbsoluteUrl(
    normalizeListingSeo(listingOrId).canonicalPath
  );
}

export function listingShareDescription(listing: ListingDetail): string {
  const seo = normalizeListingSeo(listing);
  return seo.seoDescription?.trim() || DEFAULT_LISTING_SHARE_DESCRIPTION;
}

export function listingShareMetadata(listing: ListingDetail): Metadata {
  const seo = normalizeListingSeo(listing);
  const canonical = seo.canonicalAbsoluteUrl;
  const title = seo.seoTitle?.trim() || DEFAULT_LISTING_SHARE_TITLE;
  const description =
    seo.seoDescription?.trim() || DEFAULT_LISTING_SHARE_DESCRIPTION;
  const ogImage = listingOgImageOpenGraphEntry(listing);
  const isSale = listing.transactionType === "sale";
  const brandSuffix = isSale ? "RentalPins Buy" : "RentalPins";
  const pageTitle = title.includes("RentalPins") ? title : `${title} | ${brandSuffix}`;

  return {
    title,
    description,
    keywords: seo.seoKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: brandSuffix,
      type: "website",
      locale: "en_IN",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage.url],
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
