import type { Metadata } from "next";

import MarketingShell from "@/components/MarketingShell";
import HomeAboutFaq from "@/components/home/HomeAboutFaq";
import HomeCities from "@/components/home/HomeCities";
import HomeFinalCta from "@/components/home/HomeFinalCta";
import HomeGuides from "@/components/home/HomeGuides";
import HomeHero from "@/components/home/HomeHero";
import HomeOwners from "@/components/home/HomeOwners";
import HomeSteps from "@/components/home/HomeSteps";
import HomeVerticals from "@/components/home/HomeVerticals";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import StructuredData from "@/components/seo/StructuredData";
import { canonicalUrl } from "@/lib/seo";
import {
  HOME_ABOUT,
  HOME_FAQS,
  HOME_META,
  HOME_VERTICALS,
  getHomeGlobalCities,
  getHomeIndiaCities,
  getHomeListPropertyLinks,
} from "@/lib/seo/home-page-content";
import { buildPageMetadata, withBrandSuffix } from "@/lib/seo/metadata";
import { buildFAQSchema } from "@/lib/seo/schema-helpers";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: HOME_META.title,
    description: HOME_META.description,
    path: "/",
    keywords: [...HOME_META.keywords],
  }),
  // The root layout's "%s | RentalPins" template only applies to child
  // segments, so the home page sets its full branded title itself.
  title: { absolute: withBrandSuffix(HOME_META.title) },
};

export default function HomePage() {
  const indiaCities = getHomeIndiaCities();
  const globalCities = getHomeGlobalCities();
  const listPropertyLinks = getHomeListPropertyLinks();

  // Organization + WebSite (with SearchAction → /search?q=) are emitted
  // globally by app/layout.tsx; the home page adds WebPage + FAQPage only.
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: HOME_META.title,
    url: canonicalUrl("/"),
    description: HOME_META.description,
    isPartOf: { "@type": "WebSite", name: "RentalPins", url: canonicalUrl("/") },
    about: HOME_ABOUT.paragraphs[0],
    hasPart: HOME_VERTICALS.map((v) => ({
      "@type": "WebPage",
      name: v.title,
      url: canonicalUrl(v.primary.href),
    })),
  };

  return (
    <MarketingShell>
      <StructuredData
        data={[
          webPageSchema,
          buildFAQSchema(HOME_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <HomeHero liveIndiaCityCount={indiaCities.length} />
      <HomeVerticals />
      <HomeSteps />
      <HomeCities indiaCities={indiaCities} globalCities={globalCities} />
      <HomeOwners listPropertyLinks={listPropertyLinks} />
      <HomeGuides />
      <HomeAboutFaq />
      <HomeFinalCta />

      <StickySeoCTA />
    </MarketingShell>
  );
}
