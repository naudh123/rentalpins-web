import type { Metadata } from "next";
import HomeRecentlyViewed from "@/components/listings/HomeRecentlyViewed";
import MarketingShell from "@/components/MarketingShell";
import HomeAiAdvisorSection from "@/components/home/HomeAiAdvisorSection";
import HomeBuyerDemandSection from "@/components/home/HomeBuyerDemandSection";
import HomeDeveloperSection from "@/components/home/HomeDeveloperSection";
import HomeDiscoverSection from "@/components/home/HomeDiscoverSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import HomeFinalCta from "@/components/home/HomeFinalCta";
import HomeHero from "@/components/home/HomeHero";
import HomeInvestmentIntelSection from "@/components/home/HomeInvestmentIntelSection";
import HomeOwnerListingSection from "@/components/home/HomeOwnerListingSection";
import HomeTricitySection from "@/components/home/HomeTricitySection";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import { JsonLdFAQ } from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import { getAllCities } from "@/lib/cities-config";
import AeoAnswerBox from "@/components/seo/AeoAnswerBox";
import { HOME_FAQS, HOME_HERO } from "@/lib/seo/home-page-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "RentalPins — Rent & Buy Property on the Map | India",
  description:
    "Find rentals and properties for sale on RentalPins. Browse map-based listings, compare locations, contact owners directly, and list your property free.",
  path: "/",
  keywords: [
    "rent property on map",
    "buy property on map",
    "owner-direct property",
    "property for sale",
    "Chandigarh Tricity property",
    "Mohali property",
    "New Chandigarh investment",
    "no broker rentals",
    "list property free",
    "flats for rent",
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
          name: "RentalPins — Rent & buy property on the map",
          url: canonicalUrl("/"),
          description:
            "RentalPins helps people rent, buy, sell, and discover property directly through live map-based listings.",
          isPartOf: { "@type": "WebSite", name: "RentalPins", url: canonicalUrl("/") },
        }}
      />
      <JsonLdFAQ faqs={HOME_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

      <div className="rp-gradient-hero">
        <HomeHero liveCityCount={liveCount} />
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <AeoAnswerBox summary={HOME_HERO.subhead} heading="What is RentalPins?" />
        </div>
        <HomeTricitySection />
        <HomeBuyerDemandSection />
        <HomeInvestmentIntelSection />
        <HomeAiAdvisorSection />
        <HomeDeveloperSection />
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
