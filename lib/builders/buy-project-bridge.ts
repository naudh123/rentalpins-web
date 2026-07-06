import {
  getBuilderBySlug,
  getProjectBySlugAndCity,
} from "@/lib/builders/builders-server";
import { projectPath } from "@/lib/builders/project-paths";
import type { BuyProjectConfig } from "@/lib/sale/buy-projects-config";

/** Fallback builder slug when a static buy project has no linked developer. */
export const PLATFORM_BUY_BUILDER_SLUG = "rentalpins-desk";

export interface BuyProjectLeadTarget {
  builderId: string;
  projectId?: string;
  micrositePath: string | null;
}

/** Returns Firestore microsite path when a live project exists for this buy slug. */
export async function findMicrositeForBuyProject(
  citySlug: string,
  projectSlug: string
) {
  return getProjectBySlugAndCity(citySlug, projectSlug);
}

export function micrositePathForProject(citySlug: string, projectSlug: string) {
  return projectPath(citySlug, projectSlug);
}

/** Resolve builder/project ids for lead capture on static buy pages. */
export async function resolveBuyProjectLeadTarget(
  project: BuyProjectConfig
): Promise<BuyProjectLeadTarget> {
  const fsProject = await getProjectBySlugAndCity(project.citySlug, project.slug);
  if (fsProject) {
    return {
      builderId: fsProject.builderId,
      projectId: fsProject.id,
      micrositePath: micrositePathForProject(project.citySlug, project.slug),
    };
  }

  const builderSlug = project.developerSlug ?? PLATFORM_BUY_BUILDER_SLUG;
  const builder = await getBuilderBySlug(builderSlug);
  if (builder) {
    return {
      builderId: builder.id,
      projectId: undefined,
      micrositePath: null,
    };
  }

  return {
    builderId: builderSlug,
    projectId: undefined,
    micrositePath: null,
  };
}
