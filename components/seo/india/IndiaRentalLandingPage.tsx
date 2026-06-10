import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import IndiaRentalAreaLinks from "@/components/seo/india/IndiaRentalAreaLinks";
import IndiaRentalFAQ from "@/components/seo/india/IndiaRentalFAQ";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SupplyAudienceSection from "@/components/seo/SupplyAudienceSection";
import AreaSupplyDemandSection from "@/components/seo/AreaSupplyDemandSection";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import MohaliGscHubLinks from "@/components/seo/MohaliGscHubLinks";
import {
  INDIAN_RENTAL_GROWTH_NOTICE,
  indianRentalMapHref,
  indianRentalPagePath,
  indianRentalPostHref,
  type RentalAreaPageConfig,
} from "@/lib/rental-area-config";
import { appPath } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";

interface Props {
  config: RentalAreaPageConfig;
}

export default function IndiaRentalLandingPage({ config }: Props) {
  const pagePath = indianRentalPagePath(config.hubSlug, config.areaSlug);
  const pageUrl = canonicalUrl(pagePath);
  const ctaArea = config.areaSlug ?? config.hubSlug;
  const isAreaPage = Boolean(config.areaSlug);
  const browseHref = indianRentalMapHref(config);
  const listHref = indianRentalPostHref();

  const breadcrumbs = config.areaSlug
    ? [
        { name: "Home", url: canonicalUrl("/") },
        {
          name: config.cityLabel,
          url: canonicalUrl(indianRentalPagePath(config.hubSlug)),
        },
        { name: config.areaName, url: pageUrl },
      ]
    : [
        { name: "Home", url: canonicalUrl("/") },
        { name: config.h1, url: pageUrl },
      ];

  return (
    <MarketingShell>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={config.faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <article className="rp-gradient-hero px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            India rentals · map-first search
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
            {config.intro}
          </p>

          <div
            role="status"
            className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950"
          >
            {INDIAN_RENTAL_GROWTH_NOTICE}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={indianRentalMapHref(config)}
              id="india-browse-map"
              data-cta="india-browse-map"
              data-city={config.citySlug}
              data-area={ctaArea}
              className="rp-btn rp-btn-primary px-6 py-2.5"
            >
              Browse Rentals on Map
            </Link>
            <Link
              href={indianRentalPostHref()}
              id="india-list-property"
              data-cta="india-list-property"
              data-city={config.citySlug}
              data-area={ctaArea}
              className="rp-btn rp-btn-secondary px-6 py-2.5"
            >
              List Your Property Free
            </Link>
          </div>
        </div>
      </article>

      <ListPropertyCTA
        variant="hero"
        cityName={config.cityLabel}
        areaName={isAreaPage ? config.areaName : undefined}
        citySlug={config.citySlug}
        areaSlug={ctaArea}
        browseHref={browseHref}
        listHref={listHref}
      />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="rp-section-title text-xl">Rental types in {config.areaName}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {config.rentalTypes.map((type) => (
            <li
              key={type}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]"
            >
              {type}
            </li>
          ))}
        </ul>
      </section>

      <SupplyAudienceSection
        citySlug={config.citySlug}
        areaSlug={ctaArea}
        listHref={listHref}
      />

      <IndiaRentalAreaLinks
        nearbyAreas={config.nearbyAreas}
        currentHub={config.hubSlug}
        currentArea={config.areaSlug}
      />

      {config.hubSlug === "mohali" ? (
        <MohaliGscHubLinks title="Mohali area & sector guides" />
      ) : null}

      <AreaSupplyDemandSection
        cityName={config.cityLabel}
        areaName={config.areaName}
        nearbyAreas={config.nearbyAreas.map((a) => a.label)}
        rentalTypes={config.rentalTypes}
        lowListings
        citySlug={config.citySlug}
        areaSlug={ctaArea}
        browseHref={browseHref}
        listHref={listHref}
      />

      <IndiaRentalFAQ faqs={config.faqs} />

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center shadow-sm">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">
            List or search in {config.areaName}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Owner-direct rentals on the map — no tenant search commission.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href={indianRentalMapHref(config)}
              data-cta="india-browse-map"
              data-city={config.citySlug}
              data-area={ctaArea}
              className="rp-btn rp-btn-primary px-6 py-2.5"
            >
              Browse Rentals on Map
            </Link>
            {config.legacyAreaPath ? (
              <Link
                href={appPath(config.legacyAreaPath)}
                className="rp-btn rp-btn-secondary px-6 py-2.5"
              >
                Full area hub
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <StickySeoCTA
        browseHref={browseHref}
        listHref={listHref}
        citySlug={config.citySlug}
        areaSlug={ctaArea}
        placeQuery={config.placeQuery}
      />
    </MarketingShell>
  );
}
