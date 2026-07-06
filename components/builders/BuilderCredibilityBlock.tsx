import Link from "next/link";
import { appPath } from "@/lib/config";
import { builderPath } from "@/lib/builders/project-paths";
import type { Builder, BuilderProject } from "@/lib/types/builder-microsite";
import { LuxuryGlassPanel } from "@/components/builders/luxury/LuxuryUI";

interface BuilderCredibilityBlockProps {
  builder: Builder;
  project: BuilderProject;
  projectCount?: number;
}

export default function BuilderCredibilityBlock({
  builder,
  project,
  projectCount,
}: BuilderCredibilityBlockProps) {
  return (
    <LuxuryGlassPanel>
      <p className="lux-eyebrow">Developer Trust</p>
      <h3 className="mt-2 font-serif text-xl font-bold text-[var(--lux-primary)]">
        {builder.name}
      </h3>
      {builder.description && (
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[var(--muted)]">
          {builder.description}
        </p>
      )}
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        {builder.establishedYear && (
          <div>
            <dt className="text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">Since</dt>
            <dd className="mt-1 font-semibold text-[var(--lux-primary)]">
              {builder.establishedYear}
            </dd>
          </div>
        )}
        {projectCount != null && projectCount > 0 && (
          <div>
            <dt className="text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
              Projects
            </dt>
            <dd className="mt-1 font-semibold text-[var(--lux-primary)]">{projectCount}</dd>
          </div>
        )}
        {(project.reraNumber || builder.reraNumber) && (
          <div>
            <dt className="text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">RERA</dt>
            <dd className="mt-1 font-semibold text-[var(--lux-primary)]">
              {project.reraNumber || builder.reraNumber}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">Enquiries</dt>
          <dd className="mt-1 font-semibold text-[var(--lux-primary)]">
            {project.enquiryCount > 0 ? `${project.enquiryCount}+` : "Verified listing"}
          </dd>
        </div>
      </dl>
      {project.testimonials.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-[var(--border-subtle)] pt-6">
          {project.testimonials.slice(0, 2).map((t) => (
            <blockquote key={t.quote.slice(0, 40)} className="text-sm italic text-[var(--muted)]">
              &ldquo;{t.quote}&rdquo;
              <footer className="mt-2 not-italic text-xs font-medium text-[var(--lux-primary)]">
                — {t.author}
                {t.role ? `, ${t.role}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
      <Link
        href={appPath(builderPath(builder.slug))}
        className="mt-6 inline-block text-sm font-medium text-[var(--lux-accent)] hover:underline"
      >
        View all {builder.name} projects →
      </Link>
    </LuxuryGlassPanel>
  );
}
