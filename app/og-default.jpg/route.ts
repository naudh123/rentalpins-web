import { generateListingOgImageResponse } from "@/lib/listing-og-card";

export const runtime = "nodejs";

/** Default link-preview image when a listing has no cover photo. */
export async function GET() {
  return generateListingOgImageResponse(null);
}
