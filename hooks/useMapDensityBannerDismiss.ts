"use client";

import { useMapViewportHintDismiss } from "@/hooks/useMapViewportHintDismiss";

const STORAGE_KEY = "rp_map_density_banner_dismiss";

/** Hide density banner for the current viewport until pan/zoom changes. */
export function useMapDensityBannerDismiss(
  densityHint: string | null,
  viewportKey: string
) {
  return useMapViewportHintDismiss(
    Boolean(densityHint),
    viewportKey,
    STORAGE_KEY,
    "map_density_banner_dismissed"
  );
}
