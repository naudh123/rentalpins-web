import Link from "next/link";
import {
  indianRentalPagePath,
  type RentalAreaNearbyLink,
} from "@/lib/rental-area-config";
import { buyPagePath } from "@/lib/sale/buy-pages-config";
import { BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { appPath } from "@/lib/config";

interface Props {
  nearbyAreas: RentalAreaNearbyLink[];
  currentHub?: string;
  currentArea?: string;
  showBuyLinks?: boolean;
}

function linkKey(item: RentalAreaNearbyLink): string {
  return item.areaSlug ? `${item.hubSlug}/${item.areaSlug}` : item.hubSlug;
}

function isActive(
  item: RentalAreaNearbyLink,
  currentHub?: string,
  currentArea?: string
): boolean {
  if (item.hubSlug !== currentHub) return false;
  return (item.areaSlug ?? undefined) === (currentArea ?? undefined);
}

export default function IndiaRentalAreaLinks({
  nearbyAreas,
  currentHub,
  currentArea,
  showBuyLinks = true,
}: Props) {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="rp-section-title text-xl">Nearby rental areas</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {nearbyAreas.map((item) => (
            <li key={linkKey(item)}>
              <Link
                href={appPath(indianRentalPagePath(item.hubSlug, item.areaSlug))}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item, currentHub, currentArea)
                    ? "border-[var(--accent)] bg-orange-50 text-[var(--brand-navy)]"
                    : "border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--accent)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {showBuyLinks && nearbyAreas.length > 0 && (
        <section className="mx-auto max-w-4xl border-t border-[var(--border-subtle)] px-4 py-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Properties for sale nearby
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            RentalPins Buy — owner-direct sale listings in the same localities.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearbyAreas.map((item) => (
              <li key={`buy-${linkKey(item)}`}>
                <Link
                  href={appPath(buyPagePath(item.hubSlug, item.areaSlug))}
                  className="rounded-full border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_6%,white)] px-4 py-2 text-sm font-medium text-[var(--brand-navy)] transition-colors hover:border-[var(--sale-gold)]"
                >
                  Buy · {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={appPath(BUY_SEARCH_PATH)}
                className="rounded-full border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_10%,white)] px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] hover:border-[var(--sale-gold)]"
              >
                Open buy map
              </Link>
            </li>
            <li>
              <Link
                href={appPath("/flats-for-sale")}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--sale-gold)]"
              >
                Flats for sale India
              </Link>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}
