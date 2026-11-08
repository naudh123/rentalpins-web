"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectListingCard from "@/components/builders/luxury/ProjectListingCard";
import FeaturedProjectCard from "@/components/builders/luxury/FeaturedProjectCard";
import { appPath } from "@/lib/config";
import { projectPath } from "@/lib/builders/project-paths";
import {
  DEFAULT_PROJECTS_FILTERS,
  PRICE_RANGE_FILTERS,
  PROJECT_TYPE_FILTERS,
  filterProjects,
  excludeFeaturedFromGrid,
  pickFeaturedProjects,
  sortFeaturedFirst,
  uniqueCityOptions,
  type ProjectsIndexFilters,
} from "@/lib/builders/projects-index";
import type { BuilderProject } from "@/lib/types/builder-microsite";

interface ProjectsIndexClientProps {
  projects: BuilderProject[];
  /** When set, city filter is locked (city sub-page). */
  lockedCitySlug?: string;
  lockedCityName?: string;
  showFeatured?: boolean;
}

export default function ProjectsIndexClient({
  projects,
  lockedCitySlug,
  lockedCityName,
  showFeatured = true,
}: ProjectsIndexClientProps) {
  const [filters, setFilters] = useState<ProjectsIndexFilters>({
    ...DEFAULT_PROJECTS_FILTERS,
    citySlug: lockedCitySlug ?? null,
  });

  const cityOptions = useMemo(() => uniqueCityOptions(projects), [projects]);

  const featuredProjects = useMemo(
    () => pickFeaturedProjects(projects),
    [projects]
  );

  const filtered = useMemo(() => {
    const active: ProjectsIndexFilters = {
      ...filters,
      citySlug: lockedCitySlug ?? filters.citySlug,
    };
    return sortFeaturedFirst(filterProjects(projects, active));
  }, [projects, filters, lockedCitySlug]);

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    (!lockedCitySlug && filters.citySlug != null) ||
    filters.projectType !== "all" ||
    filters.priceRangeId !== "all";

  const showFeaturedRail =
    showFeatured &&
    featuredProjects.length > 0 &&
    !hasActiveFilters &&
    !lockedCitySlug;

  const gridProjects = useMemo(() => {
    if (showFeaturedRail) {
      return excludeFeaturedFromGrid(filtered, featuredProjects);
    }
    return filtered;
  }, [filtered, featuredProjects, showFeaturedRail]);

  function clearFilters() {
    setFilters({
      ...DEFAULT_PROJECTS_FILTERS,
      citySlug: lockedCitySlug ?? null,
    });
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Search + filters */}
      <div className="lux-filter-panel lux-glass space-y-4 rounded-2xl border border-[var(--border)] p-4 sm:p-5">
        <div className="relative">
          <label htmlFor="projects-search" className="sr-only">
            Search projects
          </label>
          <input
            id="projects-search"
            type="search"
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Search by project, builder, city or amenity…"
            className="lux-input pl-10"
            autoComplete="off"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--lux-accent)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
        </div>

        {!lockedCitySlug && cityOptions.length > 0 && (
          <div>
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted)]">
              City
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, citySlug: null }))}
                className={`lux-filter-pill ${filters.citySlug == null ? "is-active" : ""}`}
              >
                All cities
              </button>
              {cityOptions.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      citySlug: f.citySlug === c.slug ? null : c.slug,
                    }))
                  }
                  className={`lux-filter-pill ${filters.citySlug === c.slug ? "is-active" : ""}`}
                >
                  {c.name}
                  <span className="opacity-60">({c.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Project type
          </p>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPE_FILTERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, projectType: t.id }))}
                className={`lux-filter-pill ${filters.projectType === t.id ? "is-active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Price range
          </p>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGE_FILTERS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, priceRangeId: r.id }))}
                className={`lux-filter-pill ${filters.priceRangeId === r.id ? "is-active" : ""}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" onClick={clearFilters} className="lux-btn-outline text-xs">
              Clear filters
            </button>
            <p className="text-xs text-[var(--muted)]">
              {gridProjects.length} of {projects.length} projects
            </p>
          </div>
        )}
      </div>

      {/* Featured rail */}
      {showFeaturedRail && (
        <section aria-labelledby="featured-projects-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="lux-eyebrow">Editor&apos;s picks</p>
              <h2
                id="featured-projects-heading"
                className="font-serif text-2xl font-bold tracking-tight text-[var(--lux-primary)]"
              >
                Featured Tricity projects
              </h2>
            </div>
          </div>
          <ul className="mt-5 grid items-stretch gap-4 lg:grid-cols-2">
            {featuredProjects.map((p, i) => (
              <FeaturedProjectCard
                key={p.id}
                project={p}
                href={appPath(projectPath(p.citySlug, p.slug))}
                rank={i + 1}
              />
            ))}
          </ul>
        </section>
      )}

      {/* All projects grid */}
      <section aria-labelledby="all-projects-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="all-projects-heading"
              className="font-serif text-xl font-bold tracking-tight text-[var(--lux-primary)] sm:text-2xl"
            >
              {lockedCityName
                ? `All projects in ${lockedCityName}`
                : showFeaturedRail
                  ? "All projects"
                  : "Projects"}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {gridProjects.length} project{gridProjects.length === 1 ? "" : "s"}
              {hasActiveFilters ? " matching filters" : " · sorted by featured & latest"}
            </p>
          </div>
        </div>

        {gridProjects.length === 0 ? (
          <div className="lux-empty-state mt-8">
            <p className="font-serif text-xl font-bold text-[var(--lux-primary)]">
              No projects match your criteria
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Refine your search or explore our full Tricity collection.
            </p>
            <button type="button" onClick={clearFilters} className="lux-btn-gold mt-6 text-sm">
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid items-stretch gap-4 sm:gap-5 lg:grid-cols-2">
            {gridProjects.map((p) => (
              <ProjectListingCard
                key={p.id}
                project={p}
                href={appPath(projectPath(p.citySlug, p.slug))}
                featured={
                  p.isFeatured ||
                  featuredProjects.some((f) => f.id === p.id)
                }
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
