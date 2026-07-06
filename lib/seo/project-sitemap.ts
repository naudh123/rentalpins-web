import {
  listBuilders,
  listProjects,
} from "@/lib/builders/builders-server";
import {
  builderPath,
  projectMasterPlanPath,
  projectPath,
  projectPlotsPath,
} from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { Builder, BuilderProject, ProjectType } from "@/lib/types/builder-microsite";
import { type SitemapUrlEntry, toSitemapEntry } from "@/lib/seo/sitemap-xml";

const PLOT_INVENTORY_TYPES: ProjectType[] = ["plots", "mixed-use"];

function formatLastmod(ms: number): string {
  return new Date(ms > 0 ? ms : Date.now()).toISOString();
}

/** Pure builder for tests — maps published builders/projects to sitemap URL entries. */
export function buildProjectSitemapEntries(
  projects: BuilderProject[],
  builders: Builder[]
): SitemapUrlEntry[] {
  const urls: SitemapUrlEntry[] = [];
  const seen = new Set<string>();

  const add = (
    path: string,
    opts: Omit<SitemapUrlEntry, "loc"> = {}
  ): void => {
    if (seen.has(path)) return;
    seen.add(path);
    urls.push(toSitemapEntry(path, opts));
  };

  for (const builder of builders) {
    add(builderPath(builder.slug), {
      lastmod: formatLastmod(builder.updatedAtMs),
      changefreq: "weekly",
      priority: 0.66,
    });
  }

  const citySlugs = new Set<string>();

  for (const project of projects) {
    citySlugs.add(project.citySlug);
    const lastmod = formatLastmod(project.updatedAtMs);
    const { citySlug, slug } = project;

    add(projectPath(citySlug, slug), {
      lastmod,
      changefreq: "weekly",
      priority: 0.72,
    });

    if (PLOT_INVENTORY_TYPES.includes(project.projectType)) {
      add(projectPlotsPath(citySlug, slug), {
        lastmod,
        changefreq: "weekly",
        priority: 0.68,
      });
    }

    if (project.masterPlanImageUrl) {
      add(projectMasterPlanPath(citySlug, slug), {
        lastmod,
        changefreq: "monthly",
        priority: 0.65,
      });
    }
  }

  for (const slug of [...citySlugs].sort()) {
    add(appPath(`/projects/${slug}`), {
      changefreq: "weekly",
      priority: 0.68,
    });
  }

  return urls;
}

export async function fetchProjectSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const [projects, builders] = await Promise.all([
    listProjects(true),
    listBuilders(true),
  ]);
  return buildProjectSitemapEntries(projects, builders);
}
