import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingsGrid from "@/components/ListingsGrid";
import FAQSchema from "@/components/seo/FAQSchema";
import CityBuySeoContent from "@/components/seo/CityBuySeoContent";
import {
  getAllAreas,
  getAreaBySlug,
  RENTAL_COUNTRY_SLUGS,
} from "@/lib/cities-config";
import { getAreaConfig } from "@/lib/area-config";
import { canonicalUrl } from "@/lib/seo";
import { getCityBuySeoConfig, listCityBuySeoConfigKeys } from "@/lib/seo/city-buy-seo-config";
import { buyAreaPath } from "@/lib/sale/buy-pages-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { appPath, siteUrl } from "@/lib/config";

const BUY_AREA_SLUGS = new Set(
  listCityBuySeoConfigKeys()
    .filter((k) => k.split("/").length === 3)
    .map((k) => k.split("/")[2]!)
);

export function generateStaticParams() {
  return getAllAreas()
    .filter(
      (row) =>
        row.parentCountrySlug === "in" &&
        row.parentSlug === "chandigarh" &&
        BUY_AREA_SLUGS.has(row.slug)
    )
    .map((row) => ({
      hub: row.parentCountrySlug,
      area: row.parentSlug,
      locality: row.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string; area: string; locality: string }>;
}): Promise<Metadata> {
  const { hub, area, locality } = await params;
  const seo = getCityBuySeoConfig(hub, area, locality);
  const result = getAreaBySlug(hub, area, locality);
  if (!seo || !result) return { title: "Buy property | RentalPins" };

  const path = buyAreaPath(hub, area, locality);
  const canonical = `${siteUrl}${appPath(path)}`;
  return {
    title: `Property for sale in ${result.area.name} | RentalPins Buy`,
    description: `Buy flats, villas, and plots in ${result.area.name} — owner-direct sale listings on the map. ${seo.intro[0]?.slice(0, 120)}`,
    alternates: { canonical },
    openGraph: {
      title: `Property for sale in ${result.area.name}`,
      description: seo.intro[0],
      url: canonical,
      siteName: "RentalPins",
      type: "website",
    },
  };
}

export const revalidate = 7200;

/** Long-form money pages: /buy/in/chandigarh/mohali */
export default async function BuyMoneyAreaPage({
  params,
}: {
  params: Promise<{ hub: string; area: string; locality: string }>;
}) {
  const { hub, area, locality } = await params;

  if (!RENTAL_COUNTRY_SLUGS.includes(hub as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    notFound();
  }

  const result = getAreaBySlug(hub, area, locality);
  const seoConfig = getCityBuySeoConfig(hub, area, locality);
  if (!result || !seoConfig) notFound();

  const { area: areaMeta } = result;
  let listings: Awaited<ReturnType<typeof fetchAreaListings>> = [];
  try {
    const areaConfig = getAreaConfig(area, locality);
    if (areaConfig) {
      listings = await fetchAreaListings(areaConfig, 20, { transactionType: "sale" });
    }
  } catch (err) {
    console.error("BuyMoneyAreaPage listings fetch failed:", err);
  }

  const pageUrl = canonicalUrl(buyAreaPath(hub, area, locality));

  return (
    <>
      <FAQSchema
        faqs={seoConfig.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <section className="rp-gradient-hero border-b border-[var(--border-subtle)] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            RentalPins Buy
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            Property for sale in {areaMeta.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{areaMeta.heroDescription}</p>
        </div>
      </section>
      <ListingsGrid
        listings={listings}
        areaName={areaMeta.name}
        transactionType="sale"
      />
      <CityBuySeoContent config={seoConfig} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Property for sale in ${areaMeta.name}`,
            url: pageUrl,
          }),
        }}
      />
    </>
  );
}
