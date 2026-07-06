import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import MasterPlanViewer from "@/components/builders/MasterPlanViewer";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";
import {
  BuilderLuxuryShell,
  LuxuryGlassPanel,
  LuxurySectionHeader,
  LuxurySubpageHero,
} from "@/components/builders/luxury/LuxuryUI";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getMasterPlan,
  getProjectBySlugAndCity,
  listUnitsForProject,
} from "@/lib/builders/builders-server";
import { projectPath, projectPlotsPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}): Promise<Metadata> {
  const { city, "project-slug": slug } = await params;
  const project = await getProjectBySlugAndCity(city, slug);
  if (!project) return { title: "Master Plan" };
  return buildPageMetadata({
    title: `${project.name} — Interactive Master Plan`,
    description:
      project.aiSearchSnippet ||
      `Explore the interactive master plan for ${project.name} in ${project.city}. Click plot markers to view availability, size, and price.`,
    path: `${projectPath(city, slug)}/master-plan`,
    keywords: project.seoKeywords?.length ? project.seoKeywords : undefined,
  });
}

export default async function ProjectMasterPlanPage({
  params,
}: {
  params: Promise<{ city: string; "project-slug": string }>;
}) {
  const { city, "project-slug": slug } = await params;
  const project = await getProjectBySlugAndCity(city, slug);
  if (!project) notFound();

  const [units, masterPlan] = await Promise.all([
    listUnitsForProject(project.id),
    getMasterPlan(project.id),
  ]);

  const imageUrl =
    masterPlan?.defaultImageUrl ||
    project.masterPlanImageUrl ||
    null;

  return (
    <MarketingShell>
      <BuilderLuxuryShell builderSlug={project.builderSlug} projectSlug={project.slug}>
        <LuxurySubpageHero
          breadcrumbs={[
            { label: project.name, href: appPath(projectPath(city, slug)) },
            { label: "Master Plan" },
          ]}
          title="Interactive Master Plan"
          description="Explore the layout — tap any plot marker for live availability, size, and pricing."
          badge="Interactive site map · Real-time status"
        />

        <div className="mx-auto max-w-6xl px-4 py-16">
          {imageUrl ? (
            <MasterPlanViewer
              imageUrl={imageUrl}
              angles={masterPlan?.angles}
              units={units}
              builderId={project.builderId}
              projectId={project.id}
              projectName={project.name}
            />
          ) : (
            <div className="lux-empty-state">
              <p className="font-serif text-xl font-bold text-[var(--lux-primary)]">
                Master plan preview
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                The interactive site map for {project.name} will be published shortly.
                Browse the plot inventory or enquire for a guided site visit.
              </p>
              <Link href={appPath(projectPlotsPath(city, slug))} className="lux-btn-gold mt-6 inline-flex">
                View Plot Inventory
              </Link>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href={appPath(projectPlotsPath(city, slug))} className="lux-btn-outline">
              View Inventory Table
            </Link>
            <Link href={appPath(projectPath(city, slug))} className="lux-btn-gold">
              Back to Project
            </Link>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <LuxurySectionHeader
              eyebrow="Reserve Your Plot"
              title="Enquire Now"
              description="Selected a plot? Share your details for a priority callback."
            />
            <LuxuryGlassPanel>
              <ProjectLeadForm
                builderId={project.builderId}
                projectId={project.id}
                source="master_plan"
                projectName={project.name}
              />
            </LuxuryGlassPanel>
          </div>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}
