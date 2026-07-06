import type { SizeUnit } from "@/lib/types/builder-microsite";

export function formatIndianPrice(amount: number | null | undefined): string {
  if (amount == null || amount <= 0) return "Price on request";
  if (amount >= 1_00_00_000) {
    const cr = amount / 1_00_00_000;
    return `₹${Number.isInteger(cr) ? cr : cr.toFixed(2)} Cr`;
  }
  if (amount >= 1_00_000) return `₹${Math.round(amount / 1_00_000)} Lakh`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPriceRange(
  min: number | null,
  max: number | null
): string {
  if (min != null && max != null) {
    return `${formatIndianPrice(min)} – ${formatIndianPrice(max)}`;
  }
  if (min != null) return `From ${formatIndianPrice(min)}`;
  if (max != null) return `Up to ${formatIndianPrice(max)}`;
  return "Price on request";
}

const SIZE_UNIT_LABELS: Record<SizeUnit, string> = {
  "sq-yd": "sq yd",
  "sq-ft": "sq ft",
  marla: "marla",
  kanal: "kanal",
  acre: "acre",
};

export function formatSize(
  size: number | null,
  unit: SizeUnit = "sq-yd"
): string {
  if (size == null) return "—";
  return `${size.toLocaleString("en-IN")} ${SIZE_UNIT_LABELS[unit]}`;
}

export function formatSizeRange(
  min: number | null,
  max: number | null,
  unit: SizeUnit = "sq-yd"
): string {
  const label = SIZE_UNIT_LABELS[unit];
  if (min != null && max != null) return `${min} – ${max} ${label}`;
  if (min != null) return `${min}+ ${label}`;
  if (max != null) return `Up to ${max} ${label}`;
  return "—";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const num = digits.startsWith("91") ? digits : `91${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${text}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
