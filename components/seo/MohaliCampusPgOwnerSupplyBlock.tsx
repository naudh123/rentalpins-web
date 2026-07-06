import Link from "next/link";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import { appPath } from "@/lib/config";
import {
  MOHALI_SECTOR81_CROSS_LINKS,
  MOHALI_CAMPUS_CONFIGS,
  type MohaliCampusId,
} from "@/lib/seo/mohali-sector81-seo-config";
import { getBrowseHref, getListPropertyHref } from "@/lib/seo-links";

interface Props {
  campus: MohaliCampusId;
}

export default function MohaliCampusPgOwnerSupplyBlock({ campus }: Props) {
  const config = MOHALI_CAMPUS_CONFIGS[campus];
  const browseHref = getBrowseHref({ placeQuery: config.placeQuery });
  const listHref = getListPropertyHref({ citySlug: "mohali", intent: campus === "jlpl" ? "property" : "pg" });

  return (
    <>
      <ListPropertyCTA
        variant="inline"
        cityName="Mohali"
        areaName={`near ${config.institutionName}`}
        intent={campus === "jlpl" ? "property" : "pg"}
        browseHref={browseHref}
        listHref={listHref}
        citySlug="mohali"
      />

      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="text-sm font-semibold text-[var(--brand-navy)]">{config.crossLinksTitle}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {MOHALI_SECTOR81_CROSS_LINKS.map((item) => (
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
