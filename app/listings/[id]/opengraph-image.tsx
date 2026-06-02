import { fetchListingById } from "@/lib/listings";
import { generateListingOgImageResponse } from "@/lib/listing-og-card";
import { extractListingIdFromSlugParam } from "@/lib/listing-slug";

export const runtime = "nodejs";
export const alt = "Rental listing preview on RentalPins";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingOpenGraphImage({ params }: Props) {
  const { id: slugParam } = await params;
  const listingId = extractListingIdFromSlugParam(slugParam);
  const listing = listingId ? await fetchListingById(listingId) : null;
  return generateListingOgImageResponse(listing);
}
