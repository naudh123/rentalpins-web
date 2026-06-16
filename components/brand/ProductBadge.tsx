type Variant = "rent" | "buy" | "invest";

const STYLES: Record<Variant, string> = {
  rent: "border-[color-mix(in_srgb,var(--brand-orange)_40%,var(--border))] bg-[color-mix(in_srgb,var(--brand-orange)_12%,transparent)] text-[var(--brand-orange)]",
  buy: "border-[color-mix(in_srgb,var(--sale-gold)_45%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_12%,transparent)] text-[var(--brand-navy)]",
  invest:
    "border-[color-mix(in_srgb,var(--invest-emerald)_40%,var(--border))] bg-[color-mix(in_srgb,var(--invest-emerald)_10%,transparent)] text-[var(--invest-emerald)]",
};

const LABELS: Record<Variant, string> = {
  rent: "Rent",
  buy: "Buy",
  invest: "Invest",
};

interface Props {
  variant: Variant;
  className?: string;
}

export default function ProductBadge({ variant, className = "" }: Props) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${STYLES[variant]} ${className}`}
    >
      {LABELS[variant]}
    </span>
  );
}
