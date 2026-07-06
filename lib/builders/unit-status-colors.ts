import type { UnitStatus } from "@/lib/types/builder-microsite";

export const UNIT_STATUS_COLORS: Record<UnitStatus, string> = {
  available: "#16a34a",
  reserved: "#ea580c",
  sold: "#dc2626",
  "coming-soon": "#2563eb",
  hold: "#9333ea",
  "not-released": "#6b7280",
};

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  "coming-soon": "Coming Soon",
  hold: "Hold",
  "not-released": "Not Released",
};

export const UNIT_STATUS_BG: Record<UnitStatus, string> = {
  available: "lux-status-badge bg-[color-mix(in_srgb,var(--lux-accent)_18%,white)] text-[color-mix(in_srgb,var(--lux-accent)_65%,#166534)] border-[color-mix(in_srgb,var(--lux-accent)_35%,transparent)]",
  reserved: "lux-status-badge bg-[color-mix(in_srgb,var(--lux-accent)_14%,white)] text-[color-mix(in_srgb,var(--lux-accent)_50%,#92400e)] border-[color-mix(in_srgb,var(--lux-accent)_28%,transparent)]",
  sold: "lux-status-badge bg-[color-mix(in_srgb,var(--lux-primary)_10%,white)] text-[color-mix(in_srgb,var(--lux-primary)_70%,#991b1b)] border-[color-mix(in_srgb,var(--lux-primary)_20%,transparent)]",
  "coming-soon": "lux-status-badge bg-[color-mix(in_srgb,var(--lux-accent)_12%,white)] text-[color-mix(in_srgb,var(--lux-primary)_55%,#1d4ed8)] border-[color-mix(in_srgb,var(--lux-accent)_22%,transparent)]",
  hold: "lux-status-badge bg-[color-mix(in_srgb,var(--lux-primary)_8%,white)] text-[color-mix(in_srgb,var(--lux-primary)_60%,#6b21a8)] border-[color-mix(in_srgb,var(--lux-primary)_18%,transparent)]",
  "not-released": "lux-status-badge bg-[var(--lux-surface-elevated)] text-[var(--muted)] border-[var(--border)]",
};
