import Link from "next/link";
import { appPath } from "@/lib/config";
import type { InternalLink } from "@/lib/seo/internalLinks";

interface Props {
  title?: string;
  links: InternalLink[];
}

export default function NearbyPlacesBlock({ title = "Nearby places", links }: Props) {
  if (!links.length) return null;
  return (
    <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="nearby-places-heading">
      <h2 id="nearby-places-heading" className="text-sm font-semibold text-[var(--brand-navy)]">
        {title}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href.startsWith("http") ? l.href : appPath(l.href)}
              className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-orange)] no-underline hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
