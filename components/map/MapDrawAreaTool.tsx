"use client";

import { trackEvent } from "@/lib/ga4";
import type { DrawMode } from "@/components/map/MapDrawAreaController";

interface Props {
  drawMode: DrawMode | null;
  hasArea: boolean;
  filteredCount: number;
  onStartDraw: (mode: DrawMode) => void;
  onClearArea: () => void;
}

const PROMPT: Record<DrawMode, string> = {
  rect: "Drag on the map to draw a box",
  poly: "Click to add points · double-click to finish",
};

export default function MapDrawAreaTool({
  drawMode,
  hasArea,
  filteredCount,
  onStartDraw,
  onClearArea,
}: Props) {
  const start = (mode: DrawMode) => {
    if (drawMode) return;
    trackEvent("map_draw_area_started", { mode });
    onStartDraw(mode);
  };

  return (
    <div className="pointer-events-auto absolute left-3 top-[7.5rem] z-20 flex flex-col gap-2 md:top-[7.75rem]">
      {drawMode && (
        <p className="max-w-[12rem] rounded-xl border border-[var(--brand-orange)]/30 bg-[var(--surface)]/95 px-3 py-2 text-[11px] leading-snug text-[var(--brand-navy)] shadow-sm backdrop-blur-sm">
          {PROMPT[drawMode]}
        </p>
      )}
      {hasArea && !drawMode && (
        <p
          className="rounded-full border border-[var(--brand-orange)]/35 bg-[var(--surface)]/95 px-3 py-1.5 text-[11px] font-medium text-[var(--brand-navy)] shadow-sm backdrop-blur-sm"
          role="status"
        >
          Custom area · {filteredCount} listing{filteredCount === 1 ? "" : "s"}
        </p>
      )}
      <div className="flex gap-1.5">
        <button
          type="button"
          className={`rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition ${
            drawMode === "rect"
              ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
              : "border-[var(--border)] bg-[var(--surface)]/95 text-[var(--brand-navy)] hover:border-[var(--brand-orange)]/40"
          }`}
          aria-pressed={drawMode === "rect"}
          onClick={() => start("rect")}
          disabled={Boolean(drawMode)}
        >
          {drawMode === "rect" ? "Drawing…" : "Draw box"}
        </button>
        <button
          type="button"
          className={`rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition ${
            drawMode === "poly"
              ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
              : "border-[var(--border)] bg-[var(--surface)]/95 text-[var(--brand-navy)] hover:border-[var(--brand-orange)]/40"
          }`}
          aria-pressed={drawMode === "poly"}
          onClick={() => start("poly")}
          disabled={Boolean(drawMode)}
        >
          {drawMode === "poly" ? "Drawing…" : "Draw shape"}
        </button>
        {hasArea && (
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-semibold text-[var(--muted)] shadow-sm hover:text-[var(--brand-navy)]"
            onClick={() => {
              trackEvent("map_draw_area_cleared");
              onClearArea();
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
