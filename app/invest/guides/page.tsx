import type { Metadata } from "next";
import Link from "next/link";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { appPath } from "@/lib/config";
import { getInvestGuides } from "@/lib/invest/invest-guides";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_GUIDES_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Investment guides | RentalPins Invest",
  description:
    "Tricity property investment guides — Mohali, Zirakpur, Kharar, New Chandigarh, Aerocity, Kurali–Banur, and market insights.",
  path: INVEST_GUIDES_PATH,
});

export default function InvestGuidesPage() {
  const guides = getInvestGuides();

  return (
    <>
      <InvestPageHero
        title="Investment guides"
        subtitle="Locality and corridor guides with map links, due diligence context, and cross-links to rent comps and projects."
      />
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <ul className="invest-theme mt-8 space-y-4">
          {guides.map((g) => (
            <li key={g.path}>
              <Link
                href={appPath(g.path)}
                className="block rounded-xl border border-[var(--border)] bg-white p-5 no-underline transition hover:border-[color-mix(in_srgb,var(--invest-emerald)_30%,var(--border))]"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--invest-emerald)]">
                  {g.tag}
                </span>
                <h2 className="mt-2 font-serif text-lg text-[var(--brand-navy)]">{g.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
