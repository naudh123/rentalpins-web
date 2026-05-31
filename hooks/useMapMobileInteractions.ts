"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { trackEvent } from "@/lib/ga4";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useMobileMapSheetDrag } from "@/hooks/useMobileMapSheet";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";
import { nextMapMobileView } from "@/hooks/useMapKeyboardShortcuts";

interface Options {
  mobileView: MapMobileView;
  setMobileView: (view: MapMobileView) => void;
  mapRegionRef: RefObject<HTMLDivElement | null>;
  resultsPanelRef: RefObject<HTMLElement | null>;
  sheetHandleRef: RefObject<HTMLButtonElement | null>;
  sheetLastTriggerRef: RefObject<HTMLElement | null>;
}

/** Mobile sheet drag, edge swipe, focus trap, and tracked view changes. */
export function useMapMobileInteractions({
  mobileView,
  setMobileView,
  mapRegionRef,
  resultsPanelRef,
  sheetHandleRef,
  sheetLastTriggerRef,
}: Options) {
  const wasMobileSheetOpenRef = useRef(false);

  const setMobileViewTracked = useCallback(
    (view: MapMobileView, method?: string) => {
      setMobileView(view);
      trackEvent("map_mobile_view_changed", { view, method: method ?? "control" });
    },
    [setMobileView]
  );

  const openMobileSheet = useCallback(
    (method: "cta_button" | "drag_handle" | "selected_from_url" | "pin_selected") => {
      setMobileViewTracked("list", method);
    },
    [setMobileViewTracked]
  );

  const cycleMobileView = useCallback(() => {
    setMobileViewTracked(nextMapMobileView(mobileView), "keyboard");
  }, [mobileView, setMobileViewTracked]);

  useEffect(() => {
    const wasOpen = wasMobileSheetOpenRef.current;
    wasMobileSheetOpenRef.current = mobileView === "list";
    if (mobileView === "list" || !wasOpen) return;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;
    sheetLastTriggerRef.current?.focus();
  }, [mobileView, sheetLastTriggerRef]);

  useMobileMapSheetDrag({
    panelRef: resultsPanelRef,
    handleRef: sheetHandleRef,
    open: mobileView === "list",
    onOpen: (method) => openMobileSheet(method),
    onClose: () => setMobileViewTracked("map", "drag_handle"),
  });

  useFocusTrap({
    active: mobileView === "list",
    containerRef: resultsPanelRef,
    initialFocusRef: sheetHandleRef,
    onEscape: () => setMobileViewTracked("map", "escape_key"),
  });

  return {
    setMobileViewTracked,
    openMobileSheet,
    cycleMobileView,
  };
}
