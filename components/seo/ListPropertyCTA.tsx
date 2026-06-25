import Link from "next/link";
import {
  getBrowseHref,
  getListForSaleHref,
  getListPropertyHref,
  getSupplyLandingHref,
  type SupplyIntent,
} from "@/lib/seo-links";
import type { TransactionType } from "@/lib/transaction-type";

export type ListPropertyCTAVariant = "hero" | "inline" | "bottom" | "blog";

interface Props {
  cityName?: string;
  areaName?: string;
  categoryName?: string;
  intent?: SupplyIntent;
  variant?: ListPropertyCTAVariant;
  transactionType?: TransactionType;
  browseHref?: string;
  listHref?: string;
  citySlug?: string;
  areaSlug?: string;
  categorySlug?: string;
  headlineOverride?: string;
  bodyOverride?: string;
  supplyLandingHref?: string;
}

const RENT_TRUST_POINTS = [
  "Free listing",
  "Direct renter inquiries",
  "Map-based discovery",
  "Flats, PGs, houses, shops, offices and warehouses supported",
  "Manage listings from the app",
] as const;

const SALE_TRUST_POINTS = [
  "Free listing",
  "Direct buyer inquiries",
  "Curated sale map",
  "Flats, villas, plots and independent houses",
  "Owner-direct discovery",
] as const;

function headline({
  cityName,
  areaName,
  intent,
  variant,
  transactionType,
}: Pick<Props, "cityName" | "areaName" | "intent" | "variant" | "transactionType">): string {
  const isSale = transactionType === "sale";
  if (variant === "blog") {
    return isSale ? "Selling property in this area?" : "Have a property in this area?";
  }
  if (intent === "pg" || intent === "hostel") {
    if (areaName?.toLowerCase().includes("chandigarh university")) {
      return "Own a PG near Chandigarh University?";
    }
    if (areaName && areaName !== cityName) {
      return `Own a PG in ${areaName}?`;
    }
    if (cityName) {
      return `Own a PG in ${cityName}?`;
    }
    return "Own a PG or hostel?";
  }
  if (intent === "flat" && cityName) {
    return `Own a flat in ${cityName}?`;
  }
  if (intent === "commercial" && cityName) {
    return `Own a shop, office, warehouse or commercial space in ${cityName}?`;
  }
  if (areaName && cityName && areaName !== cityName) {
    return `Own a flat, PG or house in ${areaName}?`;
  }
  if (cityName) {
    return isSale ? `Selling property in ${cityName}?` : `Own a property in ${cityName}?`;
  }
  return isSale ? "Selling a property?" : "Own a rental property?";
}

function bodyCopy({
  cityName,
  areaName,
  categoryName,
  intent,
  variant,
  transactionType,
}: Pick<
  Props,
  "cityName" | "areaName" | "categoryName" | "intent" | "variant" | "transactionType"
>): string {
  const isSale = transactionType === "sale";
  if (variant === "blog") {
    return isSale
      ? "List for sale on RentalPins Buy and connect directly with buyers."
      : "List it on RentalPins and connect directly with tenants.";
  }

  const place = areaName && cityName && areaName !== cityName ? areaName : cityName ?? "your area";

  if (isSale) {
    return `List your flat, villa, or plot in ${place} for sale on RentalPins Buy. Buyers browse map pins and message sellers directly.`;
  }

  if (intent === "pg" || intent === "hostel") {
    if (areaName?.toLowerCase().includes("chandigarh university")) {
      return "List your PG free on RentalPins and reach students searching nearby.";
    }
    return `List your PG or hostel in ${place} on RentalPins. Students and professionals browse map pins and contact owners directly.`;
  }
  if (intent === "flat" && cityName) {
    if (cityName === "Delhi") {
      return "List your flat free and connect directly with renters.";
    }
    if (cityName === "Mohali") {
      return "List your flat free on RentalPins. Flats, apartments, houses and PGs are welcome.";
    }
    return `List your rental property free and connect with local renters in ${cityName}.`;
  }
  if (intent === "commercial") {
    return `List your shop, office, warehouse or commercial unit in ${place} free on RentalPins. Renters discover your pin on the map and message you directly.`;
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
  transactionType = "rent",
  browseHref,
  listHref,
  citySlug,
  areaSlug,
  categorySlug,
  headlineOverride,
  bodyOverride,
  supplyLandingHref: supplyLandingHrefProp,
}: Props) {
  const isSale = transactionType === "sale";
  const browse =
    browseHref ??
    getBrowseHref({
      placeQuery: areaName ?? cityName,
      transactionType,
    });
  const list =
    listHref ??
    (isSale
      ? getListForSaleHref({ citySlug, areaSlug, intent })
      : getListPropertyHref({ citySlug, areaSlug, intent }));
  const trustPoints = isSale ? SALE_TRUST_POINTS : RENT_TRUST_POINTS;
  const listCta = isSale ? "list-for-sale" : "list-property-free";
  const browseCta = isSale ? "browse-sale-listings" : "browse-rentals";
  const listLabel = isSale ? "List for Sale" : "List Property Free";
  const browseLabel = isSale ? "Explore Sale Map" : "Browse Rentals";
  const ownerEyebrow = isSale ? "For property sellers" : "For property owners";
  const supplyLanding =
    supplyLandingHrefProp ??
    getSupplyLandingHref({
      citySlug,
      areaSlug,
      categorySlug,
      intent,
    });
  const locationAttr = variant === "blog" ? "blog" : variant;

  const isCompact = variant === "blog" || variant === "bottom";
  const resolvedHeadline =
    headlineOverride ??
    headline({ cityName, areaName, intent, variant, transactionType });
  const resolvedBody =
    bodyOverride ??
    bodyCopy({ cityName, areaName, categoryName, intent, variant, transactionType });

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
          {ownerEyebrow}
        </p>
        <h2
          id={`list-property-cta-${locationAttr}`}
          className={`mt-2 font-serif text-[var(--brand-navy)] ${
            isCompact ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {resolvedHeadline}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          {resolvedBody}
        </p>

        {!isCompact ? (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {trustPoints.map((point) => (
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
            data-cta={listCta}
            data-location={locationAttr}
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-primary px-6 py-2.5"
          >
            {listLabel}
          </Link>
          <Link
            href={browse}
            data-cta={browseCta}
            data-location={locationAttr}
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
          >
            {browseLabel}
          </Link>
        </div>

        {variant !== "blog" && cityName && !isSale ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            <Link
              href={supplyLanding}
              data-cta="supply-landing-link"
              data-location={locationAttr}
              data-city={citySlug ?? ""}
              data-area={areaSlug ?? ""}
              data-intent={intent}
              className="font-medium text-[var(--brand-orange)] hover:underline"
            >
              Owner? Learn how to list in {cityName} free →
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
