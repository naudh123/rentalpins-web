import { appPath, siteUrl } from "@/lib/config";
import { aeoFaqsToSchema } from "@/lib/seo/aeo-faq";
import type { AeoFaqItem } from "@/lib/seo/aeo-types";
import type { SeoFaq } from "@/lib/seo/listing-faqs";

function abs(path: string): string {
  return `${siteUrl}${appPath(path)}`;
}

export interface BreadcrumbSchemaItem {
  name: string;
  url: string;
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  image?: string;
  tags?: string[];
  articleSection?: string;
}

export interface CollectionPageSchemaInput {
  name: string;
  description: string;
  url: string;
}

export interface RealEstateListingSchemaInput {
  name: string;
  description: string;
  url: string;
  images?: string[];
  price?: number;
  priceCurrency?: string;
  schemaType?: string;
  addressLocality?: string;
  lat?: number;
  lng?: number;
  datePosted?: string;
  isSale?: boolean;
  includeOffer?: boolean;
}

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentalPins",
    alternateName: ["Rental Pins", "rentalpins.com"],
    url: abs("/"),
    logo: abs("/logo/logo.png"),
    slogan: "Rent Anything, Anywhere",
    description:
      "RentalPins is a map-first property discovery platform for rentals, buy/sale, buyer requirements, and investment intelligence across India and selected global cities.",
    foundingDate: "2024",
    sameAs: [
      "https://www.facebook.com/rentalpins",
      "https://www.instagram.com/rentalpins/",
      "https://x.com/rentalpins",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9915209240",
      email: "support@rentalpins.com",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Punjabi"],
    },
  };
}

export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentalPins",
    url: abs("/"),
    description:
      "Map-based rental and property marketplace. Browse owner-direct listings by city and area; contact owners without broker search fees.",
    inLanguage: ["en-IN", "en-GB", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${abs("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  items: BreadcrumbSchemaItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQSchema(
  faqs: SeoFaq[] | AeoFaqItem[] | { question: string; answer: string }[]
): Record<string, unknown> {
  const normalized =
    faqs.length > 0 && "directAnswer" in faqs[0]!
      ? aeoFaqsToSchema(faqs as AeoFaqItem[])
      : (faqs as { question: string; answer: string }[]);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: normalized.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleSchema(
  article: ArticleSchemaInput
): Record<string, unknown> {
  const imageUrl = article.image
    ? article.image.startsWith("http")
      ? article.image
      : abs(article.image)
    : abs("/og-image.png");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "RentalPins",
      url: abs("/"),
      logo: { "@type": "ImageObject", url: abs("/logo/logo.png") },
    },
    image: [imageUrl],
    mainEntityOfPage: { "@type": "WebPage", "@id": article.url },
    ...(article.articleSection ? { articleSection: article.articleSection } : {}),
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
  };
}

export function buildCollectionPageSchema(
  page: CollectionPageSchemaInput,
  listings?: { name: string; url: string }[]
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    description: page.description,
    url: page.url,
    isPartOf: { "@type": "WebSite", name: "RentalPins", url: abs("/") },
  };

  if (listings?.length) {
    schema.mainEntity = buildItemListSchema(listings);
  }

  return schema;
}

export function buildItemListSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildRealEstateListingSchema(
  listing: RealEstateListingSchemaInput
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": listing.schemaType ?? "RealEstateListing",
    name: listing.name,
    description: listing.description,
    url: listing.url,
    image: listing.images,
  };

  if (listing.datePosted) schema.datePosted = listing.datePosted;

  if (listing.addressLocality) {
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: listing.addressLocality,
    };
  }

  if (
    listing.lat != null &&
    listing.lng != null &&
    Number.isFinite(listing.lat) &&
    Number.isFinite(listing.lng)
  ) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: listing.lat,
      longitude: listing.lng,
    };
  }

  if (listing.includeOffer !== false && listing.price != null && listing.price > 0) {
    schema.offers = buildProductOfferSchema(listing);
  }

  return schema;
}

export function buildProductOfferSchema(
  listing: Pick<
    RealEstateListingSchemaInput,
    "url" | "price" | "priceCurrency" | "isSale"
  >
): Record<string, unknown> {
  return {
    "@type": "Offer",
    price: listing.price,
    priceCurrency: listing.priceCurrency ?? "INR",
    availability: "https://schema.org/InStock",
    url: listing.url,
    businessFunction: listing.isSale
      ? "http://purl.org/goodrelations/v1#Sell"
      : "http://purl.org/goodrelations/v1#LeaseOut",
  };
}
