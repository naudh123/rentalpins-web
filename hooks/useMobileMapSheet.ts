"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { trackEvent } from "@/lib/ga4";

const PEEK_PX = 68;
const SNAP_THRESHOLD = 0.35;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface Options {
  panelRef: RefObject<HTMLElement | null>;
  handleRef: RefObject<HTMLElement | null>;
  open: boolean;
  onOpen: (method: "drag_handle" | "cta_button") => void;
  onClose: (method: "drag_handle" | "cta_button") => void;
}

/** Touch drag on sheet handle — velocity-aware snap for a native luxury feel. */
export function useMobileMapSheetDrag({
  panelRef,
  handleRef,
  open,
  onOpen,
  onClose,
}: Options): void {
  const dragRef = useRef<{
    startY: number;
    startTime: number;
    lastY: number;
    dragging: boolean;
  } | null>(null);

  const applyOffset = useCallback((offsetPx: number) => {
    const panel = panelRef.current;
    if (!panel) return;
    const max = panel.offsetHeight - PEEK_PX;
    const clamped = Math.max(0, Math.min(max, offsetPx));
    panel.style.transform = `translateY(${clamped}px)`;
    panel.style.transition = "none";
  }, [panelRef]);

  const clearOffset = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (prefersReducedMotion()) {
      panel.style.transition = "none";
    }
    panel.style.transform = "";
    panel.style.transition = "";
  }, [panelRef]);

  useEffect(() => {
    const handle = handleRef.current;
    const panel = panelRef.current;
    if (!handle || !panel) return;

    function onTouchStart(e: TouchEvent) {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const y = e.touches[0]?.clientY ?? 0;
      dragRef.current = { startY: y, startTime: Date.now(), lastY: y, dragging: true };
    }

    function onTouchMove(e: TouchEvent) {
      const drag = dragRef.current;
      if (!drag?.dragging) return;
      const y = e.touches[0]?.clientY ?? drag.lastY;
      drag.lastY = y;
      const delta = y - drag.startY;
      const max = panel!.offsetHeight - PEEK_PX;
      const base = open ? 0 : max;
      applyOffset(base + delta);
    }

    function onTouchEnd() {
      const drag = dragRef.current;
      dragRef.current = null;
      clearOffset();
      if (!drag?.dragging) return;
      const max = panel!.offsetHeight - PEEK_PX;
      const delta = drag.lastY - drag.startY;
      const dt = Math.max(1, Date.now() - drag.startTime);
      const velocity = delta / dt;
      const openByVelocity = velocity < -0.4;
      const closeByVelocity = velocity > 0.4;
      const openByDistance = delta < -max * SNAP_THRESHOLD;
      const closeByDistance = delta > max * SNAP_THRESHOLD;

      if (open) {
        if (closeByVelocity || closeByDistance) onClose("drag_handle");
      } else if (openByVelocity || openByDistance) {
        onOpen("drag_handle");
      }
    }

    handle.addEventListener("touchstart", onTouchStart, { passive: true });
    handle.addEventListener("touchmove", onTouchMove, { passive: true });
    handle.addEventListener("touchend", onTouchEnd);
    return () => {
      handle.removeEventListener("touchstart", onTouchStart);
      handle.removeEventListener("touchmove", onTouchMove);
      handle.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyOffset, clearOffset, handleRef, onClose, onOpen, open, panelRef]);
}
