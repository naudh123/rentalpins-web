import Link from "next/link";
import { appPath } from "@/lib/config";
import type { TopicClusterLink } from "@/lib/seo/topic-clusters";

interface Props {
  heading?: string;
  links: TopicClusterLink[];
  className?: string;
}

/** GEO entity cluster — related cities, areas, categories, guides, and buy/rent counterparts. */
export default function EntityClusterLinks({
  heading = "Related topics",
  links,
  className = "",
}: Props) {
  if (!links.length) return null;

  return (
    <nav className={className} aria-labelledby="entity-cluster-heading">
      <h2 id="entity-cluster-heading" className="font-serif text-xl text-[var(--brand-navy)]">
        {heading}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={appPath(link.href)}
              className="block rounded-xl border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand-orange)]"
            >
              <span className="font-semibold text-[var(--brand-navy)]">{link.label}</span>
              {link.description ? (
                <p className="mt-1 text-sm text-[var(--muted)]">{link.description}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
