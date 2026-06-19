"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import { NOIDA_GSC_LINKS } from "@/lib/seo/noida-gsc-config";

interface Props {
  title?: string;
  className?: string;
}

export default function NoidaGscHubLinks({
  title = "Noida rental guides",
  className = "",
}: Props) {
  return (
    <section
      className={`mx-auto max-w-4xl px-4 py-8 ${className}`.trim()}
      aria-labelledby="noida-gsc-links-heading"
    >
      <h2 id="noida-gsc-links-heading" className="rp-section-title text-lg">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Quick links to Noida locality pages — Sector 62, Sector 18, Sector 137, Greater Noida and more.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {NOIDA_GSC_LINKS.map((item) => (
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
