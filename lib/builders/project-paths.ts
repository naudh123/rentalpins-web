import { appPath } from "@/lib/config";

export function builderPath(slug: string): string {
  return appPath(`/builders/${slug}`);
}

export function projectPath(citySlug: string, projectSlug: string): string {
  return appPath(`/projects/${citySlug}/${projectSlug}`);
}

export function projectPlotsPath(citySlug: string, projectSlug: string): string {
  return appPath(`/projects/${citySlug}/${projectSlug}/plots`);
}

export function projectMasterPlanPath(
  citySlug: string,
  projectSlug: string
): string {
  return appPath(`/projects/${citySlug}/${projectSlug}/master-plan`);
}

export function projectVanityPath(projectSlug: string): string {
  return appPath(`/projects/${projectSlug}`);
}
