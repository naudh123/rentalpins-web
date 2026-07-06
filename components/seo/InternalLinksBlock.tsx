import Link from "next/link";
import { appPath } from "@/lib/config";
import type { InternalLink } from "@/lib/seo/internalLinks";

interface Props {
  title?: string;
  links: InternalLink[];
}

export default function InternalLinksBlock({ title = "Related pages", links }: Props) {
  if (!links.length) return null;
  return (
    <section className="mx-auto max-w-3xl px-4 pb-8" aria-labelledby="internal-links-heading">
      <h2 id="internal-links-heading" className="text-sm font-semibold text-[var(--brand-navy)]">
        {title}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={appPath(l.href)} className="text-sm text-[var(--brand-orange)] hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
