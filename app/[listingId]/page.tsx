import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { fetchListingById } from "@/lib/listings";
import { appPath } from "@/lib/config";
import {
  listingCanonicalUrl,
  listingOgImagePath,
  listingShareDescription,
} from "@/lib/listing-share";
import { listingPublicPathFromCard } from "@/lib/listing-path";
import { buildListingNavigationQuery } from "@/lib/listing-canonical";

interface Props {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingId } = await params;
  const listing = await fetchListingById(listingId);
  const canonical = listing
    ? listingCanonicalUrl(listing)
    : listingCanonicalUrl(listingId);

  if (!listing) {
    return {
      title: "Listing details",
      description: "Rental listing on RentalPins.",
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  const title = listing.title;
  const description = listingShareDescription(listing);
  const ogImage = listingOgImagePath(listing);

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "RentalPins",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Preserve production URL shape /{listingId} → canonical SEO slug detail. */
export default async function LegacyListingPage({ params, searchParams }: Props) {
  const { listingId } = await params;
  const listing = await fetchListingById(listingId);
  if (!listing) notFound();

  const sp = await searchParams;
  const suffix = buildListingNavigationQuery(sp);
  permanentRedirect(appPath(`${listingPublicPathFromCard(listing)}${suffix}`));
}
