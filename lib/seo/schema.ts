import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildOrganizationSchema,
  buildRealEstateListingSchema,
  buildWebsiteSchema,
  type BreadcrumbSchemaItem,
} from "@/lib/seo/schema-helpers";
import type { SeoFaqItem } from "@/lib/seo/seoTypes";
import type { SeoListingCard } from "@/lib/seo-listings";
import { canonicalUrl } from "@/lib/seo";
import { appPath } from "@/lib/config";

export {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildOrganizationSchema,
  buildRealEstateListingSchema,
  buildWebsiteSchema,
};

export function buildWebPageSchema(input: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { "@type": "WebSite", name: "RentalPins", url: canonicalUrl("/") },
    publisher: { "@type": "Organization", name: "RentalPins" },
  };
}

export function buildFaqPageSchema(faqs: SeoFaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function buildItemListSchema(
  listings: SeoListingCard[],
  listName: string
): Record<string, unknown> | null {
  if (listings.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: canonicalUrl(`/listings/${l.id}`),
      name: l.title,
    })),
  };
}

export function buildSoftwareApplicationSchema(input: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };
}

export function buildArticleSchemaForGuide(input: {
  title: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    author: { "@type": "Organization", name: "RentalPins" },
    publisher: {
      "@type": "Organization",
      name: "RentalPins",
      logo: { "@type": "ImageObject", url: canonicalUrl("/logo/logo.png") },
    },
  };
}

export function buildLocalBusinessPlaceholder(input: {
  name: string;
  area: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `RentalPins — ${input.name}`,
    description: `Rental search near ${input.name}, ${input.area}`,
    url: input.url,
    areaServed: input.area,
  };
}

export function buildSeoPageSchemaBundle(input: {
  pageName: string;
  description: string;
  path: string;
  breadcrumbs: BreadcrumbSchemaItem[];
  faqs: SeoFaqItem[];
  listings: SeoListingCard[];
  isGuide?: boolean;
  isTool?: boolean;
}): Record<string, unknown>[] {
  const url = canonicalUrl(input.path);
  const schemas: Record<string, unknown>[] = [
    buildBreadcrumbSchema(input.breadcrumbs),
    buildWebPageSchema({ name: input.pageName, description: input.description, url }),
  ];

  if (input.faqs.length > 0) schemas.push(buildFaqPageSchema(input.faqs));

  const itemList = buildItemListSchema(input.listings, `Listings — ${input.pageName}`);
  if (itemList) schemas.push(itemList);

  if (input.isGuide) {
    schemas.push(buildArticleSchemaForGuide({ title: input.pageName, description: input.description, url }));
  }
  if (input.isTool) {
    schemas.push(
      buildSoftwareApplicationSchema({ name: input.pageName, description: input.description, url })
    );
  }

  return schemas;
}

export function breadcrumbItemsFromPaths(
  crumbs: { name: string; path: string }[]
): BreadcrumbSchemaItem[] {
  return crumbs.map((c) => ({ name: c.name, url: canonicalUrl(c.path) }));
}

/** Listing cards → RealEstateListing schema array (cap 5). */
export function listingSchemasFromCards(
  listings: SeoListingCard[],
  locality?: string
): Record<string, unknown>[] {
  return listings.slice(0, 5).map((l) =>
    buildRealEstateListingSchema({
      name: l.title,
      description: l.description || l.title,
      url: canonicalUrl(appPath(`/listings/${l.id}`)),
      images: l.imageUrl ? [l.imageUrl] : undefined,
      price: l.price,
      priceCurrency: "INR",
      addressLocality: locality ?? l.locationName,
      lat: l.lat,
      lng: l.lng,
      datePosted: l.createdAt,
    })
  );
}
