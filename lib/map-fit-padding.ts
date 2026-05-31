import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";

/** Google Maps fitBounds padding that clears the mobile results sheet. */
export function fitBoundsPaddingForMobileView(
  mobileView: MapMobileView
): { top: number; bottom: number; left: number; right: number } {
  const bottom =
    mobileView === "list" ? 280 : mobileView === "peek" ? 200 : 160;
  return { top: 100, bottom, left: 56, right: 56 };
}
