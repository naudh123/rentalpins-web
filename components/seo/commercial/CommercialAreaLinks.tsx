import Link from "next/link";
import {
  COMMERCIAL_LONDON_AREAS,
  commercialLondonAreaPath,
  commercialLondonHubPath,
  type CommercialLondonAreaConfig,
} from "@/lib/commercial-london-config";
import { appPath } from "@/lib/config";

interface Props {
  currentSlug?: string;
  nearbyAreas?: string[];
}

function areaBySlug(slug: string): CommercialLondonAreaConfig | undefined {
  return COMMERCIAL_LONDON_AREAS.find((a) => a.slug === slug);
}

export default function CommercialAreaLinks({
  currentSlug,
  nearbyAreas = [],
}: Props) {
  const nearby = nearbyAreas
    .map((slug) => areaBySlug(slug))
    .filter((a): a is CommercialLondonAreaConfig => Boolean(a));

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      {nearby.length > 0 && (
        <div className="mb-10">
          <h2 className="rp-section-title text-xl">Nearby commercial areas</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearby.map((area) => (
              <li key={area.slug}>
                <Link
                  href={appPath(commercialLondonAreaPath(area.slug))}
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--accent)]"
                >
                  {area.locationName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="rp-section-title text-xl">All London commercial hubs</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href={appPath(commercialLondonHubPath())}
              className={`block rounded-xl border p-4 text-sm font-medium transition-colors ${
                !currentSlug
                  ? "border-[var(--accent)] bg-orange-50 text-[var(--brand-navy)]"
                  : "border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--accent)]"
              }`}
            >
              London overview
            </Link>
          </li>
          {COMMERCIAL_LONDON_AREAS.map((area) => (
            <li key={area.slug}>
              <Link
                href={appPath(commercialLondonAreaPath(area.slug))}
                className={`block rounded-xl border p-4 text-sm font-medium transition-colors ${
                  currentSlug === area.slug
                    ? "border-[var(--accent)] bg-orange-50 text-[var(--brand-navy)]"
                    : "border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--accent)]"
                }`}
              >
                {area.h1}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
