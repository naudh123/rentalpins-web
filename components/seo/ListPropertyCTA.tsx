import Link from "next/link";
import {
  getBrowseHref,
  getListPropertyHref,
  type SupplyIntent,
} from "@/lib/seo-links";

export type ListPropertyCTAVariant = "hero" | "inline" | "bottom" | "blog";

interface Props {
  cityName?: string;
  areaName?: string;
  categoryName?: string;
  intent?: SupplyIntent;
  variant?: ListPropertyCTAVariant;
  browseHref?: string;
  listHref?: string;
  citySlug?: string;
  areaSlug?: string;
}

const TRUST_POINTS = [
  "Free listing for owners",
  "Direct renter inquiries",
  "Map-based discovery",
  "Flats, PGs, houses, shops, offices and warehouses supported",
  "Manage listings from the app",
] as const;

function headline({
  cityName,
  areaName,
  intent,
  variant,
}: Pick<Props, "cityName" | "areaName" | "intent" | "variant">): string {
  if (variant === "blog") {
    return "Have a property in this area?";
  }
  if (intent === "commercial" && cityName) {
    return `Own a shop, office, warehouse or commercial space in ${cityName}?`;
  }
  if (areaName && cityName && areaName !== cityName) {
    return `Own a flat, PG or house in ${areaName}?`;
  }
  if (cityName) {
    return `Own a property in ${cityName}?`;
  }
  return "Own a rental property?";
}

function bodyCopy({
  cityName,
  areaName,
  categoryName,
  intent,
  variant,
}: Pick<Props, "cityName" | "areaName" | "categoryName" | "intent" | "variant">): string {
  if (variant === "blog") {
    return "List it on RentalPins and connect directly with renters browsing the map — no tenant search commission.";
  }

  const place = areaName && cityName && areaName !== cityName ? areaName : cityName ?? "your area";

  if (intent === "commercial") {
    return `List your shop, office, warehouse or commercial unit in ${place} free on RentalPins. Renters discover your pin on the map and message you directly.`;
  }
  if (intent === "pg" || intent === "hostel") {
    return `List your PG or hostel in ${place} on RentalPins. Students and professionals browse map pins and contact owners without broker search fees.`;
  }
  if (categoryName) {
    return `List your ${categoryName.toLowerCase()} in ${place} free on RentalPins. Reach renters already searching this category on the map.`;
  }

  return `List your flat, house, PG, shop, office or warehouse in ${place} free on RentalPins. Owners receive inquiries directly from interested renters.`;
}

const VARIANT_STYLES: Record<ListPropertyCTAVariant, string> = {
  hero: "mx-auto max-w-3xl px-4 py-8",
  inline: "mx-auto max-w-4xl px-4 py-10",
  bottom: "mx-auto max-w-3xl px-4 py-8",
  blog: "my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8",
};

export default function ListPropertyCTA({
  cityName,
  areaName,
  categoryName,
  intent = "general",
  variant = "inline",
  browseHref,
  listHref,
  citySlug,
  areaSlug,
}: Props) {
  const browse = browseHref ?? getBrowseHref({ placeQuery: areaName ?? cityName });
  const list = listHref ?? getListPropertyHref({ citySlug, areaSlug, intent });
  const locationAttr = variant === "blog" ? "blog" : variant;

  const isCompact = variant === "blog" || variant === "bottom";

  return (
    <section
      aria-labelledby={`list-property-cta-${locationAttr}`}
      className={VARIANT_STYLES[variant]}
    >
      <div
        className={
          variant === "hero"
            ? "rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8"
            : variant === "blog"
              ? ""
              : "rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 p-6 sm:p-8"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
          For property owners
        </p>
        <h2
          id={`list-property-cta-${locationAttr}`}
          className={`mt-2 font-serif text-[var(--brand-navy)] ${
            isCompact ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {headline({ cityName, areaName, intent, variant })}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          {bodyCopy({ cityName, areaName, categoryName, intent, variant })}
        </p>

        {!isCompact ? (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-[var(--muted)]"
              >
                <span className="mt-1 text-[var(--accent)]" aria-hidden>
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={list}
            data-cta="list-property-free"
            data-cta-location={locationAttr}
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-primary px-6 py-2.5"
          >
            List Property Free
          </Link>
          <Link
            href={browse}
            data-cta="browse-rentals-map"
            data-cta-location={locationAttr}
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
          >
            Browse Rentals on Map
          </Link>
        </div>
      </div>
    </section>
  );
}
