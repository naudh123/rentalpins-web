import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import { canonicalUrl } from "@/lib/seo";
import { getBrowseHref, getListPropertyHref } from "@/lib/seo-links";
import {
  SUPPLY_LISTING_STEPS,
  type SupplyPageConfig,
} from "@/lib/supply-pages-config";

interface Props {
  config: SupplyPageConfig;
}

export default function SupplyLandingPage({ config }: Props) {
  const pageUrl = canonicalUrl(config.path);
  const browseHref = getBrowseHref({
    citySlug: config.citySlug,
    areaSlug: config.areaSlug,
    placeQuery: config.areaName ?? config.cityName,
    category: config.categorySlug,
  });
  const listHref = getListPropertyHref({
    citySlug: config.citySlug,
    areaSlug: config.areaSlug,
    intent: config.intent,
  });

  const breadcrumbs = [
    { name: "Home", url: canonicalUrl("/") },
    { name: config.h1, url: pageUrl },
  ];

  return (
    <MarketingShell>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={config.faq.map((f) => ({ question: f.q, answer: f.a }))} />

      <article className="rp-gradient-hero px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            For property owners
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">{config.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={listHref}
              data-cta="list-property-free"
              data-cta-location="hero"
              data-city={config.citySlug ?? ""}
              data-area={config.areaSlug ?? ""}
              data-intent={config.intent}
              className="rp-btn rp-btn-primary px-6 py-2.5"
            >
              List Property Free
            </Link>
            <Link
              href={browseHref}
              data-cta="browse-rentals-map"
              data-cta-location="hero"
              data-city={config.citySlug ?? ""}
              data-area={config.areaSlug ?? ""}
              data-intent={config.intent}
              className="rp-btn rp-btn-secondary px-6 py-2.5"
            >
              Browse Rentals on Map
            </Link>
          </div>
        </div>
      </article>

      <ListPropertyCTA
        variant="hero"
        cityName={config.cityName}
        areaName={config.areaName}
        intent={config.intent}
        browseHref={browseHref}
        listHref={listHref}
        citySlug={config.citySlug}
        areaSlug={config.areaSlug}
        headlineOverride={config.h1.endsWith("?") ? config.h1 : undefined}
        bodyOverride={config.intro}
      />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="rp-section-title text-xl">How to list on RentalPins</h2>
        <ol className="mt-6 space-y-4">
          {SUPPLY_LISTING_STEPS.map((step, index) => (
            <li key={step.title} className="rp-card flex gap-4 p-5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-sm font-bold text-white"
                aria-hidden
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-[var(--brand-navy)]">{step.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="rp-section-title text-xl">Supported listing types</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {config.supportedTypes.map((type) => (
            <li
              key={type}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]"
            >
              {type}
            </li>
          ))}
        </ul>
      </section>

      <ListPropertyCTA
        variant="inline"
        cityName={config.cityName}
        areaName={config.areaName}
        intent={config.intent}
        browseHref={browseHref}
        listHref={listHref}
        citySlug={config.citySlug}
        areaSlug={config.areaSlug}
      />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="rp-section-title text-center text-lg">FAQs</h2>
        <dl className="mt-6 space-y-4">
          {config.faq.map((f) => (
            <div key={f.q} className="rp-card p-5">
              <dt className="font-semibold text-[var(--brand-navy)]">{f.q}</dt>
              <dd className="mt-2 text-sm text-[var(--muted)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {config.nearbyLinks.length > 0 ? (
        <section className="mx-auto max-w-3xl px-4 pb-8">
          <h2 className="text-sm font-semibold text-[var(--brand-navy)]">Related rental pages</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {config.nearbyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--brand-orange)] hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ListPropertyCTA
        variant="bottom"
        cityName={config.cityName}
        areaName={config.areaName}
        intent={config.intent}
        browseHref={browseHref}
        listHref={listHref}
        citySlug={config.citySlug}
        areaSlug={config.areaSlug}
      />

      <StickySeoCTA
        browseHref={browseHref}
        listHref={listHref}
        citySlug={config.citySlug}
        areaSlug={config.areaSlug}
        intent={config.intent}
        placeQuery={config.areaName ?? config.cityName}
      />
    </MarketingShell>
  );
}
