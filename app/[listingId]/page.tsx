import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchListingById } from "@/lib/listings";
import { appPath, siteUrl } from "@/lib/config";

interface Props {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingId } = await params;
  const listing = await fetchListingById(listingId);

  return {
    title: listing?.title ?? "Listing details",
    description: listing?.description.slice(0, 160) ?? "Rental listing on RentalPins.",
    alternates: {
      canonical: `${siteUrl}${appPath(`/listings/${listingId}`)}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

/** Preserve production URL shape /{listingId} → native listing detail. */
export default async function LegacyListingPage({ params, searchParams }: Props) {
  const { listingId } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") qs.set(key, value);
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  redirect(appPath(`/listings/${listingId}${suffix}`));
}
