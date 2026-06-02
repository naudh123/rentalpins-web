// Dynamic route — city hub pages: /rentals/{country}/{city}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCityBySlug,
  getAllCities,
  rentalAreaPath,
  RENTAL_COUNTRY_SLUGS,
} from "@/lib/cities-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getAreaConfig } from "@/lib/area-config";
import { canonicalUrl } from "@/lib/seo";
import { canonicalForCity, robotsForCity } from "@/lib/seo/indexing-policy";
import ListingsGrid from "@/components/ListingsGrid";
import AreaClient from "../../../rentals-shared/AreaClient";

const OG_LOCALE: Record<string, string> = {
  in: "en_IN",
  uk: "en_GB",
  ke: "en_KE",
  ng: "en_NG",
};

export function generateStaticParams() {
  return getAllCities().map((city) => ({
    country: city.countrySlug,
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }> | { country: string; city: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  if (!RENTAL_COUNTRY_SLUGS.includes(resolvedParams.country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    return { title: "Not Found" };
  }
  const city = getCityBySlug(resolvedParams.country, resolvedParams.city);
  if (!city) return { title: "Not Found" };

  const areaNames = city.popularAreas.slice(0, 5).join(", ");
  const base = canonicalForCity(city);

  return {
    title: `Rentals in ${city.name} — ${areaNames} & More`,
    description: `Find rooms, apartments, PG, vehicles, electronics and more on rent across ${city.name}. ${city.heroDescription} Contact owners directly on RentalPins. No broker fee. Free to list.`,
    keywords: [
      `rentals in ${city.name}`,
      ...city.popularAreas.slice(0, 8).map((a) => `rentals in ${a}`),
      ...city.popularSearches.slice(0, 14),
      `room for rent ${city.name}`,
      `apartment for rent ${city.name}`,
      `PG in ${city.name}`,
      `no broker ${city.name}`,
      `RentalPins ${city.name}`,
    ],
    openGraph: {
      title: `Rentals in ${city.name} — ${areaNames} | RentalPins`,
      description: `Browse live rental listings across ${city.name} — property, vehicles, electronics and more on one map. Covering ${areaNames} and more.`,
      url: base,
      siteName: "RentalPins",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      locale: OG_LOCALE[city.countrySlug] ?? "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Rentals in ${city.name} | RentalPins`,
      description: `Find rentals on the map across ${city.name}. Free to browse, easy to list.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: base,
    },
    robots: robotsForCity(city),
  };
}

export const revalidate = 7200;

export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; city: string }> | { country: string; city: string };
}) {
  const resolvedParams = await Promise.resolve(params);

  if (!RENTAL_COUNTRY_SLUGS.includes(resolvedParams.country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    notFound();
  }

  const city = getCityBySlug(resolvedParams.country, resolvedParams.city);
  if (!city) {
    notFound();
  }

  let listings: any[] = [];
  try {
    const area = getAreaConfig(resolvedParams.city);
    if (area) {
      listings = await fetchAreaListings(area, 20);
    }
  } catch (err) {
    console.error("CityPage listings fetch failed:", err);
  }

  const spokeLinks = city.areas.map((a) => ({
    label: a.name,
    href: rentalAreaPath(city.countrySlug, city.slug, a.slug),
  }));

  const areaData = {
    name: city.name,
    slug: city.slug,
    parentCity: "",
    parentSlug: "",
    parentCountrySlug: city.countrySlug,
    country: city.country,
    tagline: city.tagline,
    badge: city.badge,
    primaryFocus: "",
    heroDescription: city.heroDescription,
    coordinates: city.coordinates,
    popularAreas: city.popularAreas,
    topCategories: city.topCategories,
    popularSearches: city.popularSearches,
    spokeLinks,
    faqs: city.faqs,
    ctaHeading: city.ctaHeading,
    ctaBody: city.ctaBody,
  };

  const baseUrl = `https://www.rentalpins.com/rentals/${city.countrySlug}/${city.slug}`;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `RentalPins ${city.name}`,
    description: city.heroDescription,
    url: baseUrl,
    image: "https://www.rentalpins.com/logo/logo.png",
    email: "support@rentalpins.com",
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    areaServed: city.popularAreas.map((a) => ({
      "@type": "City",
      name: a,
    })),
  };
  if (city.countrySlug === "in") {
    (jsonLd as { telephone?: string }).telephone = "+91-9915209240";
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rentalpins.com" },
      { "@type": "ListItem", position: 2, name: "Rentals", item: "https://www.rentalpins.com/rentals" },
      { "@type": "ListItem", position: 3, name: city.name, item: baseUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ListingsGrid listings={listings} areaName={city.name} />
      <AreaClient area={areaData} listingsCount={listings.length} />
    </>
  );
}
