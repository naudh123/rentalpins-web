"use client";

import { useMemo, useState } from "react";
import type { ProjectUnit, UnitStatus } from "@/lib/types/builder-microsite";
import { formatIndianPrice, formatSize } from "@/lib/builders/format";
import StatusBadge from "@/components/builders/StatusBadge";

interface ProjectInventoryTableProps {
  units: ProjectUnit[];
  showFilters?: boolean;
}

const ALL_STATUSES: UnitStatus[] = [
  "available",
  "reserved",
  "sold",
  "coming-soon",
  "hold",
  "not-released",
];

export default function ProjectInventoryTable({
  units,
  showFilters = true,
}: ProjectInventoryTableProps) {
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("all");
  const [facingFilter, setFacingFilter] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const facings = useMemo(
    () => [...new Set(units.map((u) => u.facing).filter(Boolean))] as string[],
    [units]
  );

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (facingFilter && u.facing !== facingFilter) return false;
      if (minSize && (u.size ?? 0) < Number(minSize)) return false;
      if (maxPrice && (u.price ?? Infinity) > Number(maxPrice) * 1_00_00_000) return false;
      return true;
    });
  }, [units, statusFilter, facingFilter, minSize, maxPrice]);

  if (units.length === 0) {
    return (
      <div className="lux-empty-state">
        <p className="font-serif text-xl font-bold text-[var(--lux-primary)]">Inventory arriving soon</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Contact our concierge team for the latest plot availability.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {showFilters && (
        <div className="lux-filter-bar flex flex-wrap gap-3">
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
          {facings.length > 0 && (
            <select
              value={facingFilter}
              onChange={(e) => setFacingFilter(e.target.value)}
              className="lux-input w-auto min-w-[140px] py-2"
            >
              <option value="">All facings</option>
              {facings.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}
          <input
            type="number"
            placeholder="Min size"
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
            className="lux-input w-28 py-2"
          />
          <input
            type="number"
            placeholder="Max price (Cr)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="lux-input w-36 py-2"
          />
        </div>
      )}

      <div className="lux-table-wrap overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
            <tr>
              <th className="px-5 py-4 font-semibold">Plot</th>
              <th className="px-5 py-4 font-semibold">Size</th>
              <th className="px-5 py-4 font-semibold">Facing</th>
              <th className="px-5 py-4 font-semibold">Price</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--surface)]">
            {filtered.map((unit) => (
              <tr
                key={unit.id}
                className="transition hover:bg-[var(--sale-ivory-elevated)]/60"
              >
                <td className="px-5 py-4 font-semibold text-[var(--lux-primary)]">
                  {unit.plotNumber || unit.id.slice(0, 6)}
                </td>
                <td className="px-5 py-4">{formatSize(unit.size, unit.sizeUnit)}</td>
                <td className="px-5 py-4 text-[var(--muted)]">{unit.facing || "—"}</td>
                <td className="px-5 py-4 font-medium">{formatIndianPrice(unit.price)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={unit.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--muted)]">
        Showing {filtered.length} of {units.length} units
      </p>
    </div>
  );
}
