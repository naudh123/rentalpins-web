/** Map gesture mode while draw tools are active (mobile needs cooperative scroll). */
export function mapGestureHandlingDuringDraw(isMobileLayout: boolean): "cooperative" | "greedy" {
  return isMobileLayout ? "cooperative" : "greedy";
}

export function isMobileMapLayout(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}
