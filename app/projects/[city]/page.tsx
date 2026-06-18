import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import { appPath } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityConfig = getCityBySlug(city);
  const name = cityConfig?.name ?? city;
  return buildPageMetadata({
    title: `Real estate projects in ${name}`,
    description: `Browse new and upcoming real estate projects in ${name}. Price ranges, amenities, and site visit enquiries on RentalPins.`,
    path: `/projects/${city}`,
  });
}

export default async function ProjectsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityConfig = getCityBySlug(city);
  if (!cityConfig || cityConfig.status !== "live") notFound();

  const faqs = buildConversationalFaqs("projects", { city: cityConfig.name });

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-3xl">Projects in {cityConfig.name}</h1>
        <p className="mt-4 text-[var(--muted)]">
          Explore developer launches and investment-focused projects in {cityConfig.name}. Project
          detail pages include amenities, price bands, and brochure CTAs.
        </p>
        <Link href={appPath("/projects")} className="mt-6 inline-block text-sm font-semibold text-[var(--brand-orange)] hover:underline">
          ← All projects
        </Link>
      </article>
    </MarketingShell>
  );
}
