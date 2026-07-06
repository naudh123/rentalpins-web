"use client";

import { useMemo, useState } from "react";
import type { ProjectUnit } from "@/lib/types/builder-microsite";
import { formatIndianPrice, formatSize } from "@/lib/builders/format";
import { UNIT_STATUS_COLORS } from "@/lib/builders/unit-status-colors";
import StatusBadge from "@/components/builders/StatusBadge";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";

type AngleKey = "default" | "angle1" | "angle2" | "angle3" | "angle4";

interface MasterPlanViewerProps {
  imageUrl: string;
  angles?: { id: string; label: string; imageUrl: string }[];
  units: ProjectUnit[];
  builderId: string;
  projectId: string;
  projectName: string;
}

export default function MasterPlanViewer({
  imageUrl,
  angles = [],
  units,
  builderId,
  projectId,
  projectName,
}: MasterPlanViewerProps) {
  const allAngles = useMemo(() => {
    if (angles.length > 0) return angles;
    return [{ id: "default", label: "Master Plan", imageUrl }];
  }, [angles, imageUrl]);

  const [activeAngle, setActiveAngle] = useState(allAngles[0]?.id || "default");
  const [selectedUnit, setSelectedUnit] = useState<ProjectUnit | null>(null);

  const currentImage =
    allAngles.find((a) => a.id === activeAngle)?.imageUrl || imageUrl;

  const angleKey = (activeAngle === "default" ? "default" : activeAngle) as AngleKey;

  const markers = units.filter((u) => u.hotspots?.[angleKey]);

  return (
    <div className="space-y-5">
      {allAngles.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allAngles.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setActiveAngle(a.id);
                setSelectedUnit(null);
              }}
              className={`lux-filter-pill ${activeAngle === a.id ? "is-active" : ""}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      <div className="lux-map-frame relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage}
          alt={`${projectName} master plan`}
          className="block w-full select-none"
          draggable={false}
        />
        {markers.map((unit) => {
          const coord = unit.hotspots[angleKey]!;
          return (
            <button
              key={unit.id}
              type="button"
              aria-label={`Plot ${unit.plotNumber}`}
              onClick={() => setSelectedUnit(unit)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg ring-2 ring-[var(--lux-accent)]/40 transition hover:scale-125"
              style={{
                left: `${coord.xPercent}%`,
                top: `${coord.yPercent}%`,
                width: 24,
                height: 24,
                backgroundColor: UNIT_STATUS_COLORS[unit.status],
              }}
            />
          );
        })}
      </div>

      <div className="lux-filter-bar flex flex-wrap gap-4 text-xs">
        {Object.entries(UNIT_STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="flex items-center gap-2 capitalize text-[var(--muted)]">
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: color }}
            />
            {status.replace("-", " ")}
          </span>
        ))}
      </div>

      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-md sm:items-center">
          <div className="lux-glass w-full max-w-md rounded-2xl p-6 sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="lux-eyebrow">Selected Plot</p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[var(--lux-primary)]">
                  Plot {selectedUnit.plotNumber}
                </h3>
                <div className="mt-2">
                  <StatusBadge status={selectedUnit.status} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:bg-[var(--lux-surface-elevated)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <dl className="mb-6 space-y-3 border-y border-[var(--border)] py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Size</dt>
                <dd className="font-semibold text-[var(--lux-primary)]">
                  {formatSize(selectedUnit.size, selectedUnit.sizeUnit)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Price</dt>
                <dd className="font-semibold text-[var(--lux-primary)]">
                  {formatIndianPrice(selectedUnit.price)}
                </dd>
              </div>
              {selectedUnit.facing && (
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Facing</dt>
                  <dd className="font-semibold">{selectedUnit.facing}</dd>
                </div>
              )}
            </dl>
            <ProjectLeadForm
              builderId={builderId}
              projectId={projectId}
              unitId={selectedUnit.id}
              source="plot_popup"
              plotNumber={selectedUnit.plotNumber || undefined}
              projectName={projectName}
            />
          </div>
        </div>
      )}
    </div>
  );
}
