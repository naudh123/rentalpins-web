import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import ComingSoonPlaceholder from "@/components/marketing/ComingSoonPlaceholder";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { appPath, siteUrl } from "@/lib/config";

export const metadata: Metadata = buildPageMetadata({
  title: "Developers | RentalPins Buy",
  description:
    "Showcase projects, capture qualified buyer leads, and reach serious property seekers on the RentalPins buy map.",
  path: "/developers",
  robots: { index: true, follow: true },
});

const DEVELOPERS = [
  {
    slug: "tricity-builders",
    name: "Tricity Builders",
    cities: ["Mohali", "Zirakpur", "Panchkula"],
    projects: 4,
  },
];

export default function DevelopersPage() {
  const faqs = buildConversationalFaqs("developers", {});

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentalPins Developer Network",
    url: `${siteUrl}${appPath("/developers")}`,
    description: "Developer marketplace on RentalPins Buy for project discovery and buyer leads.",
  };

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <ComingSoonPlaceholder
        eyebrow="RentalPins for developers"
        title="Developer marketplace"
        description="List projects, capture buyer leads, and reach serious property seekers through map-based discovery."
        primaryCta={{ label: "List property for sale", href: "/buy/post" }}
        secondaryCta={{ label: "Browse buy map", href: "/buy/search" }}
      />

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="font-serif text-2xl">Featured developers</h2>
        <ul className="mt-4 space-y-3">
          {DEVELOPERS.map((dev) => (
            <li key={dev.slug} className="rounded-xl border border-[var(--border)] p-4">
              <Link
                href={appPath(`/developers/${dev.slug}`)}
                className="font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-orange)]"
              >
                {dev.name}
              </Link>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {dev.projects} projects · {dev.cities.join(", ")}
              </p>
            </li>
          ))}
        </ul>
        <HubFaqSection faqs={faqs} className="mt-10" />
      </section>
    </MarketingShell>
  );
}
