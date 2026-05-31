"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAP_PANEL_WIDTH_MIN = 360;
export const MAP_PANEL_WIDTH_MAX = 640;
export const MAP_PANEL_WIDTH_DEFAULT = 520;
export const MAP_PANEL_WIDTH_STORAGE_KEY = "rp_map_panel_width";

/** Resizable desktop results panel width with localStorage persistence. */
export function useMapPanelWidth(initial = MAP_PANEL_WIDTH_DEFAULT) {
  const [panelWidth, setPanelWidth] = useState(initial);
  const panelResizeRef = useRef<{ startX: number; startW: number } | null>(null);
  const panelWidthRef = useRef(panelWidth);
  panelWidthRef.current = panelWidth;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MAP_PANEL_WIDTH_STORAGE_KEY);
      if (stored) {
        const n = Number(stored);
        if (Number.isFinite(n)) {
          setPanelWidth(
            Math.min(MAP_PANEL_WIDTH_MAX, Math.max(MAP_PANEL_WIDTH_MIN, n))
          );
        }
      }
    } catch {
      // Ignore storage errors.
    }
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const drag = panelResizeRef.current;
      if (!drag) return;
      const delta = drag.startX - e.clientX;
      const next = Math.min(
        MAP_PANEL_WIDTH_MAX,
        Math.max(MAP_PANEL_WIDTH_MIN, drag.startW + delta)
      );
      setPanelWidth(next);
    }
    function onMouseUp() {
      if (!panelResizeRef.current) return;
      panelResizeRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try {
        window.localStorage.setItem(
          MAP_PANEL_WIDTH_STORAGE_KEY,
          String(Math.round(panelWidthRef.current))
        );
      } catch {
        // Ignore storage errors.
      }
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startPanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    panelResizeRef.current = { startX: e.clientX, startW: panelWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [panelWidth]);

  return { panelWidth, startPanelResize };
}
