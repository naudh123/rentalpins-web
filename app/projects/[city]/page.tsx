import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import ProjectsIndexClient from "@/components/builders/ProjectsIndexClient";
import {
  BuilderLuxuryShell,
  LuxurySubpageHero,
} from "@/components/builders/luxury/LuxuryUI";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug } from "@/lib/cities-config";
import {
  getPublishedProjectBySlug,
  listProjectsByCity,
} from "@/lib/builders/builders-server";
import { projectPath } from "@/lib/builders/project-paths";
import { tricityCityLabel } from "@/lib/builders/tricity-cities";
import { appPath } from "@/lib/config";

async function resolveCityHub(city: string) {
  const cityConfig = getCityBySlug(city);
  const projects = await listProjectsByCity(city);

  if (cityConfig?.status === "live") {
    return {
      name: cityConfig.name,
      projects,
      indexable: true,
    };
  }

  if (projects.length > 0) {
    return {
      name: tricityCityLabel(city),
      projects,
      indexable: true,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const hub = await resolveCityHub(city);
  if (!hub) return { title: "Projects" };

  return buildPageMetadata({
    title: `Real estate projects in ${hub.name}`,
    description: `Browse new and upcoming real estate projects in ${hub.name}, Chandigarh Tricity. Price ranges, amenities, plot availability, and site visit enquiries on RentalPins.`,
    path: `/projects/${city}`,
    keywords: [
      `${hub.name} real estate projects`,
      `new projects ${hub.name}`,
      `${hub.name} plots for sale`,
      "Chandigarh Tricity projects",
      "RERA approved projects",
    ],
  });
}

export default async function ProjectsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  const hub = await resolveCityHub(city);
  if (!hub) {
    const project = await getPublishedProjectBySlug(city);
    if (project) {
      redirect(appPath(projectPath(project.citySlug, project.slug)));
    }
    notFound();
  }

  const faqs = buildConversationalFaqs("projects", { city: hub.name });

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <BuilderLuxuryShell>
        <LuxurySubpageHero
          breadcrumbs={[
            { label: "Projects", href: appPath("/projects") },
            { label: hub.name },
          ]}
          title={`Projects in ${hub.name}`}
          description="Handpicked developer launches with bespoke microsites, live plot inventory, and white-glove site-visit enquiries."
        />

        <div className="mx-auto max-w-6xl px-4 pb-16">
          {hub.projects.length > 0 ? (
            <ProjectsIndexClient
              projects={hub.projects}
              lockedCitySlug={city}
              lockedCityName={hub.name}
              showFeatured={false}
            />
          ) : (
            <p className="mt-8 text-sm text-[var(--muted)]">
              No published projects in {hub.name} yet.
            </p>
          )}

          <Link
            href={appPath("/projects")}
            className="lux-list-card-cta mt-10 inline-block hover:underline"
          >
            ← All Tricity projects
          </Link>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}
