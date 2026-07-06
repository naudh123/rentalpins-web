"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProjectUnit, UnitStatus } from "@/lib/types/builder-microsite";
import { formatIndianPrice, formatSize } from "@/lib/builders/format";
import StatusBadge from "@/components/builders/StatusBadge";
import GatedAssetModal from "@/components/builders/GatedAssetModal";
import {
  isUnitSaved,
  toggleSavedUnit,
} from "@/lib/builders/saved-units";

interface ProjectFloorPlanExplorerProps {
  units: ProjectUnit[];
  projectFloorPlans: string[];
  builderId: string;
  projectId: string;
  projectSlug: string;
  citySlug: string;
  projectName: string;
  onEnquireUnit?: (unitId: string, plotNumber: string | null) => void;
}

const ALL_STATUSES: UnitStatus[] = [
  "available",
  "reserved",
  "sold",
  "coming-soon",
  "hold",
  "not-released",
];

export default function ProjectFloorPlanExplorer({
  units,
  projectFloorPlans,
  builderId,
  projectId,
  projectSlug,
  citySlug,
  projectName,
  onEnquireUnit,
}: ProjectFloorPlanExplorerProps) {
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("available");
  const [maxPriceCr, setMaxPriceCr] = useState("");
  const [gatedUrl, setGatedUrl] = useState<string | null>(null);
  const [, tick] = useState(0);

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (maxPriceCr && (u.price ?? Infinity) > Number(maxPriceCr) * 1_00_00_000) return false;
      return true;
    });
  }, [units, statusFilter, maxPriceCr]);

  const floorPlanPool = useMemo(() => {
    const fromUnits = units.flatMap((u) => u.floorPlanUrls);
    return [...projectFloorPlans, ...fromUnits];
  }, [units, projectFloorPlans]);

  if (units.length === 0 && floorPlanPool.length === 0) return null;

  function handleSave(unit: ProjectUnit) {
    toggleSavedUnit({
      projectId,
      projectSlug,
      citySlug,
      projectName,
      unitId: unit.id,
      plotNumber: unit.plotNumber,
    });
    tick((n) => n + 1);
  }

  return (
    <div className="space-y-5">
      {units.length > 0 && (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UnitStatus | "all")}
            className="lux-input w-auto min-w-[140px] py-2"
          >
            <option value="all">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("-", " ")}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Max price (Cr)"
            value={maxPriceCr}
            onChange={(e) => setMaxPriceCr(e.target.value)}
            className="lux-input w-36 py-2"
          />
        </div>
      )}

      {units.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((unit) => {
            const fp = unit.floorPlanUrls[0];
            const saved = isUnitSaved(projectId, unit.id);
            return (
              <article
                key={unit.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--lux-accent-muted)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--lux-primary)]">
                      Plot {unit.plotNumber || unit.id.slice(0, 6)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatSize(unit.size, unit.sizeUnit)}
                      {unit.facing ? ` · ${unit.facing}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={unit.status} />
                </div>
                <p className="mt-3 font-medium">{formatIndianPrice(unit.price)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {fp && (
                    <button
                      type="button"
                      onClick={() => setGatedUrl(fp)}
                      className="text-xs font-medium text-[var(--lux-accent)] hover:underline"
                    >
                      Floor plan
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSave(unit)}
                    className="text-xs font-medium text-[var(--muted)] hover:text-[var(--lux-primary)]"
                  >
                    {saved ? "Saved ✓" : "Save unit"}
                  </button>
                  {onEnquireUnit && unit.status === "available" && (
                    <button
                      type="button"
                      onClick={() => onEnquireUnit(unit.id, unit.plotNumber)}
                      className="text-xs font-medium text-[var(--lux-accent)] hover:underline"
                    >
                      Enquire
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {floorPlanPool.length > 0 && units.length === 0 && (
        <div className="flex flex-wrap gap-3">
          {floorPlanPool.slice(0, 6).map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setGatedUrl(url)}
              className="lux-btn-outline px-4 py-2 text-sm"
            >
              Download floor plan
            </button>
          ))}
        </div>
      )}

      {gatedUrl && (
        <GatedAssetModal
          open
          onClose={() => setGatedUrl(null)}
          title="Download floor plan"
          description="Share your details to access the floor plan PDF."
          assetUrl={gatedUrl}
          builderId={builderId}
          projectId={projectId}
          projectName={projectName}
          source="floor_plan_download"
        />
      )}
    </div>
  );
}
