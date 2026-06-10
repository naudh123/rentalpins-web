import type { Metadata } from "next";
import HomeRecentlyViewed from "@/components/listings/HomeRecentlyViewed";
import MarketingShell from "@/components/MarketingShell";
import HomeDiscoverSection from "@/components/home/HomeDiscoverSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import HomeFinalCta from "@/components/home/HomeFinalCta";
import HomeHero from "@/components/home/HomeHero";
import HomeOwnerListingSection from "@/components/home/HomeOwnerListingSection";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import { JsonLdFAQ } from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import { getAllCities } from "@/lib/cities-config";
import { HOME_FAQS } from "@/lib/seo/home-page-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title:
    "RentalPins — List Property Free & Find Rentals Without Broker in India",
  description:
    "List flats, PG, houses, shops, offices and warehouses free on RentalPins. Renters browse owner listings on the map across Mohali, Delhi, Ludhiana and more — no broker commission.",
  path: "/",
  keywords: [
    "list property free",
    "post rental listing",
    "rent without broker",
    "flats for rent",
    "PG for rent",
    "property owner listing",
    "Mohali rentals",
    "Delhi rentals",
    "commercial property rent",
  ],
});

export default function HomePage() {
  const cities = getAllCities();
  const liveCount = cities.filter((c) => c.status === "live").length;
  const topCities = cities.filter((c) => c.status === "live").slice(0, 8);

  return (
    <MarketingShell>
      <BreadcrumbSchema items={[{ name: "Home", url: canonicalUrl("/") }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "RentalPins — List property free & find rentals on the map",
          url: canonicalUrl("/"),
          description:
            "Map-first rental marketplace for owners and renters. List flats, PG, shops and offices free. Browse without broker.",
          isPartOf: { "@type": "WebSite", name: "RentalPins", url: canonicalUrl("/") },
        }}
      />
      <JsonLdFAQ faqs={HOME_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

      <div className="rp-gradient-hero">
        <HomeHero liveCityCount={liveCount} />
        <HomeOwnerListingSection />
        <HomeRecentlyViewed />
        <HomeDiscoverSection cities={cities} topCities={topCities} />
        <HomeFaqSection />
        <HomeFinalCta />
      </div>

      <StickySeoCTA />
    </MarketingShell>
  );
}
