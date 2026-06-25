import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import { appPath } from "@/lib/config";
import {
  buyProjectPath,
  getBuyProjectsForCity,
  getBuyProjectCitySlugs,
} from "@/lib/sale/buy-projects-config";

export function generateStaticParams() {
  return getBuyProjectCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityConfig = getCityBySlug(city);
  if (!cityConfig) return { title: "Projects | RentalPins Buy" };
  return buildPageMetadata({
    title: `Projects for sale in ${cityConfig.name} | RentalPins Buy`,
    description: `New and upcoming real estate projects in ${cityConfig.name}. Compare BHK options, amenities, and price ranges.`,
    path: `/buy/projects/${city}`,
  });
}

export default async function BuyProjectsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityConfig = getCityBySlug(city);
  if (!cityConfig || cityConfig.status !== "live") notFound();

  const projects = getBuyProjectsForCity(city);
  const faqs = buildConversationalFaqs("projects", { city: cityConfig.name });

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <nav className="text-sm text-[var(--muted)]">
        <Link href={appPath("/buy/projects")}>Projects</Link> / {cityConfig.name}
      </nav>
      <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)]">
        Projects for sale in {cityConfig.name}
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Developer inventory in {cityConfig.name} — compare configurations before a site visit.
      </p>

      {projects.length === 0 ? (
        <p className="mt-8 text-[var(--muted)]">No projects listed yet — check back soon.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {projects.map((p) => (
            <li key={p.slug} className="rounded-xl border border-[var(--border)] p-5">
              <h2 className="font-serif text-xl">
                <Link
                  href={appPath(buyProjectPath(p.citySlug, p.slug))}
                  className="hover:text-[var(--sale-gold)]"
                >
                  {p.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {p.locality} · {p.priceRange}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={appPath(`/buy/${city}`)}
        className="mt-8 inline-block text-sm font-semibold text-[var(--sale-gold)] hover:underline"
      >
        Browse resale in {cityConfig.name} →
      </Link>

      <HubFaqSection faqs={faqs} className="mt-10" />
    </article>
  );
}
