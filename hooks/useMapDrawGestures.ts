"use client";

import { useEffect } from "react";
import type { DrawMode } from "@/components/map/MapDrawAreaController";
import { isMobileMapLayout, mapGestureHandlingDuringDraw } from "@/lib/map-gestures";

/** Cooperative scroll on mobile while drawing; greedy elsewhere. */
export function useMapDrawGestures(
  mapInstance: google.maps.Map | null,
  drawMode: DrawMode | null
) {
  useEffect(() => {
    if (!mapInstance) return;
    if (!drawMode) {
      mapInstance.setOptions({ gestureHandling: "greedy" });
      return;
    }
    const apply = () => {
      mapInstance.setOptions({
        gestureHandling: mapGestureHandlingDuringDraw(isMobileMapLayout()),
      });
    };
    apply();
    const mql = window.matchMedia("(max-width: 767px)");
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mapInstance, drawMode]);
}
