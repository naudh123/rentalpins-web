"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BRAND, UI } from "@/lib/brand";
import { appPath } from "@/lib/config";
import { mapSearchUrl } from "@/lib/map-search-url";

// ─── URLs (SINGLE SOURCE — change here, changes everywhere) ──────────────────
const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.rentit_clean.rentit";

const PATHS = {
  home: appPath("/"),
  search: appPath("/search"),
  post: appPath("/post"),
  rentals: appPath("/rentals"),
  login: appPath("/auth/login"),
  blog: appPath("/blog"),
  about: appPath("/about"),
  contact: appPath("/contact"),
  privacy: appPath("/privacy-policy"),
  terms: appPath("/terms"),
  refund: appPath("/refund-policy"),
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AreaData {
  name: string;
  slug: string;
  parentCity: string;   // "" for city hub pages
  parentSlug: string;   // "" for city hub pages
  /** Country URL segment (in, uk, ke, ng) — always set for rental paths */
  parentCountrySlug: string;
  country: string;
  tagline: string;
  badge: string;
  primaryFocus: string;
  heroDescription: string;
  coordinates: { lat: number; lng: number };
  popularAreas: string[];
  topCategories: { name: string; color: string; icon: string; desc: string }[];
  popularSearches: string[];
  spokeLinks: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
  ctaHeading: string;
  ctaBody: string;
}

// ─── Cities data for navbar dropdown ──────────────────────────────────────────
const NAV_CITIES = [
  {
    hub: "Chandigarh Tricity",
    href: "/rentals/in/chandigarh",
    spokes: [
      { label: "Mohali", href: "/rentals/in/chandigarh/mohali" },
      { label: "Kharar", href: "/rentals/in/chandigarh/kharar" },
      { label: "Panchkula", href: "/rentals/in/chandigarh/panchkula" },
      { label: "Zirakpur", href: "/rentals/in/chandigarh/zirakpur" },
      { label: "Landran", href: "/rentals/in/chandigarh/landran" },
    ],
  },
  {
    hub: "Ludhiana",
    href: "/rentals/in/ludhiana",
    spokes: [
      { label: "Sarabha Nagar", href: "/rentals/in/ludhiana/sarabha-nagar" },
      { label: "Model Town", href: "/rentals/in/ludhiana/model-town" },
      { label: "Pakhowal Road", href: "/rentals/in/ludhiana/pakhowal-road" },
      { label: "BRS Nagar", href: "/rentals/in/ludhiana/brs-nagar" },
      { label: "Focal Point", href: "/rentals/in/ludhiana/focal-point" },
    ],
  },
  {
    hub: "Delhi",
    href: "/rentals/in/delhi",
    spokes: [
      { label: "Mukherjee Nagar", href: "/rentals/in/delhi/mukherjee-nagar" },
      { label: "GTB Nagar",       href: "/rentals/in/delhi/gtb-nagar" },
      { label: "Hudson Lane",     href: "/rentals/in/delhi/hudson-lane" },
      { label: "Dwarka",          href: "/rentals/in/delhi/dwarka" },
      { label: "Rohini",          href: "/rentals/in/delhi/rohini" },
      { label: "Jasola",          href: "/rentals/in/delhi/jasola" },
      { label: "Sarita Vihar",    href: "/rentals/in/delhi/sarita-vihar" },
    ],
  },
  {
    hub: "Jaipur",
    href: "/rentals/in/jaipur",
    spokes: [
      { label: "Malviya Nagar", href: "/rentals/in/jaipur/malviya-nagar" },
      { label: "Vaishali Nagar", href: "/rentals/in/jaipur/vaishali-nagar" },
      { label: "Mansarovar", href: "/rentals/in/jaipur/mansarovar" },
      { label: "Jagatpura", href: "/rentals/in/jaipur/jagatpura" },
      { label: "C-Scheme", href: "/rentals/in/jaipur/c-scheme" },
    ],
  },
  {
    hub: "Lucknow",
    href: "/rentals/in/lucknow",
    spokes: [
      { label: "Gomti Nagar", href: "/rentals/in/lucknow/gomti-nagar" },
      { label: "Indira Nagar", href: "/rentals/in/lucknow/indira-nagar-lucknow" },
      { label: "Aliganj", href: "/rentals/in/lucknow/aliganj" },
      { label: "Hazratganj", href: "/rentals/in/lucknow/hazratganj" },
      { label: "Aashiana", href: "/rentals/in/lucknow/aashiana" },
    ],
  },
  {
    hub: "Mumbai",
    href: "/rentals/in/mumbai",
    spokes: [
      { label: "Powai", href: "/rentals/in/mumbai/powai" },
      { label: "Andheri West", href: "/rentals/in/mumbai/andheri-west" },
      { label: "Bandra West", href: "/rentals/in/mumbai/bandra-west" },
      { label: "Goregaon", href: "/rentals/in/mumbai/goregaon" },
      { label: "Vashi", href: "/rentals/in/mumbai/vashi" },
    ],
  },
  {
    hub: "London",
    href: "/rentals/uk/london",
    spokes: [
      { label: "Camden", href: "/rentals/uk/london/camden" },
      { label: "Shoreditch", href: "/rentals/uk/london/shoreditch" },
      { label: "Westminster", href: "/rentals/uk/london/westminster" },
      { label: "Canary Wharf", href: "/rentals/uk/london/canary-wharf" },
      { label: "Kensington & Chelsea", href: "/rentals/uk/london/kensington-chelsea" },
    ],
  },
  {
    hub: "Nairobi",
    href: "/rentals/ke/nairobi",
    spokes: [
      { label: "Westlands", href: "/rentals/ke/nairobi/westlands" },
      { label: "Kilimani", href: "/rentals/ke/nairobi/kilimani" },
      { label: "Karen", href: "/rentals/ke/nairobi/karen" },
      { label: "Upper Hill", href: "/rentals/ke/nairobi/upper-hill" },
      { label: "Parklands", href: "/rentals/ke/nairobi/parklands" },
    ],
  },
  {
    hub: "Lagos",
    href: "/rentals/ng/lagos",
    spokes: [
      { label: "Lekki", href: "/rentals/ng/lagos/lekki" },
      { label: "Ikeja", href: "/rentals/ng/lagos/ikeja" },
      { label: "Victoria Island", href: "/rentals/ng/lagos/victoria-island" },
      { label: "Yaba", href: "/rentals/ng/lagos/yaba" },
      { label: "Ikoyi", href: "/rentals/ng/lagos/ikoyi" },
    ],
  },
];

// ─── Cities Dropdown ──────────────────────────────────────────────────────────
function CitiesDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const enter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const leave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 150); };
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div style={{ position: "relative" }} onMouseEnter={enter} onMouseLeave={leave}>
      <button onClick={() => setOpen(p => !p)} style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
        color: open ? BRAND.accent : BRAND.text, background: "none", border: "none",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 0",
      }}>
        Cities
        <span style={{ fontSize: 10, opacity: 0.6, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 8, zIndex: 300 }}>
          <div style={{ background: "#fff", border: `1px solid ${BRAND.border}`, borderRadius: 18, boxShadow: UI.shadowDropdown, padding: 18, minWidth: 720, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {NAV_CITIES.map(city => (
              <div key={city.hub}>
                <a href={city.href} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: BRAND.primary, textDecoration: "none", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{city.hub}</a>
                {city.spokes.map(s => (
                  <a key={s.href} href={s.href} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted, textDecoration: "none", padding: "3px 0" }}>› {s.label}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
// REMOVED: Pricing, How It Works, App Store placeholder
// FIXED: Play Store URL, all links point internal
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${BRAND.border}`, padding: "0 24px", height: 60,
      display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={PATHS.home} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <Image src="/logo/logo.png" alt="RentalPins" width={32} height={32} style={{ objectFit: "contain" }} priority />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: BRAND.primary }}>
            Rental<span style={{ color: BRAND.accent }}>Pins</span>
          </span>
        </a>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {(
            [
              ["Find Rentals", PATHS.search],
              ["List Property", PATHS.post],
            ] as const
          ).map(([label, href]) => (
            <a key={label} href={href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: BRAND.text, textDecoration: "none" }}>{label}</a>
          ))}
          <CitiesDropdown />
        </div>

        <div className="desktop-nav" style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <a href={PATHS.login} style={{
            padding: "8px 14px", borderRadius: 10, border: `1px solid ${BRAND.border}`,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.primary, textDecoration: "none",
          }}>Sign in</a>
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
            padding: "8px 16px", borderRadius: 10, background: BRAND.accent, color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(232, 80, 26, 0.35)",
          }}>Get Android App</a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 24, color: BRAND.primary,
        }} aria-label="Toggle menu">☰</button>
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "#fff", borderBottom: `1px solid ${BRAND.border}`, padding: "16px 24px 24px", zIndex: 200 }}>
          {([
            ["Browse Rentals", PATHS.search],
            ["List Property", PATHS.post],
            ["Chandigarh", "/rentals/in/chandigarh"],
            ["  Mohali", "/rentals/in/chandigarh/mohali"],
            ["  Kharar", "/rentals/in/chandigarh/kharar"],
            ["  Panchkula", "/rentals/in/chandigarh/panchkula"],
            ["  Zirakpur", "/rentals/in/chandigarh/zirakpur"],
            ["Ludhiana", "/rentals/in/ludhiana"],
            ["  Model Town", "/rentals/in/ludhiana/model-town"],
            ["  Sarabha Nagar", "/rentals/in/ludhiana/sarabha-nagar"],
            ["Delhi", "/rentals/in/delhi"],
            ["  Mukherjee Nagar", "/rentals/in/delhi/mukherjee-nagar"],
            ["  GTB Nagar", "/rentals/in/delhi/gtb-nagar"],
            ["  Hudson Lane", "/rentals/in/delhi/hudson-lane"],
            ["  Dwarka", "/rentals/in/delhi/dwarka"],
            ["  Rohini", "/rentals/in/delhi/rohini"],
            ["Jaipur", "/rentals/in/jaipur"],
            ["  Malviya Nagar", "/rentals/in/jaipur/malviya-nagar"],
            ["  Vaishali Nagar", "/rentals/in/jaipur/vaishali-nagar"],
            ["Lucknow", "/rentals/in/lucknow"],
            ["  Gomti Nagar", "/rentals/in/lucknow/gomti-nagar"],
            ["  Indira Nagar", "/rentals/in/lucknow/indira-nagar-lucknow"],
            ["Mumbai", "/rentals/in/mumbai"],
            ["  Powai", "/rentals/in/mumbai/powai"],
            ["  Andheri West", "/rentals/in/mumbai/andheri-west"],
            ["London", "/rentals/uk/london"],
            ["Nairobi", "/rentals/ke/nairobi"],
            ["Lagos", "/rentals/ng/lagos"],
          ] as const).map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "13px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: label.startsWith("  ") ? 400 : 500,
              color: label.startsWith("  ") ? BRAND.muted : BRAND.text,
              textDecoration: "none", borderBottom: `1px solid ${BRAND.border}`,
              paddingLeft: label.startsWith("  ") ? 16 : 0,
            }}>{label.startsWith("  ") ? `› ${label.trim()}` : label}</a>
          ))}
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", padding: "12px 0", borderRadius: 8,
            background: BRAND.accent, color: "#fff", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600, textDecoration: "none", marginTop: 16,
          }}>Get Android App</a>
        </div>
      )}
    </nav>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
// REMOVED: Pricing, How It Works, FAQ, Find a Rental (404), List Property (404)
// FIXED: Branding "RentalPins", social links, Play Store URL
function Footer() {
  const cols = [
    {
      title: "PLATFORM",
      links: [
        { label: "Map search", href: PATHS.search },
        { label: "Post a listing", href: PATHS.post },
        { label: "Sign in", href: PATHS.login },
        { label: "Get Android App", href: PLAY_URL },
      ],
    },
    {
      title: "CITIES",
      links: [
        { label: "Chandigarh Tricity", href: "/rentals/in/chandigarh" },
        { label: "Mohali", href: "/rentals/in/chandigarh/mohali" },
        { label: "Ludhiana", href: "/rentals/in/ludhiana" },
        { label: "Delhi", href: "/rentals/in/delhi" },
        { label: "Mukherjee Nagar", href: "/rentals/in/delhi/mukherjee-nagar" },
        { label: "GTB Nagar", href: "/rentals/in/delhi/gtb-nagar" },
        { label: "Dwarka", href: "/rentals/in/delhi/dwarka" },
        { label: "Rohini", href: "/rentals/in/delhi/rohini" },
        { label: "Jaipur", href: "/rentals/in/jaipur" },
        { label: "Malviya Nagar (Jaipur)", href: "/rentals/in/jaipur/malviya-nagar" },
        { label: "Lucknow", href: "/rentals/in/lucknow" },
        { label: "Gomti Nagar", href: "/rentals/in/lucknow/gomti-nagar" },
        { label: "Mumbai", href: "/rentals/in/mumbai" },
        { label: "Powai", href: "/rentals/in/mumbai/powai" },
        { label: "London", href: "/rentals/uk/london" },
        { label: "Nairobi", href: "/rentals/ke/nairobi" },
        { label: "Lagos", href: "/rentals/ng/lagos" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", href: PATHS.about },
        { label: "Contact", href: PATHS.contact },
        { label: "Blog", href: PATHS.blog },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { label: "Privacy Policy", href: PATHS.privacy },
        { label: "Terms", href: PATHS.terms },
        { label: "Refund Policy", href: PATHS.refund },
      ],
    },
  ];

  return (
    <footer style={{ background: BRAND.surface, borderTop: `1px solid ${BRAND.border}`, padding: "48px 24px 28px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 32 }} className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Image src="/logo/logo.png" alt="RentalPins" width={28} height={28} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: BRAND.primary }}>
              Rental<span style={{ color: BRAND.accent }}>Pins</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6, maxWidth: 220 }}>
            Rent Anything Anywhere. India&apos;s map-first rental marketplace.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {[
              { label: "f", href: "https://www.facebook.com/rentalpins" },
              { label: "ig", href: "https://www.instagram.com/rentalpins/" },
              { label: "X", href: "https://x.com/rentalpins" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                width: 32, height: 32, borderRadius: "50%", background: BRAND.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: BRAND.muted, textDecoration: "none",
              }}>{s.label}</a>
            ))}
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: BRAND.muted, letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" as const }}>{col.title}</h4>
            {col.links.map(link => (
              <a key={link.label} href={link.href} style={{ display: "block", fontSize: 13, fontWeight: 500, color: BRAND.text, textDecoration: "none", padding: "4px 0" }}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: "28px auto 0", paddingTop: 20, borderTop: `1px solid ${BRAND.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 8 }}>
        <span style={{ fontSize: 12, color: BRAND.muted }}>© {new Date().getFullYear()} RentalPins. All rights reserved.</span>
        <span style={{ fontSize: 12, color: BRAND.muted }}>Made with love in Punjab, India</span>
      </div>
    </footer>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AreaClient({
  area,
  listingsCount = 0,
}: {
  area: AreaData;
  listingsCount?: number;
}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const isSubArea = area.parentCity !== "";

  // Build the current page's base path (for popular search self-links)
  const currentPath = isSubArea
    ? `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`
    : `/rentals/${area.parentCountrySlug}/${area.slug}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .cat-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* ── Breadcrumbs ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 60, padding: "14px 24px", background: BRAND.surface, borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted }}>
          <a href={PATHS.home} style={{ color: BRAND.muted, textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 8px", opacity: 0.4 }}>›</span>
          <a href={PATHS.rentals} style={{ color: BRAND.muted, textDecoration: "none" }}>Rentals</a>
          {isSubArea && (
            <>
              <span style={{ margin: "0 8px", opacity: 0.4 }}>›</span>
              <a href={`/rentals/${area.parentCountrySlug}/${area.parentSlug}`} style={{ color: BRAND.muted, textDecoration: "none" }}>{area.parentCity}</a>
            </>
          )}
          <span style={{ margin: "0 8px", opacity: 0.4 }}>›</span>
          <span style={{ color: BRAND.text, fontWeight: 600 }}>{area.name}</span>
        </div>
      </div>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: BRAND.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12 }}>
            {area.badge}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: BRAND.primary, lineHeight: 1.15, marginBottom: 16 }}>
            Rentals {isSubArea ? "in" : "across"} {area.name}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: BRAND.muted, lineHeight: 1.7, marginBottom: 24, maxWidth: 640 }}>
            {area.heroDescription}
          </p>

          {/* Area pills */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 28 }}>
            {area.tagline.split("·").map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: BRAND.primary, background: `${BRAND.primary}0D`, padding: "6px 14px", borderRadius: 100 }}>
                {t}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <a
              href={appPath(
                mapSearchUrl(
                  area.coordinates.lat,
                  area.coordinates.lng,
                  isSubArea ? 13 : 12,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  area.name
                )
              )}
              style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.accent, color: "#fff", padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: `0 8px 32px ${BRAND.accent}44`,
            }}>Browse on Map</a>
            <a href={PATHS.post} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.surface, color: BRAND.primary, border: `1.5px solid ${BRAND.border}`,
              padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Post Free Listing</a>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "32px 24px", background: BRAND.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }} className="stats-grid">
          {[
            { label: "Active Listings", value: listingsCount.toString() },
            { label: "Categories", value: "9" },
            { label: isSubArea ? "Sub-areas" : "Areas Covered", value: `${area.popularAreas.length}+` },
            { label: "Free Listing", value: "Available" },
          ].map(s => (
            <div key={s.label} style={{ padding: "16px 12px" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, color: BRAND.primary, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BRAND.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Areas ──────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: BRAND.muted, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 16 }}>
            Areas Covered
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            {area.popularAreas.map(a => (
              <span key={a} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: BRAND.text, background: BRAND.surface, border: `1px solid ${BRAND.border}`, padding: "7px 16px", borderRadius: 100 }}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Categories — links go to homepage (not app.rentalpins.com) */}
      <section style={{ padding: "48px 24px", background: BRAND.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: BRAND.primary, marginBottom: 8 }}>
            What people rent most in {area.name}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.muted, marginBottom: 24 }}>
            Browse by category across {area.name}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }} className="cat-grid">
            {area.topCategories.map(cat => (
              <a key={cat.name} href={appPath(mapSearchUrl(area.coordinates.lat, area.coordinates.lng, isSubArea ? 13 : 12, undefined, cat.name))} style={{
                display: "block", background: "#fff", border: `1px solid ${BRAND.border}`,
                borderRadius: 14, padding: "20px", textDecoration: "none",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>{cat.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Searches — FIXED: link to own page (not app.rentalpins.com) */}
      <section style={{ padding: "48px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: BRAND.primary, marginBottom: 8 }}>
            What people are searching in {area.name}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10, marginTop: 20 }}>
            {area.popularSearches.map(s => (
              <a
                key={s}
                href={appPath(
                  mapSearchUrl(
                    area.coordinates.lat,
                    area.coordinates.lng,
                    isSubArea ? 13 : 12,
                    undefined,
                    undefined,
                    undefined,
                    s
                  )
                )}
                style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                color: BRAND.primary, background: `${BRAND.primary}08`,
                border: `1px solid ${BRAND.border}`, padding: "8px 16px",
                borderRadius: 100, textDecoration: "none",
              }}>{s}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spoke Links (Explore Nearby) ───────────────────────────────── */}
      {area.spokeLinks.length > 0 && (
        <section style={{ padding: "40px 24px", background: BRAND.surface }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, color: BRAND.primary, marginBottom: 16 }}>
              {isSubArea ? `More areas in ${area.parentCity}` : `Explore areas in ${area.name}`}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
              {isSubArea && (
                <a href={`/rentals/${area.parentCountrySlug}/${area.parentSlug}`} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                  color: BRAND.accent, background: `${BRAND.accent}0D`,
                  border: `1px solid ${BRAND.accent}33`, padding: "10px 20px",
                  borderRadius: 12, textDecoration: "none",
                }}>All of {area.parentCity}</a>
              )}
              {area.spokeLinks.map(s => (
                <a key={s.href} href={s.href} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                  color: BRAND.text, background: "#fff", border: `1px solid ${BRAND.border}`,
                  padding: "10px 20px", borderRadius: 12, textDecoration: "none",
                }}>{s.label}</a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      {area.faqs.length > 0 && (
        <section style={{ padding: "48px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: BRAND.primary, textAlign: "center", marginBottom: 32 }}>
              Frequently Asked Questions
            </h2>
            {area.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BRAND.border}`, padding: "16px 0" }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                  fontWeight: 600, color: BRAND.text, display: "flex",
                  justifyContent: "space-between", alignItems: "center", padding: 0,
                }}>
                  {faq.q}
                  <span style={{ fontSize: 18, color: BRAND.muted, transform: faqOpen === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {faqOpen === i && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.muted, lineHeight: 1.7, marginTop: 10 }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Bottom CTA — links to homepage (not app.rentalpins.com) ───── */}
      <section style={{
        padding: "56px 24px",
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0F2554 100%)`,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            {area.ctaHeading}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
            {area.ctaBody}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" as const }}>
            <a href={PATHS.post} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.accent, color: "#fff", padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>Post Free Listing</a>
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.25)", padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Get Android App</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
