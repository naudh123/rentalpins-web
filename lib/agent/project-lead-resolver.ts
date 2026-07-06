import {
  getProjectById,
  getProjectBySlugAndCity,
  listProjects,
} from "@/lib/builders/builders-server";

export interface ResolvedLeadProject {
  builderId: string;
  projectId: string | null;
  projectName: string | null;
  projectSlug: string | null;
  builderName: string | null;
  citySlug: string | null;
}

export async function resolveLeadProjectContext(opts: {
  projectId?: string | null;
  citySlug?: string | null;
  projectSlug?: string | null;
  interestedProjectName?: string | null;
}): Promise<ResolvedLeadProject | null> {
  if (opts.projectId) {
    const project = await getProjectById(opts.projectId);
    if (project) {
      return {
        builderId: project.builderId,
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        builderName: project.builderName,
        citySlug: project.citySlug,
      };
    }
  }

  if (opts.citySlug && opts.projectSlug) {
    const project = await getProjectBySlugAndCity(opts.citySlug, opts.projectSlug);
    if (project) {
      return {
        builderId: project.builderId,
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        builderName: project.builderName,
        citySlug: project.citySlug,
      };
    }
  }

  if (opts.interestedProjectName?.trim()) {
    const needle = opts.interestedProjectName.trim().toLowerCase();
    const pool = await listProjects(true);
    const project = pool.find((p) => p.name.toLowerCase().includes(needle));
    if (project) {
      return {
        builderId: project.builderId,
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        builderName: project.builderName,
        citySlug: project.citySlug,
      };
    }
  }

  const pool = await listProjects(true);
  if (pool.length === 0) return null;

  const cityMatch = opts.citySlug
    ? pool.find((p) => p.citySlug === opts.citySlug?.toLowerCase())
    : null;
  const fallback = cityMatch ?? pool[0];

  return {
    builderId: fallback.builderId,
    projectId: null,
    projectName: null,
    projectSlug: null,
    builderName: fallback.builderName,
    citySlug: opts.citySlug ?? fallback.citySlug,
  };
}
