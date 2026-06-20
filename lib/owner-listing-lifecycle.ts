/** Owner property lifecycle — live, draft, expired, rented. */

export type OwnerListingStatus = "live" | "draft" | "expired" | "rented" | "archived";

export type OwnerListingSource =
  | "listings"
  | "deactivated_listings"
  | "archived_listings";

export type ExpiryUrgency = "ok" | "soon" | "critical";

export function deriveOwnerListingStatus(
  data: Record<string, unknown>,
  source: OwnerListingSource
): OwnerListingStatus {
  if (source === "archived_listings") return "archived";
  if (source === "listings") {
    return data.isActive === true ? "live" : "draft";
  }
  const reason =
    typeof data.deactivatedReason === "string" ? data.deactivatedReason : "expired";
  if (reason === "rented" || reason === "sold") return "rented";
  return "expired";
}

export function ownerListingStatusLabel(
  status: OwnerListingStatus,
  options?: { transactionType?: "rent" | "sale"; deactivatedReason?: string }
): string {
  if (status === "rented" && options?.deactivatedReason === "sold") return "Sold";
  if (status === "rented") {
    return options?.transactionType === "sale" ? "Sold" : "Rented";
  }
  switch (status) {
    case "live":
      return "Live";
    case "draft":
      return "Draft";
    case "expired":
      return "Expired";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

export function ownerListingStatusHint(status: OwnerListingStatus): string {
  switch (status) {
    case "live":
      return "Tap to edit · Mark as rented when leased";
    case "draft":
      return "Activate with a plan to go live";
    case "expired":
      return "Details saved — edit or re-list with one click";
    case "rented":
      return "Property saved — re-list when vacant";
    case "archived":
      return "Removed from your active inventory";
  }
}

export function timestampToMs(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const ts = v as { toMillis?: () => number } | undefined;
  if (ts && typeof ts.toMillis === "function") return ts.toMillis();
  return undefined;
}

export function daysUntilMs(targetMs: number | undefined): number | null {
  if (targetMs == null) return null;
  const diff = targetMs - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

/** Unpaid draft never had activation (no listingDeleteAt). */
export function isUnpaidDraft(data: Record<string, unknown>, source: OwnerListingSource): boolean {
  if (source !== "listings") return false;
  if (data.isActive === true) return false;
  return timestampToMs(data.listingDeleteAt) == null;
}

export function expiryUrgency(daysLeft: number | null): ExpiryUrgency {
  if (daysLeft == null) return "ok";
  if (daysLeft <= 3) return "critical";
  if (daysLeft <= 7) return "soon";
  return "ok";
}

export function expiryUrgencyClass(urgency: ExpiryUrgency): string {
  switch (urgency) {
    case "critical":
      return "text-red-700 font-semibold";
    case "soon":
      return "text-amber-700 font-medium";
    case "ok":
      return "text-[var(--muted)]";
  }
}

export function markClosedLabel(transactionType: "rent" | "sale"): string {
  return transactionType === "sale" ? "Mark as sold" : "Mark as rented";
}

export function statusBadgeClass(status: OwnerListingStatus): string {
  switch (status) {
    case "live":
      return "bg-emerald-50 text-emerald-700";
    case "draft":
      return "bg-amber-50 text-amber-800";
    case "expired":
      return "bg-slate-100 text-slate-700";
    case "rented":
      return "bg-violet-50 text-violet-800";
    case "archived":
      return "bg-neutral-100 text-neutral-600";
  }
}
