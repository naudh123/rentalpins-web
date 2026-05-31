"use client";

import { useCallback, useState } from "react";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";

const STORAGE_KEY = "rp_map_mobile_view";

function readStoredView(): MapMobileView {
  if (typeof window === "undefined") return "peek";
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === "map" || v === "peek" || v === "list") return v;
  } catch {
    // Ignore storage errors.
  }
  return "peek";
}

/** Remember Map / Both / List on mobile across visits in the same session. */
export function usePersistedMobileMapView() {
  const [mobileView, setMobileView] = useState<MapMobileView>(readStoredView);

  const setMobileViewPersisted = useCallback((view: MapMobileView) => {
    setMobileView(view);
    try {
      sessionStorage.setItem(STORAGE_KEY, view);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  return { mobileView, setMobileView: setMobileViewPersisted };
}
