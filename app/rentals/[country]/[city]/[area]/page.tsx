// Dynamic route — area pages: /rentals/{country}/{city}/{area}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAreaBySlug,
  getAllAreas,
  getAllCities,
  getSiblingAreas,
  rentalCityPath,
  rentalAreaPath,
  RENTAL_COUNTRY_SLUGS,
} from "@/lib/cities-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getAreaConfig } from "@/lib/area-config";
import { canonicalUrl } from "@/lib/seo";
import { robotsForCity } from "@/lib/seo/indexing-policy";
import { applyProgrammaticIndexability } from "@/lib/seo/programmatic-metadata";
import { isRentalCategorySlug } from "@/lib/seo/categories";
import {
  categoryHubMetadata,
  resolveCategoryHub,
} from "@/lib/seo/render-category-hub";
import CategoryHubPage from "@/components/seo/CategoryHubPage";
import ListingsGrid from "@/components/ListingsGrid";
import FAQSchema from "@/components/seo/FAQSchema";
import CitySeoContent from "@/components/seo/CitySeoContent";
import { getCitySeoConfig } from "@/lib/seo/city-seo-config";
import { pickCitySeoBlogPosts } from "@/lib/seo/city-seo-blog-links";
import { getMdxPosts } from "@/lib/blog";
import AreaClient from "../../../../rentals-shared/AreaClient";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import {
  buildMohaliCanonicalAreaMetadata,
  isMohaliCanonicalArea,
} from "@/lib/seo/mohali-seo-overrides";
import AeoAnswerBox from "@/components/seo/AeoAnswerBox";
import EntityClusterLinks from "@/components/seo/EntityClusterLinks";
import { flattenAeoFaqAnswer } from "@/lib/seo/aeo-faq";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { buildMarketInsights } from "@/lib/seo/locality-insights";
import MarketInsightsBlock from "@/components/seo/MarketInsightsBlock";
import { clustersForPlace } from "@/lib/seo/topic-clusters";
import { buildCollectionPageSchema } from "@/lib/seo/schema-helpers";
import StructuredData from "@/components/seo/StructuredData";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import { getBrowseHref, getListPropertyHref } from "@/lib/seo-links";

const OG_LOCALE: Record<string, string> = {
  in: "en_IN",
  uk: "en_GB",
  ke: "en_KE",
  ng: "en_NG",
};

export function generateStaticParams() {
  const areaParams = getAllAreas().map((area) => ({
    country: area.parentCountrySlug,
    city: area.parentSlug,
    area: area.slug,
  }));
  const cityCategoryParams = getAllCities().flatMap((city) =>
    RENTAL_CATEGORIES.map((cat) => ({
      country: city.countrySlug,
      city: city.slug,
      area: cat.slug,
    }))
  );
  return [...areaParams, ...cityCategoryParams];
}

export async function generateMetadata({
  params,
}: {
  params:
    | Promise<{ country: string; city: string; area: string }>
    | { country: string; city: string; area: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  if (!RENTAL_COUNTRY_SLUGS.includes(resolvedParams.country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    return { title: "Not Found" };
  }
  if (isRentalCategorySlug(resolvedParams.area)) {
    const ctx = await resolveCategoryHub(
      resolvedParams.country,
      resolvedParams.city,
      resolvedParams.area
    );
    const meta = categoryHubMetadata(
      ctx,
      `/rentals/${resolvedParams.country}/${resolvedParams.city}/${resolvedParams.area}`
    );
    return { ...meta, robots: robotsForCity(ctx.city) };
  }
  const result = getAreaBySlug(
    resolvedParams.country,
    resolvedParams.city,
    resolvedParams.area
  );
  if (!result) return { title: "Not Found" };

  const { city, area } = result;
  const areaNames = area.popularAreas.slice(0, 4).join(", ");
  const base = canonicalUrl(
    rentalAreaPath(city.countrySlug, city.slug, area.slug)
  );

  if (isMohaliCanonicalArea(city.countrySlug, city.slug, area.slug)) {
    return buildMohaliCanonicalAreaMetadata(
      rentalAreaPath(city.countrySlug, city.slug, area.slug)
    );
  }

  const areaConfig = getAreaConfig(resolvedParams.city, resolvedParams.area);
  let listingCount = 0;
  if (areaConfig) {
    try {
      const listings = await fetchAreaListings(areaConfig, 20);
      listingCount = listings.length;
    } catch {
      listingCount = 0;
    }
  }
  const hasUniqueContent = Boolean(
    getCitySeoConfig(resolvedParams.country, resolvedParams.city, resolvedParams.area)
  );

  const baseMeta = {
    title: `Rentals in ${area.name} — ${areaNames} & More`,
    description: `Find rooms, apartments, PG, vehicles, office space and more on rent in ${area.name}. ${area.heroDescription} Contact owners directly on RentalPins. No broker fee.`,
    keywords: [
      `rentals in ${area.name}`,
      ...area.popularAreas.slice(0, 6).map((a) => `${a} ${area.name} rentals`),
      ...area.popularSearches.slice(0, 12),
      `room for rent ${area.name}`,
      `apartment for rent ${area.name}`,
      `PG in ${area.name}`,
      `RentalPins ${area.name}`,
    ],
    openGraph: {
      title: `Rentals in ${area.name} — ${areaNames} | RentalPins`,
      description: `Browse live rental listings across ${area.name} — property, vehicles, electronics and more on one map. Covering ${areaNames} and more.`,
      url: base,
      siteName: "RentalPins",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      locale: OG_LOCALE[city.countrySlug] ?? "en_IN",
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `Rentals in ${area.name} | RentalPins`,
      description: `Find rentals on the map across ${area.name}. Free to browse, easy to list.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: base,
    },
    robots: robotsForCity(city),
  };

  return applyProgrammaticIndexability({
    path: rentalAreaPath(city.countrySlug, city.slug, area.slug),
    countrySlug: city.countrySlug,
    citySlug: city.slug,
    areaSlug: area.slug,
    listingCount,
    hasUniqueContent,
    base: baseMeta,
  });
}

export const revalidate = 7200;

export default async function AreaPage({
  params,
}: {
  params:
    | Promise<{ country: string; city: string; area: string }>
    | { country: string; city: string; area: string };
}) {
  const resolvedParams = await Promise.resolve(params);

  if (!RENTAL_COUNTRY_SLUGS.includes(resolvedParams.country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    notFound();
  }

  if (isRentalCategorySlug(resolvedParams.area)) {
    const ctx = await resolveCategoryHub(
      resolvedParams.country,
      resolvedParams.city,
      resolvedParams.area
    );
    return (
      <CategoryHubPage
        city={ctx.city}
        category={ctx.category}
        listings={ctx.listings}
        mapHref={ctx.mapHref}
      />
    );
  }

  const result = getAreaBySlug(
    resolvedParams.country,
    resolvedParams.city,
    resolvedParams.area
  );
  if (!result) {
    notFound();
  }

  const { city, area } = result;

  const seoConfig = getCitySeoConfig(
    resolvedParams.country,
    resolvedParams.city,
    resolvedParams.area
  );
  const relatedGuides = seoConfig
    ? pickCitySeoBlogPosts(seoConfig.key, getMdxPosts())
    : [];
  const pageFaqs = seoConfig?.faq.length
    ? seoConfig.faq
    : buildConversationalFaqs("rent-locality", {
        city: city.name,
        locality: area.name,
      });

  let listings: Awaited<ReturnType<typeof fetchAreaListings>> = [];
  try {
    const areaConfig = getAreaConfig(resolvedParams.city, resolvedParams.area);
    if (areaConfig) {
      listings = await fetchAreaListings(areaConfig, 20);
    }
  } catch (err) {
    console.error("AreaPage listings fetch failed:", err);
  }

  const aeoSummary = `RentalPins helps users discover rentals in ${area.name}, ${city.name} through map-based, owner-direct listings. Browse by location, compare nearby areas, and contact owners directly where available.`;

  const marketInsights = buildMarketInsights({
    city: city.name,
    locality: area.name,
    listings,
    nearbyLocalities: area.popularAreas.slice(0, 6),
  });

  const entityLinks = clustersForPlace(area.slug).flatMap((c) => c.links).slice(0, 8);

  const spokeLinks = getSiblingAreas(
    resolvedParams.country,
    resolvedParams.city,
    resolvedParams.area
  );

  const areaData = {
    name: area.name,
    slug: area.slug,
    parentCity: city.name,
    parentSlug: city.slug,
    parentCountrySlug: city.countrySlug,
    country: city.country,
    tagline: area.tagline,
    badge: area.badge,
    primaryFocus: area.primaryFocus,
    heroDescription: area.heroDescription,
    coordinates: area.coordinates,
    popularAreas: area.popularAreas,
    topCategories: area.topCategories,
    popularSearches: area.popularSearches,
    spokeLinks,
    faqs: pageFaqs.map((f) =>
      "q" in f && "a" in f
        ? { q: f.q, a: f.a }
        : { q: f.question, a: flattenAeoFaqAnswer(f) }
    ),
    ctaHeading: area.ctaHeading,
    ctaBody: area.ctaBody,
  };

  const pageUrl = canonicalUrl(
    rentalAreaPath(city.countrySlug, city.slug, area.slug)
  );
  const cityUrl = canonicalUrl(rentalCityPath(city.countrySlug, city.slug));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `RentalPins ${area.name}`,
    description: area.heroDescription,
    url: pageUrl,
    image: canonicalUrl("/logo/logo.png"),
    email: "support@rentalpins.com",
    geo: {
      "@type": "GeoCoordinates",
      latitude: area.coordinates.lat,
      longitude: area.coordinates.lng,
    },
    areaServed: area.popularAreas.map((a) => ({ "@type": "City", name: a })),
    parentOrganization: {
      "@type": "Organization",
      name: "RentalPins",
      url: canonicalUrl("/"),
    },
  };
  if (city.countrySlug === "in") {
    (jsonLd as { telephone?: string }).telephone = "+91-9915209240";
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Rentals", item: canonicalUrl("/rentals") },
      { "@type": "ListItem", position: 3, name: city.name, item: cityUrl },
      { "@type": "ListItem", position: 4, name: area.name, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {pageFaqs.length > 0 ? <FAQSchema faqs={pageFaqs} /> : null}
      <StructuredData
        data={buildCollectionPageSchema(
          {
            name: `Rentals in ${area.name}`,
            description: area.heroDescription,
            url: pageUrl,
          },
          listings.slice(0, 10).map((l) => ({
            name: l.title,
            url: pageUrl,
          }))
        )}
      />
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <AeoAnswerBox summary={aeoSummary} />
        <MarketInsightsBlock insights={marketInsights} className="mt-8" />
        <EntityClusterLinks links={entityLinks} className="mt-8" heading="Explore related topics" />
      </div>
      <ListingsGrid listings={listings} areaName={area.name} />
      {seoConfig ? (
        <CitySeoContent config={seoConfig} relatedGuides={relatedGuides} />
      ) : null}
      <ListPropertyCTA
        variant="inline"
        cityName={city.name}
        areaName={area.name}
        citySlug={city.slug}
        areaSlug={area.slug}
        browseHref={getBrowseHref({
          citySlug: city.slug,
          areaSlug: area.slug,
          lat: area.coordinates.lat,
          lng: area.coordinates.lng,
          placeQuery: area.name,
        })}
        listHref={getListPropertyHref({ citySlug: city.slug, areaSlug: area.slug })}
      />
      <ListPropertyCTA
        variant="bottom"
        cityName={city.name}
        areaName={area.name}
        citySlug={city.slug}
        areaSlug={area.slug}
      />
      <AreaClient area={areaData} listingsCount={listings.length} />
      <StickySeoCTA
        citySlug={city.slug}
        areaSlug={area.slug}
        placeQuery={area.name}
        browseHref={getBrowseHref({
          citySlug: city.slug,
          areaSlug: area.slug,
          lat: area.coordinates.lat,
          lng: area.coordinates.lng,
          placeQuery: area.name,
        })}
        listHref={getListPropertyHref({ citySlug: city.slug, areaSlug: area.slug })}
      />
    </>
  );
}
