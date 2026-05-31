"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/ga4";

const SHORTCUTS = [
  { keys: "/", action: "Focus location search" },
  { keys: "M", action: "Focus map" },
  { keys: "F", action: "Fit all results on map" },
  { keys: "L", action: "Cycle map / both / list (mobile)" },
  { keys: "↑ ↓", action: "Browse listings" },
  { keys: "Enter", action: "Open selected listing" },
  { keys: "Esc", action: "Clear selection" },
] as const;

export default function MapKeyboardHelp() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-20 hidden md:block">
      <button
        ref={buttonRef}
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 text-sm font-semibold text-[var(--brand-navy)] shadow-sm transition hover:border-[var(--brand-orange)]/40 hover:shadow-md"
        aria-expanded={open}
        aria-controls="map-keyboard-help-panel"
        aria-label="Keyboard shortcuts"
        onClick={() => {
          setOpen((v) => {
            if (!v) trackEvent("map_keyboard_help_opened");
            return !v;
          });
        }}
      >
        ?
      </button>
      {open && (
        <div
          id="map-keyboard-help-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Map keyboard shortcuts"
          className="absolute right-0 top-11 w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/98 p-4 shadow-[0_12px_40px_rgba(30,58,110,0.15)] backdrop-blur-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]">
            Shortcuts
          </p>
          <ul className="mt-3 space-y-2.5">
            {SHORTCUTS.map((s) => (
              <li key={s.keys} className="flex items-start justify-between gap-3 text-xs">
                <kbd className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--brand-navy)]">
                  {s.keys}
                </kbd>
                <span className="text-right text-[var(--muted)]">{s.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
