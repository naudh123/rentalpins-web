import { fetchListingById } from "@/lib/listings";
import { generateListingOgImageResponse } from "@/lib/listing-og-card";

export const runtime = "nodejs";
export const alt = "Rental listing preview on RentalPins";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingOpenGraphImage({ params }: Props) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  return generateListingOgImageResponse(listing);
}
