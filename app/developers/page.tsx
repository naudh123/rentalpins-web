import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import PropertyAgentChat from "@/components/agent/PropertyAgentChat";
import { getPlatformOverview } from "@/lib/agent/knowledge";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { appPath, siteUrl } from "@/lib/config";
import { BUY_PROJECTS } from "@/lib/sale/buy-projects-config";

export const metadata: Metadata = buildPageMetadata({
  title: "PropTech platform showcase | RentalPins for developers",
  description:
    "RentalPins is Rudder Tech's reference real-estate platform: map-native rent & buy, AI agents, buyer demand, projects hub, and mobile parity — book a build like this.",
  path: "/developers",
  robots: { index: true, follow: true },
});

const DEVELOPERS = [
  {
    slug: "green-valley-builders",
    name: "Green Valley Builders",
    cities: ["Mohali"],
    projects: 1,
  },
  {
    slug: "tricity-builders",
    name: "Tricity Builders",
    cities: ["Mohali", "Zirakpur", "Panchkula"],
    projects: 3,
  },
];

const SHOWCASE_METRICS = [
  { label: "Automated tests", value: "390+" },
  { label: "Static routes (build)", value: "1,190+" },
  { label: "AI tools (agent)", value: "15" },
  { label: "Training entries", value: "20+ FAQs · rent/buy guides · market snapshots" },
];

export default function DevelopersPage() {
  const faqs = buildConversationalFaqs("developers", {});
  const platform = getPlatformOverview();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RentalPins PropTech Platform",
    applicationCategory: "BusinessApplication",
    url: `${siteUrl}${appPath("/developers")}`,
    description: platform.tagline,
    offers: {
      "@type": "Offer",
      description: "White-label PropTech development by Rudder Tech",
    },
  };

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <section className="rp-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
            Rudder Tech · PropTech reference build
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-5xl">
            RentalPins platform showcase
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            {platform.tagline} This live product demonstrates what we build for developers, brokers,
            and regional portals — map discovery, AI agents, monetization, and mobile parity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={appPath("/advisor")} className="rp-btn rp-btn-primary px-6 py-3">
              Try AI advisor
            </Link>
            <Link
              href={appPath("/buy/search")}
              className="rp-btn rounded-full border border-[var(--border)] px-6 py-3 font-semibold"
            >
              Live buy map
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="font-serif text-2xl text-[var(--brand-navy)]">Platform modules</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {platform.modules.map((mod) => (
            <li
              key={mod}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
            >
              {mod}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          {SHOWCASE_METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-[var(--border)] bg-white p-4 text-center"
            >
              <p className="text-2xl font-bold text-[var(--brand-navy)]">{m.value}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl text-[var(--brand-navy)]">Ask the showcase agent</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Trained on Tricity rent/buy guides, 20+ curated FAQs, market snapshots, projects, and
            white-label PropTech playbooks — with tools for map search, affordability, and lead
            handoff.
          </p>
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-4 md:p-6">
            <PropertyAgentChat surface="showcase" transactionType="sale" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="font-serif text-2xl text-[var(--brand-navy)]">Demo paths</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {platform.demoPaths.map((d) => (
            <Link
              key={d.path}
              href={appPath(d.path)}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
            >
              {d.label}
            </Link>
          ))}
        </div>

        <h2 className="mt-12 font-serif text-2xl text-[var(--brand-navy)]">Tech stack</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{platform.stack.join(" · ")}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8">
        <h2 className="font-serif text-2xl">Featured developers & projects</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sample inventory on <Link href={appPath("/buy/projects")} className="text-[var(--accent)] underline">/buy/projects</Link> — {BUY_PROJECTS.length} launch projects.
        </p>
        <ul className="mt-4 space-y-3">
          {DEVELOPERS.map((dev) => (
            <li key={dev.slug} className="rounded-xl border border-[var(--border)] p-4">
              <p className="font-semibold text-[var(--brand-navy)]">{dev.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {dev.projects} project(s) · {dev.cities.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-2xl border border-[var(--brand-navy)] bg-[var(--brand-navy)] p-8 text-center text-white">
          <h2 className="font-serif text-2xl">Build your PropTech platform</h2>
          <p className="mt-3 text-sm text-white/80">
            White-label RentalPins-style map discovery, AI agents, and seller monetization for your
            market. Rudder Tech ships web + Flutter + Firebase.
          </p>
          <Link
            href="https://rudder.tech/contact"
            className="rp-btn mt-6 inline-block bg-white px-6 py-3 font-semibold text-[var(--brand-navy)]"
          >
            Request a strategy call
          </Link>
          <p className="mt-4 text-xs text-white/60">
            Admin:{" "}
            <Link href={appPath("/admin/agent")} className="underline">
              Agent metrics dashboard
            </Link>
          </p>
        </div>
        <HubFaqSection faqs={faqs} className="mt-10" />
      </section>
    </MarketingShell>
  );
}
