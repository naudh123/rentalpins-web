"use client";

import Link from "next/link";
import {
  brandThemeToCssVars,
  getBrandTheme,
} from "@/lib/builders/brand-themes";
import { resolveProjectMedia } from "@/lib/builders/project-media";
import { formatPriceRange, formatSizeRange } from "@/lib/builders/format";
import type { BuilderProject } from "@/lib/types/builder-microsite";
import ProjectListingCardMedia from "@/components/builders/luxury/ProjectListingCardMedia";

interface FeaturedProjectCardProps {
  project: BuilderProject;
  href: string;
  rank?: number;
}

export default function FeaturedProjectCard({
  project,
  href,
  rank,
}: FeaturedProjectCardProps) {
  const theme = getBrandTheme(project.builderSlug, project.slug, project.builderName);
  const style = brandThemeToCssVars(theme);
  const media = resolveProjectMedia(
    project.slug,
    project.builderSlug,
    project.builderName,
    project.galleryUrls[0],
    project.galleryUrls
  );
  const hasVirtualTour = !!project.virtualTourUrl?.trim();

  return (
    <li className="lux-featured-card h-full" style={style} data-brand={theme.id}>
      <Link href={href} className="group flex h-full flex-col overflow-hidden sm:flex-row">
        <div className="lux-featured-card-media relative aspect-[16/10] shrink-0 sm:aspect-auto sm:w-[42%] sm:min-h-[14rem]">
          <ProjectListingCardMedia
            imageUrl={media.heroUrl}
            logoUrl={media.logoUrl}
            projectName={project.name}
            builderName={project.builderName}
            theme={theme}
          />
          {rank != null && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Featured #{rank}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <p className="lux-eyebrow">{theme.heroEyebrow}</p>
          <h3 className="mt-1 font-serif text-xl font-bold tracking-tight text-[var(--lux-primary)] sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
            {project.builderName} · {project.city}
            {project.availableUnits > 0 && project.availableUnits <= 5
              ? ` · ${project.availableUnits} left`
              : ""}
            {hasVirtualTour ? " · 360° Tour" : ""}
          </p>
          <p className="lux-list-card-price mt-3 text-sm sm:text-base">
            {formatPriceRange(project.priceMin, project.priceMax)}
            {(project.sizeMin != null || project.sizeMax != null) && (
              <span className="font-normal text-[var(--muted)]">
                {" · "}
                {formatSizeRange(project.sizeMin, project.sizeMax, project.sizeUnit)}
              </span>
            )}
          </p>
          {project.amenities.length > 0 && (
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
              {project.amenities.slice(0, 5).join(" · ")}
            </p>
          )}
          <p className="lux-list-card-cta mt-auto pt-4">Explore project →</p>
        </div>
      </Link>
    </li>
  );
}
