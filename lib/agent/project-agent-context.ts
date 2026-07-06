import {
  resolveInventorySummary,
  findSimilarProjects,
  getBuilderById,
  getProjectById,
  getProjectBySlugAndCity,
  listProjects,
  listUnitsForProject,
} from "@/lib/builders/builders-server";
import type { ProjectAgentBundle } from "@/lib/agent/project-agent-knowledge";
import type { BuilderProject } from "@/lib/types/builder-microsite";

export async function loadProjectAgentBundle(
  projectId: string
): Promise<ProjectAgentBundle | null> {
  const project = await getProjectById(projectId);
  if (!project || !project.isPublished) return null;

  const [units, builder, similarProjects] = await Promise.all([
    listUnitsForProject(projectId),
    getBuilderById(project.builderId),
    findSimilarProjects(project, 4),
  ]);

  const available = units.filter((u) => u.status === "available");
  const sampleUnits = available.length > 0 ? available.slice(0, 12) : units.slice(0, 8);

  return {
    project,
    builder,
    summary: resolveInventorySummary(project, units),
    sampleUnits,
    allUnits: units,
    similarProjects,
  };
}

export async function loadProjectAgentBundleBySlug(
  citySlug: string,
  projectSlug: string
): Promise<ProjectAgentBundle | null> {
  const project = await getProjectBySlugAndCity(citySlug, projectSlug);
  if (!project) return null;
  return loadProjectAgentBundle(project.id);
}

export async function loadPublishedProjectsPool(citySlug?: string): Promise<BuilderProject[]> {
  const all = await listProjects(true);
  if (!citySlug) return all;
  return all.filter((p) => p.citySlug === citySlug.toLowerCase());
}

/** Full published catalog for agent tools and index context. */
export async function loadProjectCatalogForAgent(citySlug?: string): Promise<BuilderProject[]> {
  return loadPublishedProjectsPool(citySlug);
}
