import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import {
  BuilderLuxuryShell,
  LuxuryBuilderCard,
  LuxuryGlassPanel,
  LuxuryIndexHero,
} from "@/components/builders/luxury/LuxuryUI";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listBuilders } from "@/lib/builders/builders-server";
import { builderPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";

export const metadata: Metadata = buildPageMetadata({
  title: "Verified Builders & Developers",
  description:
    "Browse verified builders and developers on RentalPins. View projects, plot availability, and enquire for site visits across Mohali, Chandigarh, and Tricity.",
  path: "/builders",
});

export default async function BuildersIndexPage() {
  const builders = await listBuilders(true);

  return (
    <MarketingShell>
      <BuilderLuxuryShell>
        <LuxuryIndexHero
          eyebrow="Curated Developers · Tricity"
          title="Premier Builders & Developers"
          description="Explore verified developers with bespoke project microsites, interactive master plans, live plot inventory, and private concierge enquiry — curated for discerning buyers."
        />

        <div className="mx-auto max-w-6xl px-4 py-16">
          {builders.length === 0 ? (
            <div className="lux-empty-state">
              <p className="font-serif text-xl font-bold text-[var(--lux-primary)]">Coming soon</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Premium builder profiles are being onboarded across Chandigarh Tricity.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {builders.map((b) => (
                <LuxuryBuilderCard
                  key={b.id}
                  href={appPath(builderPath(b.slug))}
                  name={b.name}
                  logoUrl={b.logoUrl || undefined}
                  coverUrl={b.coverImageUrl || undefined}
                  city={b.city ?? ""}
                  establishedYear={b.establishedYear}
                />
              ))}
            </div>
          )}

          <LuxuryGlassPanel className="mt-16 text-center">
            <p className="lux-eyebrow">For Developers</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[var(--lux-primary)] sm:text-3xl">
              Launch your branded portfolio of premium microsites
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--muted)]">
              Interactive master plans, live inventory, and qualified leads — all under your brand on
              RentalPins.
            </p>
            <Link href={appPath("/projects/post")} className="lux-btn-gold mt-6 inline-flex">
              List your project free
            </Link>
          </LuxuryGlassPanel>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}
