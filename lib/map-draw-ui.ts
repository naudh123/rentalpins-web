import type { DrawMode } from "@/components/map/MapDrawAreaController";

export interface MapDrawProgress {
  mode: DrawMode;
  pointCount: number;
  canFinish: boolean;
  canUndo: boolean;
}

export function drawAreaPrompt(
  mode: DrawMode,
  opts: { mobile: boolean; pointCount: number }
): string {
  if (mode === "rect") {
    return opts.mobile
      ? "Tap two opposite corners to draw a box"
      : "Click and drag on the map to draw a box";
  }
  if (opts.pointCount === 0) {
    return opts.mobile
      ? "Tap the map to add corners · use Done when finished"
      : "Click to add corners · double-click or tap Done to finish";
  }
  if (opts.pointCount < 3) {
    return `Add ${3 - opts.pointCount} more point${3 - opts.pointCount === 1 ? "" : "s"} to close the shape`;
  }
  return opts.mobile
    ? "Tap the first point or Done to finish · Undo removes last point"
    : "Double-click, tap the first point, or Done to finish";
}
