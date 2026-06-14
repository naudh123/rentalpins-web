import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import CommercialFAQ from "@/components/seo/commercial/CommercialFAQ";
import CommercialAreaLinks from "@/components/seo/commercial/CommercialAreaLinks";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SupplyAudienceSection from "@/components/seo/SupplyAudienceSection";
import AreaSupplyDemandSection from "@/components/seo/AreaSupplyDemandSection";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import {
  COMMERCIAL_LONDON_OPENING_NOTICE,
  commercialLondonHubPath,
  commercialLondonMapHref,
  commercialLondonPostHref,
  type CommercialLondonAreaConfig,
  type CommercialLondonHubConfig,
} from "@/lib/commercial-london-config";
import { appPath } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";

type PageConfig = CommercialLondonHubConfig | CommercialLondonAreaConfig;

function isAreaConfig(
  config: PageConfig
): config is CommercialLondonAreaConfig {
  return "nearbyAreas" in config;
}

interface Props {
  config: PageConfig;
}

export default function CommercialLandingPage({ config }: Props) {
  const isArea = isAreaConfig(config);
  const areaSlug = isArea ? config.slug : "london";
  const pagePath = isArea
    ? `/commercial/london/${config.slug}`
    : commercialLondonHubPath();
  const pageUrl = canonicalUrl(pagePath);

  const breadcrumbs = isArea
    ? [
        { name: "Home", url: canonicalUrl("/") },
        { name: "Commercial London", url: canonicalUrl(commercialLondonHubPath()) },
        { name: config.locationName, url: pageUrl },
      ]
    : [
        { name: "Home", url: canonicalUrl("/") },
        { name: config.h1, url: pageUrl },
      ];

  const browseHref = commercialLondonMapHref(config);
  const postHref = commercialLondonPostHref();

  return (
    <MarketingShell>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={config.faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <article className="rp-gradient-hero px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            UK commercial validation
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
            {config.intro}
          </p>

          <div
            role="status"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
          >
            {COMMERCIAL_LONDON_OPENING_NOTICE}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={postHref}
              id="uk-commercial-list-property"
              data-cta="uk-commercial-list-property"
              data-area={areaSlug}
              className="rp-btn rp-btn-primary px-6 py-2.5"
            >
              List Your Commercial Property Free
            </Link>
            <Link
              href={browseHref}
              id="uk-commercial-browse-map"
              data-cta="uk-commercial-browse-map"
              data-area={areaSlug}
              className="rp-btn rp-btn-secondary px-6 py-2.5"
            >
              Browse Commercial Rentals on Map
            </Link>
          </div>
        </div>
      </article>

      <ListPropertyCTA
        variant="hero"
        cityName="London"
        areaName={config.locationName}
        intent="commercial"
        citySlug="london"
        areaSlug={areaSlug}
        browseHref={browseHref}
        listHref={postHref}
      />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="rp-section-title text-xl">Property types we support</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {config.propertyTypes.map((type) => (
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
        intent="commercial"
        citySlug="london"
        areaSlug={areaSlug}
        listHref={postHref}
      />

      <CommercialAreaLinks
        currentSlug={isArea ? config.slug : undefined}
        nearbyAreas={isArea ? config.nearbyAreas : undefined}
      />

      <AreaSupplyDemandSection
        cityName="London"
        areaName={config.locationName}
        nearbyAreas={isArea ? config.nearbyAreas : config.featuredAreas}
        rentalTypes={config.propertyTypes}
        lowListings
        intent="commercial"
        citySlug="london"
        areaSlug={areaSlug}
        browseHref={browseHref}
        listHref={postHref}
      />

      <CommercialFAQ faqs={config.faqs} />

      <ListPropertyCTA
        variant="inline"
        cityName="London"
        areaName={config.locationName}
        intent="commercial"
        citySlug="london"
        areaSlug={areaSlug}
        browseHref={browseHref}
        listHref={postHref}
      />

      <ListPropertyCTA
        variant="bottom"
        cityName="London"
        areaName={config.locationName}
        intent="commercial"
        citySlug="london"
        areaSlug={areaSlug}
        browseHref={browseHref}
        listHref={postHref}
      />

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center shadow-sm">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">
            Ready to list in {config.locationName}?
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Free owner listings while we validate London commercial demand.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href={postHref}
              data-cta="uk-commercial-list-property"
              data-area={areaSlug}
              className="rp-btn rp-btn-primary px-6 py-2.5"
            >
              List Your Commercial Property Free
            </Link>
            <Link
              href={appPath("/rentals")}
              className="rp-btn rp-btn-secondary px-6 py-2.5"
            >
              India rental hubs
            </Link>
          </div>
        </div>
      </section>

      <StickySeoCTA
        browseHref={browseHref}
        listHref={postHref}
        citySlug="london"
        areaSlug={areaSlug}
        intent="commercial"
        placeQuery={config.placeQuery}
      />
    </MarketingShell>
  );
}
