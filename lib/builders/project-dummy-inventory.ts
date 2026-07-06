import type { ProjectType } from "@/lib/types/builder-microsite";

export interface DummyInventoryCounts {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  comingSoonUnits: number;
}

function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Plausible demo inventory — deterministic per project slug. */
export function buildDummyInventoryForProject(opts: {
  slug: string;
  projectType: ProjectType;
}): DummyInventoryCounts {
  const h = hashSlug(opts.slug);
  const roll = (max: number) => h % max;

  const baseTotal =
    opts.projectType === "plots"
      ? 180 + roll(420)
      : opts.projectType === "apartments" || opts.projectType === "villas"
        ? 80 + roll(220)
        : opts.projectType === "commercial" || opts.projectType === "mixed-use"
          ? 40 + roll(120)
          : opts.projectType === "industrial"
            ? 25 + roll(75)
            : 60 + roll(140);

  const availablePct = 0.1 + (roll(12) / 100);
  const reservedPct = 0.04 + (roll(6) / 100);
  const comingSoonPct = 0.02 + (roll(5) / 100);

  let available = Math.max(3, Math.round(baseTotal * availablePct));
  let reserved = Math.max(1, Math.round(baseTotal * reservedPct));
  let comingSoon = Math.max(0, Math.round(baseTotal * comingSoonPct));
  let sold = baseTotal - available - reserved - comingSoon;

  if (sold < 0) {
    const overflow = -sold;
    sold = 0;
    available = Math.max(0, available - overflow);
  }

  if (sold < Math.round(baseTotal * 0.35)) {
    sold = Math.round(baseTotal * (0.45 + roll(25) / 100));
    const used = sold + available + reserved + comingSoon;
    if (used > baseTotal) {
      available = Math.max(3, available - (used - baseTotal));
    }
  }

  const total = available + reserved + sold + comingSoon;

  return {
    totalUnits: total,
    availableUnits: available,
    reservedUnits: reserved,
    soldUnits: sold,
    comingSoonUnits: comingSoon,
  };
}
