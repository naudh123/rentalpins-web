import Link from "next/link";
import ListingsGrid from "@/components/ListingsGrid";
import FAQSchema from "@/components/seo/FAQSchema";
import StructuredData from "@/components/seo/StructuredData";
import { appPath } from "@/lib/config";
import { BUY_POST_PATH } from "@/lib/sale/buy-app-paths";
import {
  buyPagePath,
  type BuyPageConfig,
  saleMapSearchHref,
} from "@/lib/sale/buy-pages-config";
import type { SeoListingCard } from "@/lib/seo-listings";
import { canonicalUrl } from "@/lib/seo";

interface Props {
  page: BuyPageConfig;
  listings: SeoListingCard[];
}

export default function BuyLandingPage({ page, listings }: Props) {
  const path = buyPagePath(page.hubSlug, page.areaSlug);
  const pageUrl = canonicalUrl(path);
  const mapHref = appPath(
    saleMapSearchHref(
      page.mapCenter.lat,
      page.mapCenter.lng,
      page.mapZoom,
      page.placeQuery
    )
  );

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.headline,
          description: page.subhead,
          url: pageUrl,
        }}
      />
      <FAQSchema
        faqs={page.faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <section className="rp-gradient-hero border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            {page.eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-[var(--brand-navy)] md:text-5xl">
            {page.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">{page.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={mapHref} className="rp-btn rp-btn-primary px-6 py-3">
              View properties on map
            </Link>
            <Link href={appPath(BUY_POST_PATH)} className="rp-btn rp-btn-secondary px-6 py-3">
              List your property for sale
            </Link>
            {page.areaSlug && (
              <Link
                href={appPath(buyPagePath(page.hubSlug))}
                className="rp-btn rp-btn-secondary px-6 py-3"
              >
                All {page.cityName}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {page.highlights.map((h) => (
            <div key={h.title} className="rp-card p-5">
              <h2 className="font-serif text-lg text-[var(--brand-navy)]">{h.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {page.nearbyBuyAreas && page.nearbyBuyAreas.length > 0 && (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Nearby sale areas
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.nearbyBuyAreas.map((nearby) => (
                <Link
                  key={`${nearby.hubSlug}-${nearby.areaSlug ?? "hub"}`}
                  href={appPath(buyPagePath(nearby.hubSlug, nearby.areaSlug))}
                  className="rp-btn rp-btn-secondary px-4 py-2 text-sm"
                >
                  {nearby.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.nearbyBuyHubs && page.nearbyBuyHubs.length > 0 && (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              More Tricity sale hubs
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.nearbyBuyHubs.map((nearby) => (
                <Link
                  key={nearby.slug}
                  href={appPath(buyPagePath(nearby.slug))}
                  className="rp-btn rp-btn-secondary px-4 py-2 text-sm"
                >
                  {nearby.label}
                </Link>
              ))}
              <Link
                href={appPath("/flats-for-sale")}
                className="rp-btn rp-btn-secondary px-4 py-2 text-sm"
              >
                Flats for sale India
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[var(--border-subtle)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[var(--brand-navy)]">
                Properties for sale in {page.areaName}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Owner-direct listings — updated from the live sale map.
              </p>
            </div>
            <Link
              href={mapHref}
              className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline"
            >
              Open full map →
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="mt-6">
              <ListingsGrid
                listings={listings}
                areaName={page.areaName}
                transactionType="sale"
                hideHeader
              />
            </div>
          ) : (
            <div className="rp-card mt-6 p-8 text-center">
              <p className="font-medium text-[var(--brand-navy)]">
                Sale listings in {page.areaName} are growing.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Be among the first owners to list — or set a search alert on the map.
              </p>
              <Link href={appPath(BUY_POST_PATH)} className="rp-btn rp-btn-primary mt-6 inline-flex px-6 py-2.5">
                List for sale
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-serif text-xl text-[var(--brand-navy)]">Questions</h2>
        <dl className="mt-4 space-y-4">
          {page.faqs.map((f) => (
            <div key={f.q} className="rp-card p-5">
              <dt className="font-semibold text-[var(--brand-navy)]">{f.q}</dt>
              <dd className="mt-2 text-sm text-[var(--muted)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--sale-gold)_8%,var(--bg))]">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-serif text-2xl text-[var(--brand-navy)]">
            Ready to explore {page.areaName}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--muted)]">
            Private, map-first property discovery — built for buyers who value clarity and direct seller contact.
          </p>
          <Link href={mapHref} className="rp-btn rp-btn-primary mt-6 inline-flex px-8 py-3">
            Open sale map
          </Link>
        </div>
      </section>
    </>
  );
}
