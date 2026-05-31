"use client";

import type { MapViewMode } from "@/lib/map-view-mode";

interface Props {
  mode: MapViewMode;
  onChange: (mode: MapViewMode) => void;
  /** True when auto mode is showing satellite/hybrid at current zoom. */
  showingSatellite?: boolean;
}

const MODES: { id: MapViewMode; label: string; title: string }[] = [
  { id: "auto", label: "Auto", title: "Map when zoomed out, satellite when zoomed in" },
  { id: "roadmap", label: "Map", title: "Always show map view" },
  { id: "satellite", label: "Sat", title: "Always show satellite imagery" },
];

/** Zillow-style map surface picker — bottom-right on desktop, above mobile sheet. */
export default function MapViewModeToggle({ mode, onChange, showingSatellite }: Props) {
  return (
    <div
      className="pointer-events-auto absolute bottom-[max(5.5rem,env(safe-area-inset-bottom))] right-3 z-20 flex rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-0.5 shadow-[0_8px_32px_rgba(30,58,110,0.12)] backdrop-blur-sm md:bottom-4"
      role="group"
      aria-label="Map view mode"
    >
      {MODES.map((item) => {
        const active = mode === item.id;
        const autoSatellite = item.id === "auto" && showingSatellite;
        return (
          <button
            key={item.id}
            type="button"
            title={item.title}
            aria-pressed={active}
            className={`min-h-9 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 motion-reduce:transition-none sm:px-3 sm:text-xs ${
              active
                ? "bg-[var(--brand-navy)] text-white shadow-sm"
                : "text-[var(--brand-navy)] hover:bg-[var(--bg-elevated)]"
            }`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {autoSatellite ? " ✦" : null}
          </button>
        );
      })}
    </div>
  );
}
