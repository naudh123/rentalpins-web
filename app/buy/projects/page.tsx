import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { appPath, siteUrl } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getAllCities } from "@/lib/cities-config";
import {
  BUY_PROJECTS,
  buyProjectPath,
  getBuyProjectCitySlugs,
} from "@/lib/sale/buy-projects-config";

export const metadata: Metadata = buildPageMetadata({
  title: "New projects for sale | RentalPins Buy",
  description:
    "Explore new and upcoming real estate projects in Chandigarh Tricity — Mohali, Zirakpur, Panchkula, and Kharar. Compare price ranges and book site visits.",
  path: "/buy/projects",
});

export default function BuyProjectsIndexPage() {
  const faqs = buildConversationalFaqs("projects", {});

  return (
    <>
      <FAQSchema faqs={faqs} />
      <article className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
          RentalPins Buy
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)]">
          New projects for sale
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Developer projects with structured price ranges, amenities, and site visit CTAs — starting
          in Chandigarh Tricity.
        </p>

        <ul className="mt-8 space-y-4">
          {BUY_PROJECTS.map((p) => (
            <li key={p.slug} className="rounded-xl border border-[var(--border)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-serif text-xl">
                  <Link
                    href={appPath(buyProjectPath(p.citySlug, p.slug))}
                    className="hover:text-[var(--sale-gold)]"
                  >
                    {p.name}
                  </Link>
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    p.status === "selling"
                      ? "bg-[color-mix(in_srgb,var(--sale-gold)_15%,white)] text-[var(--brand-navy)]"
                      : "bg-[var(--bg)] text-[var(--muted)]"
                  }`}
                >
                  {p.status === "selling" ? "Selling now" : "Upcoming"}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {p.locality}, {p.cityName} · {p.priceRange}
              </p>
              <p className="mt-2 text-sm">{p.types.join(" · ")}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          {getBuyProjectCitySlugs().map((slug) => (
            <Link
              key={slug}
              href={appPath(`/buy/projects/${slug}`)}
              className="text-sm font-semibold text-[var(--sale-gold)] hover:underline"
            >
              Projects in {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={appPath("/buy/search")} className="rp-btn rp-btn-primary px-6 py-2.5">
            Browse resale on buy map
          </Link>
          <Link href={appPath("/developers")} className="rp-btn rp-btn-secondary px-6 py-2.5">
            Developers
          </Link>
        </div>

        <HubFaqSection faqs={faqs} className="mt-10" />
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "RentalPins Buy projects",
            url: `${siteUrl}${appPath("/buy/projects")}`,
          }),
        }}
      />
    </>
  );
}
