"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectListingCard from "@/components/builders/luxury/ProjectListingCard";
import { appPath } from "@/lib/config";
import { projectPath } from "@/lib/builders/project-paths";
import {
  DEFAULT_PROJECTS_FILTERS,
  PRICE_RANGE_FILTERS,
  PROJECT_TYPE_FILTERS,
  filterProjects,
  sortFeaturedFirst,
  uniqueCityOptions,
  type ProjectsIndexFilters,
} from "@/lib/builders/projects-index";
import {
  INVEST_PROJECT_LENSES,
  filterProjectsByInvestLens,
  investNoteForProject,
  type InvestProjectLens,
} from "@/lib/invest/invest-projects-lens";
import type { BuilderProject } from "@/lib/types/builder-microsite";

interface Props {
  projects: BuilderProject[];
}

export default function InvestProjectsClient({ projects }: Props) {
  const [filters, setFilters] = useState<ProjectsIndexFilters>(DEFAULT_PROJECTS_FILTERS);
  const [investLens, setInvestLens] = useState<InvestProjectLens>("all");

  const cityOptions = useMemo(() => uniqueCityOptions(projects), [projects]);

  const filtered = useMemo(() => {
    const base = filterProjects(projects, filters);
    const lensed = filterProjectsByInvestLens(base, investLens);
    return sortFeaturedFirst(lensed);
  }, [projects, filters, investLens]);

  return (
    <div className="invest-theme mt-8 space-y-6">
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--invest-emerald)_20%,var(--border))] bg-[color-mix(in_srgb,var(--invest-platinum)_40%,white)] p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--invest-emerald)]">
          Investor lens
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INVEST_PROJECT_LENSES.map((l) => (
            <button
              key={l.id}
              type="button"
              title={l.hint}
              onClick={() => setInvestLens(l.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                investLens === l.id
                  ? "bg-[var(--invest-emerald)] text-white"
                  : "border border-[var(--border)] bg-white text-[var(--brand-navy)]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lux-filter-panel space-y-4 rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5">
        <input
          type="search"
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
          placeholder="Search projects…"
          className="rp-input w-full"
        />
        {cityOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, citySlug: null }))}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                filters.citySlug == null ? "bg-[var(--brand-navy)] text-white" : "border border-[var(--border)]"
              }`}
            >
              All cities
            </button>
            {cityOptions.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, citySlug: c.slug }))}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  filters.citySlug === c.slug ? "bg-[var(--brand-navy)] text-white" : "border border-[var(--border)]"
                }`}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGE_FILTERS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, priceRangeId: r.id }))}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                filters.priceRangeId === r.id ? "bg-[var(--invest-emerald)] text-white" : "border border-[var(--border)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-[var(--muted)]">
        {filtered.length} project{filtered.length === 1 ? "" : "s"} · verify RERA and run{" "}
        <Link href={appPath("/invest/calculator")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
          yield calculator
        </Link>{" "}
        before booking
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          No projects match this investor lens. Try &quot;All projects&quot; or browse{" "}
          <Link href={appPath("/projects")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            full catalog
          </Link>
          .
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id} className="flex flex-col">
              <ProjectListingCard project={p} href={appPath(projectPath(p.citySlug, p.slug))} />
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{investNoteForProject(p)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
