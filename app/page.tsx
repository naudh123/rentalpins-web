import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HomeRecentlyViewed from "@/components/listings/HomeRecentlyViewed";
import MarketingShell from "@/components/MarketingShell";
import { JsonLdFAQ } from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import TrustStats from "@/components/seo/TrustStats";
import { appPath } from "@/lib/config";
import { getAllCities, rentalCityPath } from "@/lib/cities-config";
import { MAIN_CATEGORIES } from "@/lib/categories";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import { PLAY_STORE_URL } from "@/lib/site-links";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { canonicalUrl } from "@/lib/seo";

const CATEGORY_ICONS: Record<string, string> = {
  Property: "🏠",
  Vehicles: "🚗",
  "Electronics & Gadgets": "💻",
  "Home Appliances": "🍳",
  Furniture: "🛋️",
  "Heavy Machinery": "🏗️",
  "Construction Equipment": "🔧",
  "Event & Production": "🎬",
  Others: "📦",
};

const OWNER_BENEFITS = [
  { title: "Post property FREE", desc: "List rooms, flats, PG, vehicles and more at no listing fee." },
  { title: "Reach real tenants", desc: "Thousands browse the live map — no broker middleman." },
  { title: "WhatsApp & chat leads", desc: "Get enquiries directly from verified renters." },
  { title: "OTP-verified users", desc: "Safer conversations with phone-verified accounts." },
  { title: "9 rental categories", desc: "Property, vehicles, electronics, furniture and more." },
  { title: "Map visibility", desc: "Your pin appears on the same map as the Android app." },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Browse the map", desc: "Open map search, pan to your city, and explore price pins." },
  { step: "2", title: "Filter & compare", desc: "Use categories, budget, and area filters to narrow results." },
  { step: "3", title: "Contact the owner", desc: "Message via WhatsApp, call, or in-app chat — no broker." },
  { step: "4", title: "List in minutes", desc: "Owners post free, verify by phone, and go live on the map." },
];

const TRUST_BADGES = [
  "OTP-verified users",
  "No broker fees",
  "Free to list",
  "9 rental categories",
];

const FAQS = [
  {
    q: "Is RentalPins free to use?",
    a: "Yes — browsing and contacting owners is free. Owners can list property and items at no charge in supported cities.",
  },
  {
    q: "How do I contact a rental owner?",
    a: "Tap any pin on the map to see details. Contact via WhatsApp, direct call, or in-app chat.",
  },
  {
    q: "What can I rent on RentalPins?",
    a: "Nine categories: Property, Vehicles, Electronics, Home Appliances, Furniture, Heavy Machinery, Construction Equipment, Event & Production, and Others.",
  },
  {
    q: "Is RentalPins available in my city?",
    a: "We are live in Chandigarh Tricity, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai, London, Nairobi, and Lagos — with more cities coming soon.",
  },
  {
    q: "How do I list my property or item?",
    a: "Sign in, tap Post listing, add photos and location, verify your phone, and your pin goes live on the map.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title:
    "RentalPins – Flats, Houses, PG, Shops & Commercial Property for Rent Without Broker",
  description:
    "Find flats, houses, PGs, shops, offices and commercial properties for rent across India. Contact owners directly without broker. Post your rental free on RentalPins.",
  path: "/",
  keywords: [
    "rent without broker",
    "flats for rent",
    "PG for rent",
    "commercial property rent",
    "Ludhiana rentals",
    "Chandigarh rentals",
    "property for rent India",
  ],
});

export default function HomePage() {
  const cities = getAllCities();
  const liveCount = cities.filter((c) => c.status === "live").length;
  const liveAreas = cities.flatMap((c) => c.areas).length;

  const topCities = cities.filter((c) => c.status === "live").slice(0, 8);

  return (
    <MarketingShell>
      <BreadcrumbSchema items={[{ name: "Home", url: canonicalUrl("/") }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "RentalPins — Property & rentals without broker",
          url: canonicalUrl("/"),
          description:
            "Map-first rental marketplace for flats, PG, shops, offices, warehouses and vehicles.",
          isPartOf: { "@type": "WebSite", name: "RentalPins", url: canonicalUrl("/") },
        }}
      />
      <JsonLdFAQ faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
      <div className="rp-gradient-hero">
        <section className="relative mx-auto max-w-5xl px-4 pb-12 pt-10 text-center md:pb-20 md:pt-16">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--brand-orange)] opacity-[0.06] blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto flex flex-col items-center">
            <Image
              src="/logo/logo.png"
              alt="RentalPins"
              width={120}
              height={120}
              className="h-24 w-24 object-contain sm:h-28 sm:w-28"
              priority
            />
            <p className="mt-4 font-serif text-sm font-medium tracking-wide text-[var(--brand-navy)]">
              Rent Anything, Anywhere
            </p>
          </div>

          <h1 className="mt-8 font-serif text-4xl leading-[1.08] tracking-tight text-[var(--brand-navy)] md:text-5xl lg:text-6xl">
            Find rentals on the map.
            <br />
            <span className="rp-wordmark-orange">Contact owners directly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Rooms, PG, flats, vehicles and more across India and global hubs — same
            listings as our Android app. Owners: post property{" "}
            <strong className="text-[var(--brand-navy)]">FREE</strong>.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href={appPath("/search")} className="rp-btn rp-btn-primary px-8 py-3.5 text-base">
              Explore on map
            </Link>
            <Link href={appPath("/post")} className="rp-btn rp-btn-secondary px-8 py-3.5 text-base">
              Post property FREE
            </Link>
          </div>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Also on{" "}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--brand-orange)] hover:underline"
            >
              Google Play
            </a>
          </p>

          <dl className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-3 text-center">
            {[
              { label: "Categories", value: "9" },
              { label: "Live cities", value: String(liveCount) },
              { label: "Contact", value: "WhatsApp" },
            ].map((s) => (
              <div key={s.label} className="rp-card px-2 py-4">
                <dt className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] sm:text-xs">
                  {s.label}
                </dt>
                <dd className="mt-1 font-serif text-lg text-[var(--brand-orange)] sm:text-xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <TrustStats
          stats={[
            { label: "Total Listings", value: "10,000+" },
            { label: "Cities Covered", value: String(cities.length) },
            { label: "Areas Covered", value: String(liveAreas) },
            { label: "Verified Listings", value: "95%+" },
            { label: "Active Users", value: "25,000+" },
            { label: "App Downloads", value: "50,000+" },
          ]}
        />

        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="rp-section-title text-center text-xl">Why list on RentalPins?</h2>
            <p className="mt-2 text-center text-sm text-[var(--muted)]">
              Built for owners — reach tenants without brokers
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OWNER_BENEFITS.map((b) => (
                <div key={b.title} className="rp-card p-5">
                  <h3 className="font-semibold text-[var(--brand-navy)]">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomeRecentlyViewed />

        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="rp-section-title text-center text-xl">Property rentals by type</h2>
            <p className="mt-2 text-center text-sm text-[var(--muted)]">
              No broker — browse owner listings on the map
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {RENTAL_CATEGORIES.filter((c) => c.mainCategory === "Property").map((cat) => (
                <Link
                  key={cat.slug}
                  href={appPath(`/rentals/in/ludhiana/${cat.slug}`)}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)] no-underline hover:border-[var(--brand-orange)]"
                >
                  {cat.pluralLabel}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-[var(--muted)]">
              Popular:{" "}
              <Link href={appPath("/rent-without-broker")} className="text-[var(--brand-orange)]">
                Rent without broker
              </Link>
              {" · "}
              <Link href={appPath("/flats-without-broker")} className="text-[var(--brand-orange)]">
                Flats without broker
              </Link>
              {" · "}
              <Link href={appPath("/download-app")} className="text-[var(--brand-orange)]">
                Download app
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="rp-section-title text-center text-xl">Top cities</h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {topCities.map((city) => (
              <Link
                key={`${city.countrySlug}-${city.slug}`}
                href={appPath(rentalCityPath(city.countrySlug, city.slug))}
                className="rp-card-interactive p-3 text-center text-sm font-semibold text-[var(--brand-navy)] no-underline"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="rp-section-title text-center text-xl">9 rental categories</h2>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            Property, vehicles, electronics, furniture and more — all on one map
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {MAIN_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={appPath(
                  `/search?category=${encodeURIComponent(cat)}`
                )}
                className="rp-card-interactive flex flex-col items-center p-4 text-center no-underline"
              >
                <span className="text-2xl" aria-hidden>
                  {CATEGORY_ICONS[cat] ?? "📦"}
                </span>
                <span className="mt-2 text-sm font-semibold text-[var(--brand-navy)]">{cat}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="rp-section-title text-center text-xl">How it works</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="rp-card p-5 text-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-orange)] text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-semibold text-[var(--brand-navy)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--brand-navy)]"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border-subtle)] px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="rp-section-title text-center text-xl">Browse by city</h2>
            <p className="mt-2 text-center text-sm text-[var(--muted)]">
              Area guides with live listings on the map
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => {
                const isLive = city.status === "live";
                return (
                  <Link
                    key={`${city.countrySlug}-${city.slug}`}
                    href={appPath(rentalCityPath(city.countrySlug, city.slug))}
                    className="rp-card-interactive group p-4 no-underline"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)]">
                        {city.name}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          isLive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isLive ? "Live" : "Coming soon"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                      {city.tagline}
                    </p>
                    <span className="mt-3 inline-block text-xs font-semibold text-[var(--brand-orange)]">
                      View areas →
                    </span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-8 text-center">
              <Link
                href={appPath("/rentals")}
                className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
              >
                All cities →
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Map search",
                desc: "Silver map, price pins, filters, and saved searches.",
                href: "/search",
                emoji: "🗺️",
              },
              {
                title: "WhatsApp & chat",
                desc: "Message owners in-app or on WhatsApp — no broker.",
                href: "/search",
                emoji: "💬",
              },
              {
                title: "List & go live",
                desc: "Draft on web, verify phone — synced with the app.",
                href: "/post",
                emoji: "📍",
              },
            ].map((f) => (
              <Link
                key={f.title}
                href={appPath(f.href)}
                className="rp-card-interactive block p-5 no-underline"
              >
                <span className="text-2xl" aria-hidden>
                  {f.emoji}
                </span>
                <h3 className="mt-3 font-serif text-lg text-[var(--brand-navy)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="rp-section-title text-center text-xl">Frequently asked questions</h2>
            <dl className="mt-8 space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="rp-card p-5">
                  <dt className="font-semibold text-[var(--brand-navy)]">{faq.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--brand-navy)] px-4 py-14 text-center text-white">
          <h2 className="font-serif text-2xl md:text-3xl">Ready to list or browse?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
            Free to browse. Owners verify by phone. Listings appear on the same map as
            millions of app users.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={appPath("/search")}
              className="rp-btn bg-white px-8 py-3.5 font-semibold text-[var(--brand-navy)] hover:brightness-95"
            >
              Open map
            </Link>
            <Link
              href={appPath("/post")}
              className="rp-btn border border-white/40 px-8 py-3.5 text-white hover:bg-white/10"
            >
              Post property FREE
            </Link>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
