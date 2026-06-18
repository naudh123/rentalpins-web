import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { appPath, siteUrl } from "@/lib/config";

const DEVELOPERS: Record<
  string,
  { name: string; cities: string[]; projects: { name: string; city: string }[] }
> = {
  "tricity-builders": {
    name: "Tricity Builders",
    cities: ["Mohali", "Zirakpur", "Panchkula"],
    projects: [
      { name: "Green Valley Residences", city: "Mohali" },
      { name: "Tricity Heights", city: "Zirakpur" },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "developer-slug": string }>;
}): Promise<Metadata> {
  const { "developer-slug": slug } = await params;
  const dev = DEVELOPERS[slug];
  if (!dev) return { title: "Developer" };
  return buildPageMetadata({
    title: `${dev.name} | Developers`,
    description: `${dev.name} — projects in ${dev.cities.join(", ")}. Enquire about site visits and brochures on RentalPins.`,
    path: `/developers/${slug}`,
  });
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ "developer-slug": string }>;
}) {
  const { "developer-slug": slug } = await params;
  const dev = DEVELOPERS[slug];
  if (!dev) notFound();

  const faqs = buildConversationalFaqs("developers", {});
  const pageUrl = `${siteUrl}${appPath(`/developers/${slug}`)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dev.name,
    url: pageUrl,
    areaServed: dev.cities,
    description: `Real estate developer on RentalPins with projects in ${dev.cities.join(", ")}.`,
  };

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-[var(--muted)]">
          <Link href={appPath("/developers")}>Developers</Link> / {dev.name}
        </nav>
        <h1 className="mt-3 font-serif text-3xl">{dev.name}</h1>
        <p className="mt-2 text-[var(--muted)]">Cities served: {dev.cities.join(" · ")}</p>

        <section className="mt-8">
          <h2 className="font-serif text-xl">Projects</h2>
          <ul className="mt-3 space-y-2">
            {dev.projects.map((p) => (
              <li key={p.name} className="text-[var(--brand-navy)]">
                {p.name} — {p.city}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={appPath("/projects")} className="rp-btn rp-btn-primary px-6 py-2.5">
            View projects
          </Link>
          <Link href={appPath("/buy/search")} className="rp-btn rp-btn-secondary px-6 py-2.5">
            Browse buy map
          </Link>
        </div>

        <HubFaqSection faqs={faqs} className="mt-10" />
      </article>
    </MarketingShell>
  );
}
