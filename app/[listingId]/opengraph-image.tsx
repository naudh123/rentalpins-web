import { fetchListingById } from "@/lib/listings";
import { generateListingOgImageResponse } from "@/lib/listing-og-card";

export const runtime = "nodejs";
export const alt = "Rental listing preview on RentalPins";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ listingId: string }>;
}

/** OG for legacy /{listingId} links (same card as /listings/{id}). */
export default async function LegacyListingOpenGraphImage({ params }: Props) {
  const { listingId } = await params;
  const listing = await fetchListingById(listingId);
  return generateListingOgImageResponse(listing);
}
