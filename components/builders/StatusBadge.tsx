import type { UnitStatus } from "@/lib/types/builder-microsite";
import { UNIT_STATUS_BG, UNIT_STATUS_LABELS } from "@/lib/builders/unit-status-colors";

export default function StatusBadge({ status }: { status: UnitStatus | string }) {
  const key = status as UnitStatus;
  const cls = UNIT_STATUS_BG[key] || "lux-status-badge bg-[var(--lux-surface-elevated)] text-[var(--muted)] border-[var(--border)]";
  const label = UNIT_STATUS_LABELS[key] || status;
  return <span className={cls}>{label}</span>;
}
