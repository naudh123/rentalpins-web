"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import { JAIPUR_GSC_LINKS } from "@/lib/seo/jaipur-gsc-config";

interface Props {
  title?: string;
  className?: string;
}

export default function JaipurGscHubLinks({
  title = "Jaipur rental guides",
  className = "",
}: Props) {
  return (
    <section
      className={`mx-auto max-w-4xl px-4 py-8 ${className}`.trim()}
      aria-labelledby="jaipur-gsc-links-heading"
    >
      <h2 id="jaipur-gsc-links-heading" className="rp-section-title text-lg">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Quick links to Jaipur locality pages — Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura and more.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {JAIPUR_GSC_LINKS.map((item) => (
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
