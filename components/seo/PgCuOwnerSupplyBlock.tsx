import Link from "next/link";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import { appPath } from "@/lib/config";
import { CU_PG_CROSS_LINKS } from "@/lib/seo/mohali-seo-overrides";
import { getBrowseHref, getListPropertyHref } from "@/lib/seo-links";

/** Compact PG-owner block + CU corridor cross-links for the CU marketing landing. */
export default function PgCuOwnerSupplyBlock() {
  const browseHref = getBrowseHref({ placeQuery: "Kharar, Chandigarh University" });
  const listHref = getListPropertyHref({ citySlug: "kharar", intent: "pg" });

  return (
    <>
      <ListPropertyCTA
        variant="inline"
        cityName="Kharar"
        areaName="near Chandigarh University"
        intent="pg"
        browseHref={browseHref}
        listHref={listHref}
        citySlug="kharar"
        areaSlug="chandigarh-university"
      />

      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="text-sm font-semibold text-[var(--brand-navy)]">
          CU corridor — browse &amp; list
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {CU_PG_CROSS_LINKS.map((item) => (
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
