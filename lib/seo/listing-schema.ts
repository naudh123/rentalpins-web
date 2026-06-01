import { listingCanonicalUrl } from "@/lib/listing-share";
import type { ListingDetail } from "@/lib/types/listing";
import { currencyForIso } from "@/lib/phone-iso";

/** JSON-LD for listing detail — RealEstateListing / Residence / Apartment by sub-category. */
export function buildListingStructuredData(
  listing: ListingDetail,
  listingId: string
): Record<string, unknown> {
  const url = listingCanonicalUrl(listingId);
  const sub = (listing.subCategory || "").toLowerCase();
  let type = "RealEstateListing";
  if (sub.includes("flat") || sub.includes("apartment") || sub.includes("room")) {
    type = "Apartment";
  } else if (sub.includes("house") || sub.includes("villa") || sub.includes("pg")) {
    type = "Residence";
  } else if (listing.category === "Vehicles") {
    type = "Product";
  }

  const currency = currencyForIso(listing.homeIso || "IN");

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: listing.title,
    description: listing.description?.slice(0, 500) || listing.title,
    url,
    image: listing.imageUrl || undefined,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
    geo:
      listing.lat != null && listing.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: listing.lat,
            longitude: listing.lng,
          }
        : undefined,
    address: listing.locationName
      ? {
          "@type": "PostalAddress",
          streetAddress: listing.locationName,
        }
      : undefined,
  };
}
