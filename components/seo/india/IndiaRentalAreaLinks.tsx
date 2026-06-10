import Link from "next/link";
import {
  indianRentalPagePath,
  type RentalAreaNearbyLink,
} from "@/lib/rental-area-config";
import { appPath } from "@/lib/config";

interface Props {
  nearbyAreas: RentalAreaNearbyLink[];
  currentHub?: string;
  currentArea?: string;
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
}: Props) {
  return (
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
  );
}
