import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCityBySlug,
  rentalAreaPath,
  RENTAL_COUNTRY_SLUGS,
  type RentalCountrySlug,
} from "@/lib/cities-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getAreaConfig } from "@/lib/area-config";
import { canonicalForCity, robotsForCity } from "@/lib/seo/indexing-policy";
import ListingsGrid from "@/components/ListingsGrid";
import FAQSchema from "@/components/seo/FAQSchema";
import CitySeoContent from "@/components/seo/CitySeoContent";
import { getCitySeoConfig } from "@/lib/seo/city-seo-config";
import { pickCitySeoBlogPosts } from "@/lib/seo/city-seo-blog-links";
import { getMdxPosts } from "@/lib/blog";
import AreaClient from "@/app/rentals-shared/AreaClient";

const OG_LOCALE: Record<string, string> = {
  in: "en_IN",
  uk: "en_GB",
  ke: "en_KE",
  ng: "en_NG",
};

export function rentalCityHubExports(countrySlug: RentalCountrySlug, citySlug: string) {
  async function generateMetadata(): Promise<Metadata> {
    const city = getCityBySlug(countrySlug, citySlug);
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

  async function Page() {
    if (!RENTAL_COUNTRY_SLUGS.includes(countrySlug)) {
      notFound();
    }

    const city = getCityBySlug(countrySlug, citySlug);
    if (!city) {
      notFound();
    }

    const seoConfig = getCitySeoConfig(countrySlug, citySlug);
    const relatedGuides = seoConfig
      ? pickCitySeoBlogPosts(seoConfig.key, getMdxPosts())
      : [];
    const pageFaqs = seoConfig?.faq.length ? seoConfig.faq : city.faqs;

    let listings: Awaited<ReturnType<typeof fetchAreaListings>> = [];
    try {
      const area = getAreaConfig(citySlug);
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
      faqs: pageFaqs,
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
        {pageFaqs.length > 0 ? (
          <FAQSchema
            faqs={pageFaqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
          />
        ) : null}
        <ListingsGrid listings={listings} areaName={city.name} />
        <AreaClient area={areaData} listingsCount={listings.length} />
        {seoConfig ? (
          <CitySeoContent config={seoConfig} relatedGuides={relatedGuides} />
        ) : null}
      </>
    );
  }

  return { generateMetadata, Page };
}
