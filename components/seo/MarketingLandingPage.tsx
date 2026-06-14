import Link from "next/link";
import Image from "next/image";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import TrustStats from "@/components/seo/TrustStats";
import NationalFunnelCityGrid from "@/components/seo/NationalFunnelCityGrid";
import NationalFunnelGuides from "@/components/seo/NationalFunnelGuides";
import CitySeoBlogLinks from "@/components/seo/CitySeoBlogLinks";
import { getMdxPosts } from "@/lib/blog";
import { appPath } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";
import { PLAY_STORE_URL } from "@/lib/site-links";
import type { MarketingPageConfig } from "@/lib/seo/marketing-pages";
import {
  marketingLandingPlaceName,
  pickMarketingLandingBlogPosts,
} from "@/lib/seo/marketing-broker-blog-links";
import type { NationalFunnelKind } from "@/lib/seo/national-funnel-cities";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SeoSupplyBlocks from "@/components/seo/SeoSupplyBlocks";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import { intentFromMarketingSlug } from "@/lib/seo-links";
import PgCuOwnerSupplyBlock from "@/components/seo/PgCuOwnerSupplyBlock";

interface Props {
  config: MarketingPageConfig;
  showAppCta?: boolean;
  comparisonRows?: { feature: string; rentalpins: string; other: string }[];
  competitorName?: string;
  funnelKind?: NationalFunnelKind;
}

export default function MarketingLandingPage({
  config,
  showAppCta = false,
  comparisonRows,
  competitorName,
  funnelKind,
}: Props) {
  const pageUrl = canonicalUrl(`/${config.slug}`);
  const breadcrumbs = [
    { name: "Home", url: canonicalUrl("/") },
    { name: config.h1, url: pageUrl },
  ];
  const guidePlaceName = marketingLandingPlaceName(config.slug);
  const guideBlogPosts = guidePlaceName
    ? pickMarketingLandingBlogPosts(config.slug, getMdxPosts(), 3)
    : [];
  const supplyIntent = intentFromMarketingSlug(config.slug);

  return (
    <MarketingShell>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={config.faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <article className="rp-gradient-hero px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">{config.h1}</h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">{config.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={appPath("/search")} className="rp-btn rp-btn-primary px-6 py-2.5">
              Browse map
            </Link>
            <Link href={appPath("/post")} className="rp-btn rp-btn-secondary px-6 py-2.5">
              Post free
            </Link>
            {(showAppCta || config.slug.includes("app") || config.slug === "download-app") && (
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rp-btn border border-[var(--border)] px-6 py-2.5"
              >
                Google Play
              </a>
            )}
          </div>
        </div>
      </article>

      {config.slug !== "pg-near-chandigarh-university" ? (
        <ListPropertyCTA
          variant="hero"
          cityName={guidePlaceName ?? undefined}
          intent={supplyIntent}
        />
      ) : null}

      {funnelKind ? <NationalFunnelCityGrid kind={funnelKind} /> : null}
      {funnelKind ? <NationalFunnelGuides kind={funnelKind} /> : null}

      <TrustStats
        stats={[
          { label: "Total Listings", value: "10,000+" },
          { label: "Cities Covered", value: "15+" },
          { label: "Areas Covered", value: "150+" },
          { label: "Verified Listings", value: "95%+" },
          { label: "Active Users", value: "25,000+" },
          { label: "App Downloads", value: "50,000+" },
        ]}
      />

      {config.slug === "pg-near-chandigarh-university" ? (
        <PgCuOwnerSupplyBlock />
      ) : null}

      {config.benefits.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="rp-section-title text-xl">Benefits</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {config.benefits.map((b) => (
              <div key={b.title} className="rp-card p-5">
                <h3 className="font-semibold text-[var(--brand-navy)]">{b.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {config.benefits.length > 0 ? (
        <ListPropertyCTA
          variant="inline"
          cityName={guidePlaceName ?? undefined}
          intent={supplyIntent}
        />
      ) : null}

      {config.sections && config.sections.length > 0 && (
        <section
          aria-labelledby="marketing-seo-content-heading"
          className="mx-auto max-w-4xl px-4 py-12"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#E8501A]">
              No-broker rental guide
            </p>
            <h2
              id="marketing-seo-content-heading"
              className="mt-2 font-serif text-2xl font-bold text-[#1E3A6E] sm:text-3xl"
            >
              {config.h1} — search tips
            </h2>
            {config.sections.map((section) => (
              <div key={section.title} className="mt-10">
                <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
                  {section.title}
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
            {guidePlaceName && guideBlogPosts.length > 0 ? (
              <CitySeoBlogLinks placeName={guidePlaceName} posts={guideBlogPosts} />
            ) : null}
          </div>
        </section>
      )}

      {comparisonRows && comparisonRows.length > 0 && competitorName && (
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="rp-section-title text-xl">Feature comparison</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-3 pr-4 font-semibold text-[var(--brand-navy)]">Feature</th>
                  <th className="py-3 pr-4 font-semibold text-[var(--brand-orange)]">RentalPins</th>
                  <th className="py-3 font-semibold text-[var(--muted)]">{competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-[var(--border-subtle)]">
                    <td className="py-3 pr-4 font-medium">{row.feature}</td>
                    <td className="py-3 pr-4 text-[var(--brand-navy)]">{row.rentalpins}</td>
                    <td className="py-3 text-[var(--muted)]">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(showAppCta || config.slug.includes("app")) && (
        <section className="mx-auto max-w-4xl px-4 py-8 text-center">
          <div className="rp-card inline-flex flex-col items-center p-8">
            <Image src="/logo/logo.png" alt="RentalPins app" width={80} height={80} />
            <p className="mt-4 text-sm text-[var(--muted)]">Android app — same map & listings</p>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rp-btn rp-btn-primary mt-4 px-8 py-2.5"
            >
              Get it on Google Play
            </a>
          </div>
        </section>
      )}

      <SeoSupplyBlocks
        cityName={guidePlaceName ?? undefined}
        intent={supplyIntent}
        showHero={false}
        showInline={false}
        showSticky={false}
      />

      <ListPropertyCTA variant="bottom" cityName={guidePlaceName ?? undefined} intent={supplyIntent} />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="rp-section-title text-center text-lg">FAQs</h2>
        <dl className="mt-6 space-y-4">
          {config.faqs.map((f) => (
            <div key={f.q} className="rp-card p-5">
              <dt className="font-semibold text-[var(--brand-navy)]">{f.q}</dt>
              <dd className="mt-2 text-sm text-[var(--muted)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-sm font-semibold text-[var(--brand-navy)]">Related</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {config.relatedLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-[var(--brand-orange)] hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <StickySeoCTA intent={supplyIntent} placeQuery={guidePlaceName ?? undefined} />
    </MarketingShell>
  );
}
