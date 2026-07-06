"use client";

import ProjectListingCard from "@/components/builders/luxury/ProjectListingCard";
import { LuxurySectionHeader } from "@/components/builders/luxury/LuxuryUI";
import { appPath } from "@/lib/config";
import { projectPath } from "@/lib/builders/project-paths";
import type { BuilderProject } from "@/lib/types/builder-microsite";

interface ProjectSimilarCarouselProps {
  projects: BuilderProject[];
  currentProjectId: string;
}

export default function ProjectSimilarCarousel({
  projects,
  currentProjectId,
}: ProjectSimilarCarouselProps) {
  const items = projects.filter((p) => p.id !== currentProjectId);
  if (items.length === 0) return null;

  return (
    <section>
      <LuxurySectionHeader
        eyebrow="Explore More"
        title="Similar Projects You May Like"
        description="Hand-picked developments in the same city and price band."
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <ProjectListingCard
            key={p.id}
            project={p}
            href={appPath(projectPath(p.citySlug, p.slug))}
          />
        ))}
      </ul>
    </section>
  );
}
