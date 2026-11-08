import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import FAQSchema from "@/components/seo/FAQSchema";
import MarketingShell from "@/components/MarketingShell";
import BuyProjectDetailClient from "@/components/builders/BuyProjectDetailClient";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import { appPath, siteUrl } from "@/lib/config";
import {
  findMicrositeForBuyProject,
  micrositePathForProject,
  resolveBuyProjectLeadTarget,
} from "@/lib/builders/buy-project-bridge";
import { buyProjectPath, getBuyProject } from "@/lib/sale/buy-projects-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getBuyProject(slug);
  if (!project) return { title: "Project" };
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

  const fsProject = await findMicrositeForBuyProject(city, slug);
  if (fsProject) {
    permanentRedirect(appPath(micrositePathForProject(city, slug)));
  }

  const [leadTarget, faqs] = await Promise.all([
    resolveBuyProjectLeadTarget(project),
    Promise.resolve(
      buildConversationalFaqs("projects", {
        city: project.cityName,
        locality: project.locality,
      }).map((f) => ({
        question: f.question,
        answer: f.explanation ? `${f.directAnswer} ${f.explanation}` : f.directAnswer,
      }))
    ),
  ]);

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
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BuyProjectDetailClient project={project} leadTarget={leadTarget} faqs={faqs} />
      <nav className="mx-auto max-w-3xl px-4 pb-8 text-center text-sm text-[var(--muted)]">
        <Link href={appPath("/buy/projects")} className="hover:underline">
          ← All buy projects
        </Link>
      </nav>
    </MarketingShell>
  );
}
