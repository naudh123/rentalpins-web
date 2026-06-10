import Link from "next/link";
import {
  getBrowseHref,
  getListPropertyHref,
  SEO_SUPPLY_GROWTH_NOTICE,
  type SupplyIntent,
} from "@/lib/seo-links";

interface Props {
  cityName: string;
  areaName?: string;
  nearbyAreas?: string[];
  rentalTypes?: string[];
  lowListings?: boolean;
  intent?: SupplyIntent;
  citySlug?: string;
  areaSlug?: string;
  browseHref?: string;
  listHref?: string;
}

export default function AreaSupplyDemandSection({
  cityName,
  areaName,
  nearbyAreas = [],
  rentalTypes = [],
  lowListings = false,
  intent = "property",
  citySlug,
  areaSlug,
  browseHref,
  listHref,
}: Props) {
  const place = areaName && areaName !== cityName ? areaName : cityName;
  const browse = browseHref ?? getBrowseHref({ placeQuery: place });
  const list = listHref ?? getListPropertyHref({ citySlug, areaSlug, intent });

  return (
    <section
      aria-labelledby="area-supply-demand-heading"
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
        <h2
          id="area-supply-demand-heading"
          className="font-serif text-xl text-[var(--brand-navy)] sm:text-2xl"
        >
          Looking for tenants in {place}?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Post your flat, house, PG, shop, office or warehouse and receive inquiries
          directly from interested renters browsing the RentalPins map.
        </p>

        {lowListings ? (
          <p
            role="status"
            className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950"
          >
            {SEO_SUPPLY_GROWTH_NOTICE}
          </p>
        ) : null}

        {rentalTypes.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Renters search for
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {rentalTypes.map((type) => (
                <li
                  key={type}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs text-[var(--brand-navy)]"
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {nearbyAreas.length > 0 ? (
          <p className="mt-5 text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--brand-navy)]">
              Popular nearby areas where renters search:
            </span>{" "}
            {nearbyAreas.join(", ")}.
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={list}
            data-cta="list-property-free"
            data-cta-location="area-supply"
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
            data-cta-location="area-supply"
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
