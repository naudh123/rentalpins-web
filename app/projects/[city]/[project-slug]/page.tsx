import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import { appPath, siteUrl } from "@/lib/config";

const PROJECTS: Record<string, {
  name: string;
  city: string;
  locality: string;
  priceRange: string;
  types: string[];
  amenities: string[];
  investmentNote: string;
}> = {
  "green-valley-residences": {
    name: "Green Valley Residences",
    city: "Mohali",
    locality: "New Chandigarh",
    priceRange: "₹45L – ₹1.2Cr",
    types: ["2 BHK", "3 BHK", "Penthouse"],
    amenities: ["Clubhouse", "Covered parking", "Power backup", "Landscaped gardens"],
    investmentNote:
      "Located near the New Chandigarh growth corridor with improving connectivity to Chandigarh and Mohali commercial hubs.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}): Promise<Metadata> {
  const { city, "project-slug": slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return { title: "Project" };
  return buildPageMetadata({
    title: `${project.name} — ${project.locality}, ${project.city}`,
    description: `${project.name} in ${project.locality}, ${project.city}. ${project.priceRange}. ${project.types.join(", ")}. Enquire for brochure and site visit.`,
    path: `/projects/${city}/${slug}`,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}) {
  const { city, "project-slug": slug } = await params;
  const cityConfig = getCityBySlug(city);
  const project = PROJECTS[slug];
  if (!cityConfig || !project) notFound();

  const faqs = buildConversationalFaqs("projects", { city: project.city, locality: project.locality });
  const pageUrl = `${siteUrl}${appPath(`/projects/${city}/${slug}`)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: `${project.name} — ${project.types.join(", ")} in ${project.locality}, ${project.city}`,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      description: project.priceRange,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: project.locality,
      addressRegion: project.city,
    },
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
          <Link href={appPath("/projects")}>Projects</Link> / {project.city} / {project.name}
        </nav>
        <h1 className="mt-3 font-serif text-3xl">{project.name}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {project.locality}, {project.city} · {project.priceRange}
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
          <Link href={appPath("/download-app")} className="rp-btn rp-btn-secondary px-6 py-2.5">
            Download brochure
          </Link>
        </div>

        <HubFaqSection faqs={faqs} className="mt-10" />
      </article>
    </MarketingShell>
  );
}
