"use client";

import { trackEvent } from "@/lib/ga4";
import type { DrawMode } from "@/components/map/MapDrawAreaController";
import { drawAreaPrompt, type MapDrawProgress } from "@/lib/map-draw-ui";
import { isMobileMapLayout } from "@/lib/map-gestures";

interface Props {
  drawMode: DrawMode | null;
  drawProgress: MapDrawProgress | null;
  hasArea: boolean;
  filteredCount: number;
  onStartDraw: (mode: DrawMode) => void;
  onClearArea: () => void;
  onCancelDraw: () => void;
  onUndoPoint: () => void;
  onFinishShape: () => void;
}

export default function MapDrawAreaTool({
  drawMode,
  drawProgress,
  hasArea,
  filteredCount,
  onStartDraw,
  onClearArea,
  onCancelDraw,
  onUndoPoint,
  onFinishShape,
}: Props) {
  const mobile = typeof window !== "undefined" && isMobileMapLayout();

  const start = (mode: DrawMode) => {
    if (drawMode) return;
    if (hasArea) onClearArea();
    trackEvent("map_draw_area_started", { mode });
    onStartDraw(mode);
  };

  const prompt =
    drawMode && drawProgress
      ? drawAreaPrompt(drawMode, {
          mobile,
          pointCount: drawProgress.pointCount,
        })
      : null;

  return (
    <div
      className="pointer-events-auto absolute left-3 top-[7.5rem] z-20 flex max-w-[min(100vw-1.5rem,18rem)] flex-col gap-2 md:top-[7.75rem]"
      aria-label="Draw search area on map"
    >
      {drawMode && drawProgress && prompt && (
        <div className="rounded-xl border border-[var(--brand-orange)]/30 bg-[var(--surface)]/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-semibold leading-snug text-[var(--brand-navy)]">
            {drawMode === "rect" ? "Drawing rectangle" : "Drawing custom area"}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--muted)]">{prompt}</p>
          {drawMode === "poly" && drawProgress.pointCount > 0 && (
            <p className="mt-1 text-[10px] font-medium text-[var(--brand-orange)]">
              {drawProgress.pointCount} point{drawProgress.pointCount === 1 ? "" : "s"} placed
            </p>
          )}
          <p className="mt-1 text-[10px] text-[var(--muted)]">Esc to cancel</p>
        </div>
      )}

      {hasArea && !drawMode && (
        <p
          className="rounded-full border border-[var(--brand-orange)]/35 bg-[var(--surface)]/95 px-3 py-1.5 text-[11px] font-medium text-[var(--brand-navy)] shadow-sm backdrop-blur-sm"
          role="status"
        >
          Custom area · {filteredCount} listing{filteredCount === 1 ? "" : "s"}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {!drawMode ? (
          <>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] shadow-sm transition hover:border-[var(--brand-orange)]/40"
              onClick={() => start("rect")}
              title="Drag a rectangle on the map"
            >
              Rectangle
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] shadow-sm transition hover:border-[var(--brand-orange)]/40"
              onClick={() => start("poly")}
              title="Tap corners to outline any shape"
            >
              Custom shape
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
                Clear area
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className="rounded-full border border-[var(--brand-orange)] bg-[var(--brand-orange)] px-3 py-2 text-xs font-semibold text-white shadow-sm"
              aria-pressed
            >
              {drawMode === "rect" ? "Rectangle…" : "Custom shape…"}
            </button>
            {drawMode === "poly" && drawProgress && drawProgress.canUndo && (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] shadow-sm hover:border-[var(--brand-orange)]/40"
                onClick={onUndoPoint}
              >
                Undo
              </button>
            )}
            {drawMode === "poly" && drawProgress?.canFinish && (
              <button
                type="button"
                className="rounded-full border border-[var(--brand-navy)] bg-[var(--brand-navy)] px-3 py-2 text-xs font-semibold text-white shadow-sm"
                onClick={onFinishShape}
              >
                Done
              </button>
            )}
            <button
              type="button"
              className="rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-semibold text-[var(--muted)] shadow-sm hover:text-[var(--brand-navy)]"
              onClick={onCancelDraw}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
