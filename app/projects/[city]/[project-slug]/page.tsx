import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import ProjectMicrositeClient from "@/components/builders/ProjectMicrositeClient";
import BuyProjectDetailClient from "@/components/builders/BuyProjectDetailClient";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import {
  computeInventorySummary,
  resolveInventorySummary,
  findSimilarProjects,
  getBuilderById,
  getMasterPlan,
  getProjectBySlugAndCity,
  incrementProjectView,
  listProjectsForBuilder,
  listUnitsForProject,
} from "@/lib/builders/builders-server";
import {
  buildProjectJsonLd,
  buildProjectBreadcrumbs,
} from "@/lib/builders/project-schema";
import { resolveBuyProjectLeadTarget } from "@/lib/builders/buy-project-bridge";
import { getBuyProject } from "@/lib/sale/buy-projects-config";
import {
  projectPath,
} from "@/lib/builders/project-paths";
import { formatPriceRange } from "@/lib/builders/format";
import { appPath } from "@/lib/config";

const LEGACY_PROJECTS: Record<
  string,
  {
    name: string;
    city: string;
    locality: string;
    priceRange: string;
    types: string[];
    amenities: string[];
    investmentNote: string;
  }
> = {
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
  const fsProject = await getProjectBySlugAndCity(city, slug);
  if (fsProject) {
    return buildPageMetadata({
      title: fsProject.seoTitle || `${fsProject.name} — ${fsProject.city}`,
      description:
        fsProject.seoDescription ||
        fsProject.aiSearchSnippet ||
        `${fsProject.name} by ${fsProject.builderName}. ${formatPriceRange(fsProject.priceMin, fsProject.priceMax)}. Enquire for site visit.`,
      path: projectPath(city, slug),
      ogImage: fsProject.galleryUrls[0] || undefined,
      keywords: fsProject.seoKeywords?.length ? fsProject.seoKeywords : undefined,
    });
  }
  const legacy = LEGACY_PROJECTS[slug];
  if (!legacy) return { title: "Project" };
  return buildPageMetadata({
    title: `${legacy.name} — ${legacy.locality}, ${legacy.city}`,
    description: `${legacy.name} in ${legacy.locality}, ${legacy.city}. ${legacy.priceRange}. Enquire for brochure and site visit.`,
    path: `/projects/${city}/${slug}`,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}) {
  const { city, "project-slug": slug } = await params;
  const fsProject = await getProjectBySlugAndCity(city, slug);

  if (fsProject) {
    void incrementProjectView(fsProject.id);
    const [units, similarProjects, builder, masterPlan] = await Promise.all([
      listUnitsForProject(fsProject.id),
      findSimilarProjects(fsProject, 4),
      getBuilderById(fsProject.builderId),
      getMasterPlan(fsProject.id),
    ]);
    const builderProjects = builder
      ? await listProjectsForBuilder(builder.id, true)
      : [];
    const summary = resolveInventorySummary(fsProject, units);
    const faqs =
      fsProject.faqs.length > 0
        ? fsProject.faqs
        : buildConversationalFaqs("projects", { city: fsProject.city }).map((f) => ({
            question: f.question,
            answer: f.explanation ? `${f.directAnswer} ${f.explanation}` : f.directAnswer,
          }));
    const jsonLd = buildProjectJsonLd(fsProject);
    const breadcrumbs = buildProjectBreadcrumbs(fsProject);

    return (
      <MarketingShell>
        <BreadcrumbSchema items={breadcrumbs} />
        <FAQSchema faqs={faqs} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProjectMicrositeClient
          project={fsProject}
          summary={summary}
          faqs={faqs}
          units={units}
          similarProjects={similarProjects}
          builder={builder}
          builderProjectCount={builderProjects.length}
          masterPlanImageUrl={masterPlan?.defaultImageUrl ?? null}
        />
      </MarketingShell>
    );
  }

  // Legacy static fallback — try buy config for lead form + luxury shell
  const cityConfig = getCityBySlug(city);
  const legacy = LEGACY_PROJECTS[slug];
  if (!cityConfig || !legacy) notFound();

  const buyMatch = getBuyProject(slug);
  if (buyMatch && buyMatch.citySlug === city) {
    const leadTarget = await resolveBuyProjectLeadTarget(buyMatch);
    const faqs = buildConversationalFaqs("projects", {
      city: legacy.city,
      locality: legacy.locality,
    }).map((f) => ({
      question: f.question,
      answer: f.explanation ? `${f.directAnswer} ${f.explanation}` : f.directAnswer,
    }));

    return (
      <MarketingShell>
        <FAQSchema faqs={faqs} />
        <BuyProjectDetailClient project={buyMatch} leadTarget={leadTarget} faqs={faqs} />
      </MarketingShell>
    );
  }

  const faqs = buildConversationalFaqs("projects", {
    city: legacy.city,
    locality: legacy.locality,
  });

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-[var(--muted)]">
          <Link href={appPath("/projects")}>Projects</Link> / {legacy.city} / {legacy.name}
        </nav>
        <h1 className="mt-3 font-serif text-3xl">{legacy.name}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {legacy.locality}, {legacy.city} · {legacy.priceRange}
        </p>
        <section className="mt-8">
          <h2 className="font-serif text-xl">Property types</h2>
          <p className="mt-2">{legacy.types.join(" · ")}</p>
        </section>
        <section className="mt-6">
          <h2 className="font-serif text-xl">Amenities</h2>
          <ul className="mt-2 list-inside list-disc text-[var(--muted)]">
            {legacy.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={appPath("/buy/search")} className="rp-btn rp-btn-primary px-6 py-2.5">
            Book site visit
          </Link>
        </div>
        <HubFaqSection faqs={faqs} className="mt-10" />
      </article>
    </MarketingShell>
  );
}
