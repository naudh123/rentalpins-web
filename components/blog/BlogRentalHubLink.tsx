import Link from "next/link";
import type { BlogListingHub } from "@/lib/blog-related-listings";
import { appPath } from "@/lib/config";

export default function BlogRentalHubLink({ hub }: { hub: BlogListingHub }) {
  return (
    <aside
      aria-label={`Browse rentals in ${hub.placeName}`}
      className="mt-8 rounded-2xl border border-[#1E3A6E]/15 bg-[#1E3A6E]/5 p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[#E8501A]">
        Live map search
      </p>
      <p className="mt-2 font-serif text-lg font-bold text-[#1E3A6E]">
        Browse rentals in {hub.placeName}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        See owner-direct listings on the RentalPins map — filter by category,
        compare locations, and contact without brokerage.
      </p>
      <Link
        href={appPath(hub.hubHref)}
        className="mt-4 inline-flex items-center text-sm font-semibold text-[#E8501A] hover:underline"
      >
        Open {hub.placeName} rentals →
      </Link>
    </aside>
  );
}
