import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import InventorySummaryCards from "@/components/builders/InventorySummaryCards";
import ProjectInventoryTable from "@/components/builders/ProjectInventoryTable";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";
import {
  BuilderLuxuryShell,
  LuxuryGlassPanel,
  LuxurySectionHeader,
  LuxurySubpageHero,
} from "@/components/builders/luxury/LuxuryUI";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  resolveInventorySummary,
  getProjectBySlugAndCity,
  listUnitsForProject,
} from "@/lib/builders/builders-server";
import { projectPath, projectMasterPlanPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}): Promise<Metadata> {
  const { city, "project-slug": slug } = await params;
  const project = await getProjectBySlugAndCity(city, slug);
  if (!project) return { title: "Plots" };
  return buildPageMetadata({
    title: `${project.name} — Plot Inventory`,
    description:
      project.aiSearchSnippet ||
      `Browse available plots at ${project.name} in ${project.city}. Filter by size, price, and facing. Enquire for site visit.`,
    path: `${projectPath(city, slug)}/plots`,
    keywords: project.seoKeywords?.length ? project.seoKeywords : undefined,
  });
}

export default async function ProjectPlotsPage({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}) {
  const { city, "project-slug": slug } = await params;
  const project = await getProjectBySlugAndCity(city, slug);
  if (!project) notFound();

  const units = await listUnitsForProject(project.id);
  const summary = resolveInventorySummary(project, units);

  return (
    <MarketingShell>
      <BuilderLuxuryShell builderSlug={project.builderSlug} projectSlug={project.slug}>
        <LuxurySubpageHero
          breadcrumbs={[
            { label: project.name, href: appPath(projectPath(city, slug)) },
            { label: "Plot Inventory" },
          ]}
          title="Plot Inventory"
          description={`Exclusive plot register for ${project.name} · ${project.city}. Filter by size, facing, and price — enquire for a private site visit.`}
          badge="Live inventory · Concierge verified"
        />

        <div className="mx-auto max-w-6xl px-4 py-16">
          <LuxurySectionHeader
            eyebrow="At a Glance"
            title="Availability Summary"
          />
          <div className="mt-8">
            <InventorySummaryCards summary={summary} />
          </div>

          <div className="mt-14">
            <LuxurySectionHeader
              eyebrow="Full Register"
              title="All Plots"
              description="Live inventory updated by the developer."
            />
            <div className="mt-8">
              <ProjectInventoryTable units={units} />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href={appPath(projectMasterPlanPath(city, slug))} className="lux-btn-outline">
              View Master Plan
            </Link>
            <Link href={appPath(projectPath(city, slug))} className="lux-btn-gold">
              Back to Project
            </Link>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <LuxurySectionHeader
              eyebrow="Private Enquiry"
              title="Interested in a plot?"
              description="Tell us your preferences and we'll match you with the right unit."
            />
            <LuxuryGlassPanel>
              <ProjectLeadForm
                builderId={project.builderId}
                projectId={project.id}
                source="project_page"
                projectName={project.name}
              />
            </LuxuryGlassPanel>
          </div>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}
