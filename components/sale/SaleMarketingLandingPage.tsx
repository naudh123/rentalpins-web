import Link from "next/link";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { appPath } from "@/lib/config";
import { BUY_POST_PATH, BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { canonicalUrl } from "@/lib/seo";
import type { MarketingPageConfig } from "@/lib/seo/marketing-pages";
import type { SaleFunnelKind } from "@/lib/sale/sale-funnel-cities";
import {
  getSaleFunnelCities,
  saleFunnelSectionIntro,
  saleFunnelSectionTitle,
} from "@/lib/sale/sale-funnel-cities";

interface Props {
  config: MarketingPageConfig;
  funnelKind?: SaleFunnelKind;
}

export default function SaleMarketingLandingPage({ config, funnelKind }: Props) {
  const pageUrl = canonicalUrl(`/${config.slug}`);
  const breadcrumbs = [
    { name: "Home", url: canonicalUrl("/") },
    { name: "Buy", url: canonicalUrl("/buy") },
    { name: config.h1, url: pageUrl },
  ];
  const saleMapHref = appPath(BUY_SEARCH_PATH);
  const listHref = appPath(BUY_POST_PATH);

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={config.faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <article className="rp-gradient-hero px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            RentalPins Buy
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">{config.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={saleMapHref} className="rp-btn rp-btn-primary px-6 py-2.5">
              Browse sale map
            </Link>
            <Link href={listHref} className="rp-btn rp-btn-secondary px-6 py-2.5">
              List for sale
            </Link>
          </div>
        </div>
      </article>

      {funnelKind && (
        <section className="border-y border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-[var(--brand-navy)]">
              {saleFunnelSectionTitle(funnelKind)}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              {saleFunnelSectionIntro(funnelKind)}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getSaleFunnelCities(funnelKind).map((city) => (
                <article key={city.name} className="rp-card flex flex-col p-5">
                  <h3 className="font-serif text-lg font-bold text-[var(--brand-navy)]">
                    {city.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {city.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={city.primaryHref}
                      className="rp-btn rp-btn-primary px-4 py-2 text-xs sm:text-sm"
                    >
                      {city.primaryLabel}
                    </Link>
                    {city.buyHubHref && city.buyHubHref !== city.primaryHref && (
                      <Link
                        href={city.buyHubHref}
                        className="rp-btn rp-btn-secondary px-4 py-2 text-xs sm:text-sm"
                      >
                        Buy hub
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {config.benefits.length > 0 && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-[var(--brand-navy)]">Why RentalPins Buy</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.benefits.map((b) => (
                <div key={b.title} className="rp-card p-5">
                  <h3 className="font-semibold text-[var(--brand-navy)]">{b.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {config.relatedLinks.length > 0 && (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Related
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {config.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rp-btn rp-btn-secondary px-4 py-2 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--sale-gold)_8%,var(--bg))] px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl text-[var(--brand-navy)]">
            Ready to explore sale listings?
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Owner-direct property on a curated map — Chandigarh Tricity first.
          </p>
          <Link href={saleMapHref} className="rp-btn rp-btn-primary mt-6 inline-flex px-8 py-3">
            Open sale map
          </Link>
        </div>
      </section>
    </>
  );
}
