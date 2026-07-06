import Link from "next/link";
import { appPath } from "@/lib/config";
import { getRevenueCtasForPage, type RevenueCta } from "@/lib/seo/revenueModules";

interface Props {
  isStudentArea?: boolean;
  isSociety?: boolean;
  extraCtas?: RevenueCta[];
}

export default function RevenueCtaBlock({ isStudentArea, isSociety, extraCtas }: Props) {
  const ctas = extraCtas ?? getRevenueCtasForPage({ isStudentArea, isSociety, maxItems: 6 });
  if (!ctas.length) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10" aria-labelledby="revenue-cta-heading">
      <h2 id="revenue-cta-heading" className="rp-section-title text-lg">
        For owners &amp; partners
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ctas.map((cta) => (
          <Link
            key={cta.id}
            href={appPath(cta.href)}
            data-cta={cta.id}
            data-location="seo-revenue"
            className={`rp-card block p-5 no-underline transition hover:border-[var(--brand-orange)] ${
              cta.variant === "primary" ? "border-[var(--brand-orange)]" : ""
            }`}
          >
            <p className="font-semibold text-[var(--brand-navy)]">{cta.label}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{cta.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
