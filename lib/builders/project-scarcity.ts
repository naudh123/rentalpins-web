import type { InventorySummary } from "@/lib/types/builder-microsite";

export function formatAvailabilityLabel(summary: InventorySummary): string | null {
  if (summary.total === 0) return null;
  if (summary.available === 0) return "Sold out — join waitlist";
  if (summary.available === 1) return "Only 1 unit left";
  if (summary.available <= 5) return `Only ${summary.available} units left`;
  return `${summary.available} units available`;
}

export function formatPossessionLabel(possessionDate: string | null): string | null {
  if (!possessionDate?.trim()) return null;
  const d = new Date(possessionDate);
  if (Number.isNaN(d.getTime())) return `Possession ${possessionDate}`;
  return `Possession ${d.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
}

export function daysUntilLaunch(launchDate: string | null): number | null {
  if (!launchDate?.trim()) return null;
  const target = new Date(launchDate);
  if (Number.isNaN(target.getTime())) return null;
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
