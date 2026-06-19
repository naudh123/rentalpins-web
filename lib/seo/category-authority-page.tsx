import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import MarketInsightsBlock, {
  HubFaqSection,
  PopularSearchesBlock,
} from "@/components/seo/MarketInsightsBlock";
import ListingsGrid from "@/components/ListingsGrid";
import { appPath, siteUrl } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { buildMarketInsights } from "@/lib/seo/locality-insights";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getAreaConfig } from "@/lib/area-config";
import {
  listingSegmentBasePath,
  type ListingCategorySegment,
} from "@/lib/seo/listing-category-segments";
import { getCityBySlug, getAllCities } from "@/lib/cities-config";

const SEGMENT_LABELS: Record<ListingCategorySegment, string> = {
  property: "Property",
  equipment: "Equipment",
  vehicles: "Vehicles",
  furniture: "Furniture",
  electronics: "Electronics",
  appliances: "Appliances",
};

function categoryCityPath(segment: ListingCategorySegment, city: string, locality?: string): string {
  const base = listingSegmentBasePath(segment);
  return locality
    ? `${base}/locality/${city}/${locality}`
    : `${base}/locality/${city}`;
}

export function createCategoryAuthorityPage(segment: ListingCategorySegment) {
  const label = SEGMENT_LABELS[segment];

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ city: string; locality?: string }>;
  }): Promise<Metadata> {
    const { city, locality } = await params;
    const cityConfig = getCityBySlug(city);
    if (!cityConfig || cityConfig.status !== "live") {
      return { title: `${label} rentals` };
    }
    const place = locality
      ? `${locality.replace(/-/g, " ")}, ${cityConfig.name}`
      : cityConfig.name;
    const path = categoryCityPath(segment, city, locality);
    return buildPageMetadata({
      title: `${label} for Rent in ${place}`,
      description: `Browse ${label.toLowerCase()} for rent in ${place} on RentalPins. Owner-direct listings with map search, photos, and direct contact.`,
      path,
      keywords: [`${label.toLowerCase()} for rent ${place}`, "RentalPins", "no broker"],
    });
  }

  async function Page({
    params,
  }: {
    params: Promise<{ city: string; locality?: string }>;
  }) {
    const { city, locality } = await params;
    const cityConfig = getCityBySlug(city);
    if (!cityConfig || cityConfig.status !== "live") notFound();

    const areaSlug = locality ?? city;
    const areaConfig = getAreaConfig(city, locality) ?? getAreaConfig(city);
    if (!areaConfig) notFound();

    const areaMeta = cityConfig.areas.find((a) => a.slug === areaSlug) ?? cityConfig.areas[0];
    if (!areaMeta) notFound();

    const listings = await fetchAreaListings(areaConfig);
    const filtered =
      segment === "property"
        ? listings.filter((l) => l.category === "Property")
        : listings.filter((l) => {
            const seg = segment;
            const cat = l.category.toLowerCase();
            if (seg === "equipment") return cat.includes("equipment") || cat.includes("machinery");
            if (seg === "vehicles") return cat === "vehicles";
            if (seg === "furniture") return cat === "furniture";
            if (seg === "electronics") return cat.includes("electronics");
            if (seg === "appliances") return cat.includes("appliances");
            return true;
          });
    const placeName = locality
      ? `${areaMeta.name}, ${cityConfig.name}`
      : cityConfig.name;
    const path = categoryCityPath(segment, city, locality);
    const pageUrl = canonicalUrl(path);

    const insights = buildMarketInsights({
      city: cityConfig.name,
      locality: locality ? areaMeta.name : undefined,
      listings: filtered,
      nearbyLocalities: cityConfig.areas
        .filter((a) => a.slug !== areaMeta.slug)
        .slice(0, 6)
        .map((a) => a.name),
    });

    const faqs = buildConversationalFaqs("rent-category", {
      city: cityConfig.name,
      locality: locality ? areaMeta.name : undefined,
      category: label.toLowerCase(),
      segment,
    });

    const popularSearches = [
      {
        label: `${label} for rent in ${cityConfig.name}`,
        href: appPath(categoryCityPath(segment, city)),
      },
      {
        label: `Flats for rent in ${cityConfig.name}`,
        href: appPath(`/rentals/${cityConfig.countrySlug}/${city}/flats`),
      },
      {
        label: `Browse on map`,
        href: appPath("/search"),
      },
    ];

    const breadcrumbs = [
      { name: "Home", url: `${siteUrl}${appPath("/")}` },
      { name: "Rentals", url: `${siteUrl}${appPath("/rentals")}` },
      { name: label, url: pageUrl },
    ];

    return (
      <MarketingShell>
        <BreadcrumbSchema items={breadcrumbs} />
        <FAQSchema faqs={faqs} />
        <article className="mx-auto max-w-4xl px-4 py-10">
          <nav className="text-sm text-[var(--muted)]">
            <Link href={appPath("/rentals")} className="hover:underline">
              Rentals
            </Link>
            {" / "}
            <span>{label}</span>
            {" / "}
            <span>{placeName}</span>
          </nav>
          <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)]">
            {label} for rent in {placeName}
          </h1>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Find owner-direct {label.toLowerCase()} rentals in {placeName} on RentalPins. Browse live
            listings below or open the map to compare prices and locations.
          </p>

          <MarketInsightsBlock insights={insights} className="mt-8" />
          <PopularSearchesBlock searches={popularSearches} className="mt-8" />

          {filtered.length > 0 && (
            <section className="mt-10" aria-labelledby="category-listings-heading">
              <h2 id="category-listings-heading" className="font-serif text-2xl">
                Live {label.toLowerCase()} listings
              </h2>
              <ListingsGrid
                listings={filtered.slice(0, 12) as import("@/lib/types/listing").ListingCard[]}
                areaName={placeName}
              />
            </section>
          )}

          <HubFaqSection faqs={faqs} className="mt-10" />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={appPath("/search")} className="rp-btn rp-btn-primary px-6 py-2.5">
              Browse on map
            </Link>
            {getAllCities()
              .filter((c) => c.status === "live" && c.slug !== city)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={appPath(categoryCityPath(segment, c.slug))}
                  className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
                >
                  {label} in {c.name} →
                </Link>
              ))}
          </div>
        </article>
      </MarketingShell>
    );
  }

  return { generateMetadata, Page };
}

/** City slugs with live category authority pages in sitemap. */
export function categoryAuthoritySitemapPaths(
  segment: ListingCategorySegment
): string[] {
  return getAllCities()
    .filter((c) => c.status === "live")
    .map((c) => categoryCityPath(segment, c.slug));
}
