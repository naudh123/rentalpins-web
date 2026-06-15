import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingsGrid from "@/components/ListingsGrid";
import FAQSchema from "@/components/seo/FAQSchema";
import CityBuySeoContent from "@/components/seo/CityBuySeoContent";
import SaleShell from "@/components/sale/SaleShell";
import { getCityBySlug, RENTAL_COUNTRY_SLUGS } from "@/lib/cities-config";
import { getAreaConfig } from "@/lib/area-config";
import { appPath, siteUrl } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";
import { buyCityPath } from "@/lib/sale/buy-pages-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getCityBuySeoConfig } from "@/lib/seo/city-buy-seo-config";

export function isBuyCityMoneyPage(hub: string, area: string): boolean {
  if (!RENTAL_COUNTRY_SLUGS.includes(hub as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    return false;
  }
  return getCityBuySeoConfig(hub, area) != null;
}

export function buyCityMoneyMetadata(country: string, city: string): Metadata {
  const seo = getCityBuySeoConfig(country, city);
  const cityMeta = getCityBySlug(country, city);
  if (!seo || !cityMeta) return { title: "Buy property | RentalPins" };

  const path = buyCityPath(country, city);
  const canonical = `${siteUrl}${appPath(path)}`;
  return {
    title: `Property for sale in ${cityMeta.name} | RentalPins Buy`,
    description: `Buy flats, villas, and plots across ${cityMeta.name} — owner-direct sale listings on the map. ${seo.intro[0]?.slice(0, 120)}`,
    alternates: { canonical },
    openGraph: {
      title: `Property for sale in ${cityMeta.name}`,
      description: seo.intro[0],
      url: canonical,
      siteName: "RentalPins",
      type: "website",
    },
  };
}

export async function BuyCityMoneyPage({
  country,
  city,
}: {
  country: string;
  city: string;
}) {
  if (!RENTAL_COUNTRY_SLUGS.includes(country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    notFound();
  }

  const cityMeta = getCityBySlug(country, city);
  const seoConfig = getCityBuySeoConfig(country, city);
  if (!cityMeta || !seoConfig) notFound();

  let listings: Awaited<ReturnType<typeof fetchAreaListings>> = [];
  try {
    const areaConfig = getAreaConfig(city);
    if (areaConfig) {
      listings = await fetchAreaListings(areaConfig, 20, { transactionType: "sale" });
    }
  } catch (err) {
    console.error("BuyCityMoneyPage listings fetch failed:", err);
  }

  const pageUrl = canonicalUrl(buyCityPath(country, city));

  return (
    <SaleShell>
      <FAQSchema
        faqs={seoConfig.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <section className="rp-gradient-hero border-b border-[var(--border-subtle)] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            RentalPins Buy
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            Property for sale in {cityMeta.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{cityMeta.heroDescription}</p>
        </div>
      </section>
      <ListingsGrid
        listings={listings}
        areaName={cityMeta.name}
        transactionType="sale"
      />
      <CityBuySeoContent config={seoConfig} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Property for sale in ${cityMeta.name}`,
            url: pageUrl,
          }),
        }}
      />
    </SaleShell>
  );
}
