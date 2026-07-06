import Link from "next/link";
import {
  brandThemeToCssVars,
  getBrandTheme,
} from "@/lib/builders/brand-themes";
import { resolveProjectMedia } from "@/lib/builders/project-media";
import {
  formatPriceRange,
  formatSizeRange,
} from "@/lib/builders/format";
import type { BuilderProject } from "@/lib/types/builder-microsite";
import ProjectListingCardMedia from "@/components/builders/luxury/ProjectListingCardMedia";

const PROJECT_TYPE_LABELS: Record<string, string> = {
  plots: "Plots",
  apartments: "Apartments",
  villas: "Villas",
  commercial: "Commercial",
  industrial: "Industrial",
  "mixed-use": "Mixed use",
};

interface ProjectListingCardProps {
  project: BuilderProject;
  href: string;
  featured?: boolean;
}

export default function ProjectListingCard({
  project,
  href,
  featured = false,
}: ProjectListingCardProps) {
  const theme = getBrandTheme(project.builderSlug, project.slug, project.builderName);
  const style = brandThemeToCssVars(theme);
  const media = resolveProjectMedia(
    project.slug,
    project.builderSlug,
    project.builderName,
    project.galleryUrls[0],
    project.galleryUrls
  );
  const typeLabel = PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType;
  const hasVirtualTour = !!project.virtualTourUrl?.trim();
  const availability =
    project.availableUnits > 0
      ? project.availableUnits <= 5
        ? `${project.availableUnits} left`
        : `${project.availableUnits} available`
      : project.totalUnits > 0
        ? "Sold out"
        : null;

  return (
    <li className="lux-list-card h-full" style={style} data-brand={theme.id}>
      <Link href={href} className="group flex h-full flex-col">
        <div className="lux-list-card-accent" aria-hidden />

        {/* Mobile: stacked layout · Desktop: horizontal */}
        <div className="flex min-h-0 flex-1 flex-col sm:flex-row sm:items-stretch">
          <div className="lux-list-card-media relative aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:min-h-[11rem] sm:w-44 sm:self-stretch md:w-52 lg:w-60">
            <div className="h-full sm:absolute sm:inset-0">
              <ProjectListingCardMedia
                imageUrl={media.heroUrl}
                logoUrl={media.logoUrl}
                projectName={project.name}
                builderName={project.builderName}
                theme={theme}
              />
            </div>
            {featured && (
              <span className="absolute right-2 top-2 z-10 rounded-full bg-[var(--lux-accent)] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[var(--lux-accent-text,var(--lux-primary-deep))] shadow-sm">
                Featured
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="lux-list-card-badge">{typeLabel}</span>
              <span className="lux-list-card-badge capitalize">
                {project.status.replace("-", " ")}
              </span>
              {availability && (
                <span className="lux-list-card-badge !border-amber-300 !bg-amber-50 !text-amber-900">
                  {availability}
                </span>
              )}
              {hasVirtualTour && (
                <span className="lux-list-card-badge">360° Tour</span>
              )}
              {project.possessionDate && (
                <span className="hidden text-[0.65rem] font-medium text-[var(--muted)] sm:inline">
                  Possession {project.possessionDate.slice(0, 7)}
                </span>
              )}
              {project.reraNumber && (
                <span className="hidden text-[0.65rem] font-medium uppercase tracking-wide text-[var(--muted)] sm:inline">
                  RERA
                </span>
              )}
            </div>

            <p className="lux-eyebrow mt-3">{theme.heroEyebrow}</p>
            <h2 className="mt-1 font-serif text-lg font-bold tracking-tight text-[var(--lux-primary)] sm:text-xl md:text-2xl">
              {project.name}
            </h2>

            <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
              {project.builderName}
              {" · "}
              {project.city}
              {project.address ? ` · ${project.address}` : ""}
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
                {project.amenities.slice(0, 4).join(" · ")}
                {project.amenities.length > 4 ? ` · +${project.amenities.length - 4} more` : ""}
              </p>
            )}

            <p className="lux-list-card-cta mt-auto pt-4">View project →</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
