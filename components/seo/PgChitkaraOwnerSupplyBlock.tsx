import Link from "next/link";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import { appPath } from "@/lib/config";
import { CHITKARA_PG_CROSS_LINKS } from "@/lib/seo/chitkara-seo-overrides";
import { getBrowseHref, getListPropertyHref } from "@/lib/seo-links";

export default function PgChitkaraOwnerSupplyBlock() {
  const browseHref = getBrowseHref({ placeQuery: "Rajpura, Chitkara University" });
  const listHref = getListPropertyHref({ citySlug: "chandigarh", intent: "pg" });

  return (
    <>
      <ListPropertyCTA
        variant="inline"
        cityName="Rajpura"
        areaName="near Chitkara University"
        intent="pg"
        browseHref={browseHref}
        listHref={listHref}
        citySlug="chandigarh"
      />

      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="text-sm font-semibold text-[var(--brand-navy)]">
          Chitkara belt — browse &amp; list
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {CHITKARA_PG_CROSS_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={appPath(item.href)}
                className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-orange)] no-underline hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
