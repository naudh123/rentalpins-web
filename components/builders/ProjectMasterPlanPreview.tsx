"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import { projectMasterPlanPath } from "@/lib/builders/project-paths";

interface ProjectMasterPlanPreviewProps {
  imageUrl: string;
  projectName: string;
  citySlug: string;
  projectSlug: string;
  unitCount: number;
}

export default function ProjectMasterPlanPreview({
  imageUrl,
  projectName,
  citySlug,
  projectSlug,
  unitCount,
}: ProjectMasterPlanPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--lux-shadow)]">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${projectName} master plan`}
          className="block w-full max-h-[420px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Interactive site map
          </p>
          <p className="mt-1 font-serif text-xl font-bold">
            Explore {unitCount > 0 ? `${unitCount} units` : "the master plan"} on map
          </p>
          <Link
            href={appPath(projectMasterPlanPath(citySlug, projectSlug))}
            className="mt-4 inline-block rounded-full bg-[var(--lux-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--lux-accent-text)] transition hover:opacity-90"
          >
            Open interactive master plan →
          </Link>
        </div>
      </div>
    </div>
  );
}
