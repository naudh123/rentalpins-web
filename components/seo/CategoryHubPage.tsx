import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import ListingsGrid from "@/components/ListingsGrid";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import SeoContentSections from "@/components/seo/SeoContentSections";
import StructuredData from "@/components/seo/StructuredData";
import { appPath, siteUrl } from "@/lib/config";
import type { CityConfig, AreaConfig as CityAreaConfig } from "@/lib/cities-config";
import { rentalAreaPath, rentalCityPath, getAllAreas } from "@/lib/cities-config";
import type { RentalCategoryConfig } from "@/lib/seo/categories";
import {
  buildCategorySeoSections,
  buildCategorySpokeLinks,
} from "@/lib/seo/content-templates";
import { canonicalUrl } from "@/lib/seo";
import { buildListingSlugSegment } from "@/lib/listing-slug";
import { listingToSlugInput } from "@/lib/listing-path";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import type { SeoListingCard } from "@/lib/seo-listings";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SeoSupplyBlocks from "@/components/seo/SeoSupplyBlocks";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import { intentFromCategorySlug, getSupplyLandingHref } from "@/lib/seo-links";
import { resolveSupplyCtaOverride } from "@/lib/supply-pages-config";
import { resolveGscCityHeroDescription } from "@/lib/seo/gsc-city-seo-overrides";

interface Props {
  city: CityConfig;
  category: RentalCategoryConfig;
  area?: CityAreaConfig | null;
  listings: SeoListingCard[];
  mapHref: string;
}

export default function CategoryHubPage({
  city,
  category,
  area,
  listings,
  mapHref,
}: Props) {
  const placeName = area?.name ?? city.name;
  const path = area
    ? `/rentals/${city.countrySlug}/${city.slug}/${area.slug}/${category.slug}`
    : `/rentals/${city.countrySlug}/${city.slug}/${category.slug}`;
  const supplyIntent = intentFromCategorySlug(category.slug);
  const supplyCitySlug = city.slug;
  const supplyAreaSlug = area?.slug;
  const ctaOverride = resolveSupplyCtaOverride(path);
  const ctaIntent = ctaOverride?.intent ?? supplyIntent;
  const ctaCityName = ctaOverride?.cityName ?? city.name;
  const ctaAreaName = ctaOverride?.areaName ?? area?.name;
  const ctaCitySlug = ctaOverride?.citySlug ?? supplyCitySlug;
  const ctaAreaSlug = ctaOverride?.areaSlug ?? supplyAreaSlug;
  const pageUrl = canonicalUrl(path);
  const heroDescription =
    resolveGscCityHeroDescription(city.slug, category.slug, area?.slug) ??
    `Direct owner listings on the map — no broker. Browse ${category.pluralLabel.toLowerCase()} across ${placeName} and contact instantly.`;
  const supplyLandingHref = getSupplyLandingHref({
    citySlug: ctaCitySlug,
    areaSlug: ctaAreaSlug,
    categorySlug: category.slug,
    intent: ctaIntent,
  });
  const supplyLinkLabel =
    category.slug === "flats"
      ? `List your flat in ${ctaCityName} free →`
      : category.slug === "pg"
        ? `List your PG in ${ctaAreaName ?? ctaCityName} free →`
        : `List property in ${ctaCityName} free →`;

  const breadcrumbs = [
    { name: "Home", url: canonicalUrl("/") },
    { name: "Rentals", url: canonicalUrl("/rentals") },
    { name: city.name, url: canonicalUrl(rentalCityPath(city.countrySlug, city.slug)) },
    ...(area
      ? [
          {
            name: area.name,
            url: canonicalUrl(rentalAreaPath(city.countrySlug, city.slug, area.slug)),
          },
        ]
      : []),
    { name: category.pluralLabel, url: pageUrl },
  ];

  const faqs = [
    {
      q: `How do I find ${category.pluralLabel.toLowerCase()} in ${placeName} without a broker?`,
      a: `Browse the RentalPins map for ${placeName}, filter by ${category.mainCategory}, and contact owners directly via WhatsApp or chat.`,
    },
    {
      q: `Is it free to list ${category.pluralLabel.toLowerCase()} on RentalPins?`,
      a: "Owners can post listings on the web or Android app. Check in-app plans for activation in your city.",
    },
    {
      q: `Which areas have the most ${category.pluralLabel.toLowerCase()} in ${city.name}?`,
      a: `Explore area hubs such as ${city.popularAreas.slice(0, 5).join(", ")} — each links to category-specific inventory.`,
    },
  ];

  const schemaType = category.schemaType;
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.pluralLabel} for rent in ${placeName}`,
    url: pageUrl,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}${appPath(`/listings/${buildListingSlugSegment(listingToSlugInput(l))}`)}`,
      name: l.title,
    })),
  };

  const realEstateSchema =
    schemaType === "Apartment" || schemaType === "Residence"
      ? {
          "@context": "https://schema.org",
          "@type": schemaType,
          name: `${category.pluralLabel} in ${placeName}`,
          description: `${category.pluralLabel} for rent in ${placeName} on RentalPins`,
          address: {
            "@type": "PostalAddress",
            addressLocality: placeName,
            addressRegion: city.name,
            addressCountry: city.country,
          },
        }
      : null;

  const sections = buildCategorySeoSections(city, category);
  const spokes = buildCategorySpokeLinks(city, area ?? null, category);
  const cityAreas = getAllAreas().filter(
    (a) => a.parentCountrySlug === city.countrySlug && a.parentSlug === city.slug
  );

  return (
    <MarketingShell>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <StructuredData data={[itemListSchema, ...(realEstateSchema ? [realEstateSchema] : [])]} />

      <div className="rp-gradient-hero border-b border-[var(--border-subtle)] px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <nav className="text-xs text-[var(--muted)]">
            <Link href={appPath("/")} className="hover:text-[var(--brand-orange)]">
              Home
            </Link>
            {" / "}
            <Link href={appPath("/rentals")} className="hover:text-[var(--brand-orange)]">
              Rentals
            </Link>
            {" / "}
            <Link
              href={appPath(rentalCityPath(city.countrySlug, city.slug))}
              className="hover:text-[var(--brand-orange)]"
            >
              {city.name}
            </Link>
            {area && (
              <>
                {" / "}
                <Link
                  href={appPath(rentalAreaPath(city.countrySlug, city.slug, area.slug))}
                  className="hover:text-[var(--brand-orange)]"
                >
                  {area.name}
                </Link>
              </>
            )}
          </nav>
          <h1 className="mt-4 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {category.pluralLabel} for rent in {placeName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {heroDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={mapHref} className="rp-btn rp-btn-primary px-6 py-2.5">
              View on map
            </Link>
            <Link href={appPath("/post")} className="rp-btn rp-btn-secondary px-6 py-2.5">
              Post free
            </Link>
          </div>
        </div>
      </div>

      <ListPropertyCTA
        variant="hero"
        cityName={ctaCityName}
        areaName={ctaAreaName}
        categoryName={category.pluralLabel}
        intent={ctaIntent}
        browseHref={mapHref}
        citySlug={ctaCitySlug}
        areaSlug={ctaAreaSlug}
        categorySlug={category.slug}
        headlineOverride={ctaOverride?.headline}
        bodyOverride={ctaOverride?.body}
        supplyLandingHref={supplyLandingHref}
      />

      {listings.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="rp-section-title text-lg">Live listings</h2>
          <ListingsGrid listings={listings} areaName={placeName} />
        </section>
      )}

      <SeoContentSections sections={sections} />

      <ListPropertyCTA
        variant="inline"
        cityName={ctaCityName}
        areaName={ctaAreaName}
        categoryName={category.pluralLabel}
        intent={ctaIntent}
        browseHref={mapHref}
        citySlug={ctaCitySlug}
        areaSlug={ctaAreaSlug}
        categorySlug={category.slug}
        headlineOverride={ctaOverride?.headline}
        bodyOverride={ctaOverride?.body}
        supplyLandingHref={supplyLandingHref}
      />

      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="rp-section-title text-lg">Browse by category in {city.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {RENTAL_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={appPath(
                  area
                    ? `/rentals/${city.countrySlug}/${city.slug}/${area.slug}/${c.slug}`
                    : `/rentals/${city.countrySlug}/${city.slug}/${c.slug}`
                )}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold no-underline ${
                  c.slug === category.slug
                    ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
                    : "border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-orange)]"
                }`}
              >
                {c.pluralLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!area && cityAreas.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-10">
          <h2 className="rp-section-title text-lg">Popular areas</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {cityAreas.slice(0, 12).map((a) => (
              <li key={a.slug}>
                <Link
                  href={appPath(
                    `/rentals/${city.countrySlug}/${city.slug}/${a.slug}/${category.slug}`
                  )}
                  className="text-sm font-medium text-[var(--brand-orange)] hover:underline"
                >
                  {category.pluralLabel} in {a.name} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SeoSupplyBlocks
        cityName={ctaCityName}
        areaName={ctaAreaName ?? city.name}
        categoryName={category.pluralLabel}
        citySlug={ctaCitySlug}
        areaSlug={ctaAreaSlug}
        intent={ctaIntent}
        nearbyAreaLabels={city.popularAreas.slice(0, 6)}
        rentalTypes={category.subCategories.length ? category.subCategories : [category.pluralLabel]}
        lowListings={listings.length < 3}
        browseHref={mapHref}
        showHero={false}
        showInline={false}
        showBottom={false}
        showSticky={false}
        headlineOverride={ctaOverride?.headline}
        bodyOverride={ctaOverride?.body}
      />

      <ListPropertyCTA
        variant="bottom"
        cityName={ctaCityName}
        areaName={ctaAreaName}
        categoryName={category.pluralLabel}
        intent={ctaIntent}
        browseHref={mapHref}
        citySlug={ctaCitySlug}
        areaSlug={ctaAreaSlug}
        categorySlug={category.slug}
        headlineOverride={ctaOverride?.headline}
        bodyOverride={ctaOverride?.body}
        supplyLandingHref={supplyLandingHref}
      />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="rp-section-title text-center text-lg">FAQs</h2>
        <dl className="mt-6 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rp-card p-5">
              <dt className="font-semibold text-[var(--brand-navy)]">{f.q}</dt>
              <dd className="mt-2 text-sm text-[var(--muted)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <h2 className="text-sm font-semibold text-[var(--brand-navy)]">Related links</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          <li>
            <Link
              href={supplyLandingHref}
              data-cta="supply-landing-link"
              data-cta-location="category-related"
              data-city={ctaCitySlug}
              data-area={ctaAreaSlug ?? ""}
              data-intent={ctaIntent}
              className="text-sm font-medium text-[var(--brand-orange)] hover:underline"
            >
              {supplyLinkLabel}
            </Link>
          </li>
          {spokes.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="text-sm text-[var(--brand-orange)] hover:underline">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <StickySeoCTA
        browseHref={mapHref}
        citySlug={ctaCitySlug}
        areaSlug={ctaAreaSlug}
        intent={ctaIntent}
        placeQuery={placeName}
      />
    </MarketingShell>
  );
}
