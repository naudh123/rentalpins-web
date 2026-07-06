import Link from "next/link";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import { appPath } from "@/lib/config";
import { PU_PG_CROSS_LINKS } from "@/lib/seo/pu-chandigarh-seo-overrides";
import { getBrowseHref, getListPropertyHref } from "@/lib/seo-links";

/** PG-owner block + PU sector cross-links for the Panjab University marketing landing. */
export default function PgPuOwnerSupplyBlock() {
  const browseHref = getBrowseHref({ placeQuery: "Sector 14, Panjab University, Chandigarh" });
  const listHref = getListPropertyHref({ citySlug: "chandigarh", intent: "pg" });

  return (
    <>
      <ListPropertyCTA
        variant="inline"
        cityName="Chandigarh"
        areaName="near Panjab University"
        intent="pg"
        browseHref={browseHref}
        listHref={listHref}
        citySlug="chandigarh"
      />

      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="text-sm font-semibold text-[var(--brand-navy)]">
          PU sector belt — browse &amp; list
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {PU_PG_CROSS_LINKS.map((item) => (
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
