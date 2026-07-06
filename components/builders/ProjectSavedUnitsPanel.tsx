"use client";

import { useEffect, useState } from "react";
import {
  getSavedUnitsForProject,
  removeSavedUnit,
  type SavedUnitRef,
} from "@/lib/builders/saved-units";

interface ProjectSavedUnitsPanelProps {
  projectId: string;
  onEnquireUnit?: (unitId: string, plotNumber: string | null) => void;
}

export default function ProjectSavedUnitsPanel({
  projectId,
  onEnquireUnit,
}: ProjectSavedUnitsPanelProps) {
  const [saved, setSaved] = useState<SavedUnitRef[]>([]);

  useEffect(() => {
    setSaved(getSavedUnitsForProject(projectId));
  }, [projectId]);

  if (saved.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="font-serif text-lg font-bold text-[var(--lux-primary)]">Your shortlist</h3>
      <p className="mt-1 text-xs text-[var(--muted)]">Units saved on this device</p>
      <ul className="mt-4 space-y-2">
        {saved.map((u) => (
          <li
            key={u.unitId}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm"
          >
            <span>
              Plot {u.plotNumber || u.unitId.slice(0, 6)}
            </span>
            <span className="flex gap-2">
              {onEnquireUnit && (
                <button
                  type="button"
                  onClick={() => onEnquireUnit(u.unitId, u.plotNumber)}
                  className="text-xs font-medium text-[var(--lux-accent)] hover:underline"
                >
                  Enquire
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  removeSavedUnit(projectId, u.unitId);
                  setSaved(getSavedUnitsForProject(projectId));
                }}
                className="text-xs text-[var(--muted)] hover:text-red-600"
              >
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
