"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import { MOHALI_GSC_LINKS, type MohaliGscLink } from "@/lib/seo/mohali-seo-overrides";

interface Props {
  title?: string;
  links?: MohaliGscLink[];
  className?: string;
}

export default function MohaliGscHubLinks({
  title = "Mohali rental guides",
  links = MOHALI_GSC_LINKS,
  className = "",
}: Props) {
  return (
    <section
      className={`mx-auto max-w-4xl px-4 py-8 ${className}`.trim()}
      aria-labelledby="mohali-gsc-links-heading"
    >
      <h2 id="mohali-gsc-links-heading" className="rp-section-title text-lg">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Quick links to Mohali sector pages, flats on the map, and PG near Chandigarh University.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={appPath(item.href)}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-navy)] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
