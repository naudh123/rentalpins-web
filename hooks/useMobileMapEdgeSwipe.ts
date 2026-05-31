"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { MapMobileView } from "@/components/map/MapMobileViewSwitcher";

const MIN_SWIPE_PX = 56;
const EDGE_ZONE_PX = 32;
const AXIS_RATIO = 1.25;

interface TouchStart {
  x: number;
  y: number;
  fromLeftEdge: boolean;
}

interface Options {
  mapRegionRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  view: MapMobileView;
  onViewChange: (view: MapMobileView) => void;
}

function isMobileLayout() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

/** Swipe map ↔ list on mobile without blocking Google Maps pan/zoom (decide on touchend only). */
export function useMobileMapEdgeSwipe({
  mapRegionRef,
  panelRef,
  view,
  onViewChange,
}: Options): void {
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    const mapEl = mapRegionRef.current;
    const panelEl = panelRef.current;
    if (!mapEl && !panelEl) return;

    const starts = new WeakMap<EventTarget, TouchStart>();

    function onTouchStart(e: TouchEvent) {
      if (!isMobileLayout()) return;
      const t = e.touches[0];
      if (!t) return;
      starts.set(e.currentTarget!, {
        x: t.clientX,
        y: t.clientY,
        fromLeftEdge: t.clientX <= EDGE_ZONE_PX,
      });
    }

    function onTouchEnd(e: TouchEvent) {
      if (!isMobileLayout()) return;
      const start = starts.get(e.currentTarget!);
      starts.delete(e.currentTarget!);
      if (!start) return;

      const t = e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < MIN_SWIPE_PX && absY < MIN_SWIPE_PX) return;

      const current = viewRef.current;
      let next: MapMobileView | null = null;

      if (absY >= absX * AXIS_RATIO) {
        if (dy < -MIN_SWIPE_PX && current === "map") next = "peek";
        else if (dy > MIN_SWIPE_PX && current === "list") next = "peek";
      } else if (absX >= absY * AXIS_RATIO) {
        if (dx < -MIN_SWIPE_PX) {
          if (current === "map" || current === "peek") next = "list";
        } else if (dx > MIN_SWIPE_PX) {
          if (start.fromLeftEdge && current !== "map") next = "map";
          else if (current === "list") next = "peek";
          else if (current === "peek") next = "map";
        }
      }

      if (!next || next === current) return;
      onViewChange(next);
    }

    const opts: AddEventListenerOptions = { passive: true };
    mapEl?.addEventListener("touchstart", onTouchStart, opts);
    mapEl?.addEventListener("touchend", onTouchEnd, opts);
    panelEl?.addEventListener("touchstart", onTouchStart, opts);
    panelEl?.addEventListener("touchend", onTouchEnd, opts);

    return () => {
      mapEl?.removeEventListener("touchstart", onTouchStart);
      mapEl?.removeEventListener("touchend", onTouchEnd);
      panelEl?.removeEventListener("touchstart", onTouchStart);
      panelEl?.removeEventListener("touchend", onTouchEnd);
    };
  }, [mapRegionRef, panelRef, onViewChange]);
}
