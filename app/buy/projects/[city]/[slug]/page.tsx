import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import { appPath, siteUrl } from "@/lib/config";
import { buyProjectPath, getBuyProject } from "@/lib/sale/buy-projects-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getBuyProject(slug);
  if (!project) return { title: "Project | RentalPins Buy" };
  return buildPageMetadata({
    title: `${project.name} — ${project.locality}, ${project.cityName}`,
    description: `${project.name} in ${project.locality}, ${project.cityName}. ${project.priceRange}. ${project.types.join(", ")}. Enquire for brochure and site visit.`,
    path: buyProjectPath(project.citySlug, project.slug),
  });
}

export default async function BuyProjectDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const cityConfig = getCityBySlug(city);
  const project = getBuyProject(slug);
  if (!cityConfig || !project || project.citySlug !== city) notFound();

  const faqs = buildConversationalFaqs("projects", {
    city: project.cityName,
    locality: project.locality,
  });
  const pageUrl = `${siteUrl}${appPath(buyProjectPath(city, slug))}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: `${project.name} — ${project.types.join(", ")} in ${project.locality}, ${project.cityName}`,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      description: project.priceRange,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: project.locality,
      addressRegion: project.cityName,
    },
  };

  return (
    <>
      <FAQSchema faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-[var(--muted)]">
          <Link href={appPath("/buy/projects")}>Projects</Link> / {project.cityName} /{" "}
          {project.name}
        </nav>
        <h1 className="mt-3 font-serif text-3xl">{project.name}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {project.locality}, {project.cityName} · {project.priceRange}
        </p>

        <section className="mt-8">
          <h2 className="font-serif text-xl">Property types</h2>
          <p className="mt-2">{project.types.join(" · ")}</p>
        </section>

        <section className="mt-6">
          <h2 className="font-serif text-xl">Amenities</h2>
          <ul className="mt-2 list-inside list-disc text-[var(--muted)]">
            {project.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-serif text-xl">Investment notes</h2>
          <p className="mt-2 text-[var(--muted)]">{project.investmentNote}</p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={appPath("/buy/search")} className="rp-btn rp-btn-primary px-6 py-2.5">
            Book site visit
          </Link>
          <Link href={appPath(`/buy/${city}`)} className="rp-btn rp-btn-secondary px-6 py-2.5">
            Resale in {project.cityName}
          </Link>
        </div>

        <HubFaqSection faqs={faqs} className="mt-10" />
      </article>
    </>
  );
}
