"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { InventorySummary } from "@/lib/types/builder-microsite";

const CARDS = [
  { key: "total" as const, label: "Total Units", accent: "lux-stat-accent-total" },
  { key: "available" as const, label: "Available", accent: "lux-stat-accent-available" },
  { key: "reserved" as const, label: "Reserved", accent: "lux-stat-accent-reserved" },
  { key: "sold" as const, label: "Sold", accent: "lux-stat-accent-sold" },
  { key: "comingSoon" as const, label: "Coming Soon", accent: "lux-stat-accent-soon" },
];

function AnimatedCounter({
  value,
  accent,
}: {
  value: number;
  accent: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduceMotion]);

  return (
    <p
      ref={ref}
      className={`mt-2 font-serif text-3xl font-bold tabular-nums ${accent}`}
    >
      {display}
    </p>
  );
}

export default function InventorySummaryCards({
  summary,
}: {
  summary: InventorySummary;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CARDS.map(({ key, label, accent }) => (
        <div key={key} className="lux-stat p-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {label}
          </p>
          <AnimatedCounter value={summary[key]} accent={accent} />
        </div>
      ))}
    </div>
  );
}
