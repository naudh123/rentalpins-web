import Link from "next/link";
import {
  getBrowseHref,
  getListPropertyHref,
  type SupplyIntent,
} from "@/lib/seo-links";

interface Props {
  browseHref?: string;
  listHref?: string;
  citySlug?: string;
  areaSlug?: string;
  intent?: SupplyIntent;
  placeQuery?: string;
}

/** Mobile-only sticky dual CTA for SEO landing pages. */
export default function StickySeoCTA({
  browseHref,
  listHref,
  citySlug,
  areaSlug,
  intent = "general",
  placeQuery,
}: Props) {
  const browse = browseHref ?? getBrowseHref({ placeQuery });
  const list = listHref ?? getListPropertyHref({ citySlug, areaSlug, intent });

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
        role="region"
        aria-label="Quick actions"
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <Link
            href={browse}
            data-cta="sticky-browse-rentals"
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-secondary min-h-11 flex-1 px-3 py-2.5 text-sm"
          >
            Browse
          </Link>
          <Link
            href={list}
            data-cta="sticky-list-property"
            data-city={citySlug ?? ""}
            data-area={areaSlug ?? ""}
            data-intent={intent}
            className="rp-btn rp-btn-primary min-h-11 flex-1 px-3 py-2.5 text-sm"
          >
            List Free
          </Link>
        </div>
      </div>
      {/* Prevent sticky bar covering footer on mobile */}
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
