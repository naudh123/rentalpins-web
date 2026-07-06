import { fetchListingById } from "@/lib/listings";
import { generateListingOgImageResponse } from "@/lib/listing-og-card";
import { extractListingIdFromSlugParam } from "@/lib/listing-slug";

export const runtime = "nodejs";
export const alt = "Sale listing preview on RentalPins Buy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PropertyBuyOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const listingId = extractListingIdFromSlugParam(slug);
  const listing = listingId ? await fetchListingById(listingId) : null;
  return generateListingOgImageResponse(listing);
}
