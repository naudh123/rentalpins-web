"use client";

import { useEffect, type RefObject } from "react";

interface Options {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: Options): void {
  useEffect(() => {
    if (!active) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const queryFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
      );

    const initial = initialFocusRef?.current ?? queryFocusable()[0];
    initial?.focus();

    const panel = container;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = queryFocusable();
      if (!items.length) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (!activeEl || activeEl === first || !panel.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (!activeEl || activeEl === last || !panel.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef, initialFocusRef, onEscape]);
}
