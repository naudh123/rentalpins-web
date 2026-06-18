import { listingCanonicalUrl } from "@/lib/listing-share";
import type { ListingDetail } from "@/lib/types/listing";
import { currencyForIso } from "@/lib/phone-iso";
import { normalizeListingSeo } from "@/lib/seo/listing-seo";
import type { SeoFaq } from "@/lib/seo/listing-faqs";
import type { ListingBreadcrumbItem } from "@/lib/listing-breadcrumbs";

export interface ListingSchemaInput {
  listing: ListingDetail;
  listingId: string;
  breadcrumbs: ListingBreadcrumbItem[];
  faqs: SeoFaq[];
  reviewSummary?: { avgRating: number; count: number } | null;
}

function resolveSchemaType(listing: ListingDetail): string {
  const segment = normalizeListingSeo(listing).categorySegment;
  if (segment === "property") {
    const sub = (listing.subCategory || "").toLowerCase();
    if (sub.includes("flat") || sub.includes("apartment") || sub.includes("room")) {
      return "Apartment";
    }
    if (sub.includes("house") || sub.includes("villa") || sub.includes("pg")) {
      return "Residence";
    }
    return "RealEstateListing";
  }
  return "Product";
}

function productImages(listing: ListingDetail): string[] | undefined {
  if (listing.imageUrls.length) return listing.imageUrls;
  if (listing.imageUrl) return [listing.imageUrl];
  return undefined;
}

function hasGeo(listing: ListingDetail): boolean {
  return (
    Number.isFinite(listing.lat) &&
    Number.isFinite(listing.lng) &&
    Math.abs(listing.lat) <= 90 &&
    Math.abs(listing.lng) <= 180
  );
}

/** Primary listing JSON-LD — RealEstateListing/Residence/Apartment or Product by category. */
export function buildListingStructuredData(input: ListingSchemaInput): Record<string, unknown> {
  const { listing, listingId, reviewSummary } = input;
  const seo = normalizeListingSeo(listing);
  const url = listingCanonicalUrl(listing);
  const currency = currencyForIso(listing.homeIso || "IN");
  const schemaType = resolveSchemaType(listing);
  const images = productImages(listing);
  const isSale = listing.transactionType === "sale";

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: seo.seoTitle,
    description: seo.seoDescription,
    url,
    image: images,
    category: seo.normalizedCategoryLabel,
    offers: {
      "@type": "Offer",
      price: listing.price > 0 ? listing.price : undefined,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url,
      businessFunction: isSale
        ? "http://purl.org/goodrelations/v1#Sell"
        : "http://purl.org/goodrelations/v1#LeaseOut",
    },
    datePosted: listing.createdAt || undefined,
  };

  if (schemaType === "Product") {
    base.sku = listingId;
  }

  if (hasGeo(listing)) {
    base.geo = {
      "@type": "GeoCoordinates",
      latitude: listing.lat,
      longitude: listing.lng,
    };
  }

  if (listing.locationName) {
    base.address = {
      "@type": "PostalAddress",
      streetAddress: listing.locationName,
      addressLocality: seo.normalizedLocationLabel || listing.locationName,
    };
  }

  if (reviewSummary && reviewSummary.count > 0) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(reviewSummary.avgRating * 10) / 10,
      reviewCount: reviewSummary.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return base;
}

export function buildListingBreadcrumbSchema(
  breadcrumbs: ListingBreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildListingFaqSchema(faqs: SeoFaq[]): Record<string, unknown> | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** All JSON-LD blocks for a listing detail page. */
export function buildAllListingStructuredData(
  input: ListingSchemaInput
): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [
    buildListingStructuredData(input),
    buildListingBreadcrumbSchema(input.breadcrumbs),
  ];
  const faq = buildListingFaqSchema(input.faqs);
  if (faq) blocks.push(faq);
  return blocks;
}
