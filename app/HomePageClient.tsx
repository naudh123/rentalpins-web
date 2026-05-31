"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import OwnerLanding, {
  POST_PROPERTY_URL,
  StickyMobileCta,
} from "@/components/OwnerLanding";
import { BRAND, UI } from "@/lib/brand";

// ─── Brand (see lib/brand.ts) ───────────────────────────────────────────────

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.rentit_clean.rentit";
const GOOGLE_ADS_SESSION_KEY = "rp_google_ads";

function useGoogleAdsTraffic(): boolean {
  const searchParams = useSearchParams();
  const [isAds, setIsAds] = useState(false);

  useEffect(() => {
    const gclid = searchParams.get("gclid");
    const utm = searchParams.get("utm_source")?.toLowerCase();
    const fromUrl = Boolean(gclid || utm === "google");
    if (fromUrl) {
      try {
        sessionStorage.setItem(GOOGLE_ADS_SESSION_KEY, "1");
      } catch {
        /* private mode */
      }
      setIsAds(true);
      return;
    }
    try {
      setIsAds(sessionStorage.getItem(GOOGLE_ADS_SESSION_KEY) === "1");
    } catch {
      setIsAds(false);
    }
  }, [searchParams]);

  return isAds;
}

// ─── Cities for navbar dropdown ──────────────────────────────────────────────
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

// ─── Compact Navbar ──────────────────────────────────────────────────────────
function Navbar({ isGoogleAds }: { isGoogleAds: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const primaryCtaHref = POST_PROPERTY_URL;
  const primaryCtaLabel = "Post Property FREE";
  const primaryCtaExternal = false;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${BRAND.border}`, padding: "0 20px", height: 58,
      display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <Image src="/logo/logo.png" alt="RentalPins" width={28} height={28} style={{ objectFit: "contain" }} priority />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: BRAND.primary }}>
            Rental<span style={{ color: BRAND.accent }}>Pins</span>
          </span>
        </a>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <CitiesDropdown />
        </div>

        <div className="desktop-nav" style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <a
            href={primaryCtaHref}
            {...(primaryCtaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              background: BRAND.accent,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(241, 90, 34, 0.4)",
            }}
          >
            {primaryCtaLabel}
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 22, color: BRAND.primary,
        }} aria-label="Toggle menu">☰</button>
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", top: 58, left: 0, right: 0, background: "#fff", borderBottom: `1px solid ${BRAND.border}`, padding: "12px 20px 20px", zIndex: 200 }}>
          {([
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
              display: "block", padding: "11px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              fontWeight: label.startsWith("  ") ? 400 : 500,
              color: label.startsWith("  ") ? BRAND.muted : BRAND.text,
              textDecoration: "none", borderBottom: `1px solid ${BRAND.border}`,
              paddingLeft: label.startsWith("  ") ? 16 : 0,
            }}>{label.startsWith("  ") ? `› ${label.trim()}` : label}</a>
          ))}
          <a
            href={primaryCtaHref}
            {...(primaryCtaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              textAlign: "center",
              padding: "11px 0",
              borderRadius: 8,
              background: BRAND.accent,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              marginTop: 12,
            }}
          >
            {primaryCtaLabel}
          </a>
        </div>
      )}
    </nav>
  );
}

function LoadingScreenFallback() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 58px)",
        background: "linear-gradient(145deg, #284d86 0%, #0f2240 55%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(255,255,255,0.85)",
          fontSize: 14,
        }}
      >
        Loading…
      </p>
    </div>
  );
}

function HomePageInner() {
  const isGoogleAds = useGoogleAdsTraffic();
  return (
    <>
      <Navbar isGoogleAds={isGoogleAds} />
      <main style={{ marginTop: 58 }}>
        <OwnerLanding isGoogleAds={isGoogleAds} />
      </main>
      <StickyMobileCta isGoogleAds={isGoogleAds} />
      <SEOContent />
      <Footer />
    </>
  );
}

// ─── SEO Content (below fold — Google crawls, users rarely see) ──────────────
function SEOContent() {
  return (
    <section id="seo-content" style={{ background: "#fff" }}>
      {/* Hero text for Google */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 32px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800,
          color: BRAND.primary, lineHeight: 1.2, marginBottom: 16,
        }}>
          Post Your Property Free on RentalPins
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          color: BRAND.muted, lineHeight: 1.7, maxWidth: 640, margin: "0 auto",
        }}>
          RentalPins helps property owners and landlords list flats, rooms, PG and shops for free.
          Connect directly with tenants on the map — no broker commission. Post in minutes from your phone.
        </p>
      </div>

      {/* City cards */}
      <section style={{ padding: "32px 24px 48px", background: BRAND.surface }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700,
            color: BRAND.primary, textAlign: "center", marginBottom: 8,
          }}>Browse Rentals by City</h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: BRAND.muted, textAlign: "center", marginBottom: 24,
          }}>Explore rental listings across India, the UK, Kenya and Nigeria — Jaipur, Lucknow, Mumbai and more</p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}>
            {[
              { name: "Chandigarh Tricity", href: "/rentals/in/chandigarh", areas: "Chandigarh, Mohali, Panchkula, Zirakpur, Kharar", status: "Live" },
              { name: "Ludhiana", href: "/rentals/in/ludhiana", areas: "Ludhiana, Khanna, Samrala, Jagraon", status: "Live" },
              { name: "Delhi", href: "/rentals/in/delhi", areas: "Mukherjee Nagar, Dwarka, Rohini, Jasola", status: "Live" },
              { name: "Jaipur", href: "/rentals/in/jaipur", areas: "Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura", status: "Live" },
              { name: "Lucknow", href: "/rentals/in/lucknow", areas: "Gomti Nagar, Indira Nagar, Aliganj, Hazratganj", status: "Live" },
              { name: "Mumbai", href: "/rentals/in/mumbai", areas: "Powai, Andheri, Bandra, Goregaon, Vashi", status: "Live" },
              { name: "London", href: "/rentals/uk/london", areas: "Camden, Shoreditch, Westminster, Docklands", status: "Live" },
              { name: "Nairobi", href: "/rentals/ke/nairobi", areas: "Westlands, Kilimani, Karen, Upper Hill", status: "Live" },
              { name: "Lagos", href: "/rentals/ng/lagos", areas: "Lekki, VI, Ikeja, Yaba, Ikoyi", status: "Live" },
              { name: "NCR Delhi", href: "/rentals/in/ncr", areas: "Delhi, Noida, Gurugram, Ghaziabad", status: "Coming Soon" },
            ].map(city => (
              <a key={city.name} href={city.href} style={{
                display: "block", background: "#fff", border: `1px solid ${BRAND.border}`,
                borderRadius: 12, padding: "18px 18px", textDecoration: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.accent; e.currentTarget.style.boxShadow = `0 4px 16px ${BRAND.accent}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: BRAND.primary }}>{city.name}</span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600,
                    color: city.status === "Live" ? "#2E7D32" : BRAND.muted,
                    background: city.status === "Live" ? "#E8F5E9" : BRAND.surface,
                    padding: "2px 8px", borderRadius: 100,
                  }}>{city.status}</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BRAND.muted, lineHeight: 1.5, margin: 0 }}>{city.areas}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9 Categories */}
      <section style={{ padding: "36px 24px", background: "#fff", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700,
          color: BRAND.primary, marginBottom: 20,
        }}>9 Rental Categories — Not Just Property</h2>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
          {["🏠 Property", "🚗 Vehicles", "💻 Electronics", "🍳 Home Appliances", "🛋️ Furniture", "🏗️ Heavy Machinery", "🔧 Construction", "🎬 Events", "📦 Others"].map(c => (
            <span key={c} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              background: BRAND.surface, border: `1px solid ${BRAND.border}`,
              borderRadius: 100, padding: "7px 16px", color: BRAND.text,
            }}>{c}</span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "40px 24px", background: BRAND.surface }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700,
            color: BRAND.primary, textAlign: "center", marginBottom: 28,
          }}>How RentalPins Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { num: "01", title: "Browse the Map", desc: "Live map with pins. Filter by category and area." },
              { num: "02", title: "Tap Any Pin", desc: "See photos, price, location and details instantly." },
              { num: "03", title: "Contact the Owner", desc: "WhatsApp, call or in-app chat. No broker fees." },
              { num: "04", title: "List Your Rental", desc: "Post in minutes. Your listing goes live on the map." },
            ].map(s => (
              <div key={s.num} style={{ background: "#fff", borderRadius: 12, padding: "20px 18px", border: `1px solid ${BRAND.border}` }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 800, color: BRAND.accent, marginBottom: 6, opacity: 0.4 }}>{s.num}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: BRAND.primary, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section style={{ padding: "36px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            ["OTP Verified", "Every user verified by mobile OTP"],
            ["No Broker Fee", "Deal directly with owners"],
            ["Free to List", "Post rental in minutes"],
            ["9 Categories", "More than just property"],
          ].map(([title, sub]) => (
            <div key={title}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: BRAND.primary, marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BRAND.muted }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Added USP block (additive only, keeps existing copy intact) */}
      <section style={{ padding: "36px 24px", background: BRAND.surface }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 700,
            color: BRAND.primary,
            textAlign: "center",
            marginBottom: 10,
          }}>
            Why users choose RentalPins
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: BRAND.muted,
            textAlign: "center",
            marginBottom: 22,
            lineHeight: 1.7,
          }}>
            Built for fast local discovery, trusted interactions, and easy listing across multiple rental categories.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}>
            {[
              ["Map-first rental discovery", "Browse nearby rentals directly from live map pins."],
              ["Default city + GPS handoff", "Start exploring immediately, then automatically move to current location when available."],
              ["Manual city control", "Switch to selected city any time using city navigation and location actions."],
              ["Direct owner communication", "Connect via WhatsApp, direct call, or in-app chat without broker dependency."],
              ["Trusted renter-lister network", "OTP-verified accounts help keep interactions safer and more reliable."],
              ["Multi-category marketplace", "Find and list across property, vehicles, electronics, furniture, machinery, and more."],
              ["Free-to-list workflow", "Create listings quickly and publish visibility on the map experience."],
              ["Mobile + web continuity", "Explore on web and move to Android app flow when needed."],
            ].map(([title, body]) => (
              <div key={title} style={{
                background: "#fff",
                border: `1px solid ${BRAND.border}`,
                borderRadius: 12,
                padding: "14px 14px",
              }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: BRAND.primary,
                  marginBottom: 4,
                }}>
                  {title}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: BRAND.muted,
                  lineHeight: 1.6,
                }}>
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    { q: "How do I find a room for rent without a broker on RentalPins?", a: "From www.rentalpins.com, continue to app.rentalpins.com for the live map (or open the web app / Android app directly). Listings are owner-posted — no broker fees on the platform. Filter by category and area for rooms, PG, flats, and more." },
    { q: "Is it free to list a rental on RentalPins?", a: "Yes. Post from app.rentalpins.com or the Android app. www.rentalpins.com has city hubs, blog, and company pages; the interactive map and posting flow live on the app domain." },
    { q: "What cities does RentalPins cover?", a: "RentalPins lists rentals in Chandigarh Tricity, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai (India), London (UK), Nairobi (Kenya), Lagos (Nigeria), with more cities coming. See each city page for areas covered." },
    { q: "What types of rentals are available on RentalPins?", a: "RentalPins has 9 rental categories: Property (rooms, flats, PG, villas, shops, offices), Vehicles, Electronics & Gadgets, Home Appliances, Furniture, Heavy Machinery, Construction Equipment, Event & Production gear, and more." },
    { q: "How do I contact a rental owner on RentalPins?", a: "On the map at app.rentalpins.com, open a listing for details. Contact via WhatsApp, call, or in-app chat when available. Users are OTP-verified for safety." },
  ];
  return (
    <section style={{ padding: "48px 24px 32px", background: BRAND.surface }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700,
          color: BRAND.primary, textAlign: "center", marginBottom: 28,
        }}>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${BRAND.border}`, padding: "14px 0" }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{
              width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: BRAND.text,
              display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0,
            }}>
              {faq.q}
              <span style={{
                fontSize: 18, color: BRAND.muted,
                transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s", flexShrink: 0, marginLeft: 12,
              }}>+</span>
            </button>
            {openIdx === i && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted, lineHeight: 1.7, marginTop: 8 }}>{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "PLATFORM", links: [
      { label: "Browse Rentals", href: "/" },
      { label: "Get Android App", href: PLAY_URL },
    ]},
    { title: "CITIES", links: [
      { label: "Chandigarh Tricity", href: "/rentals/in/chandigarh" },
      { label: "Ludhiana", href: "/rentals/in/ludhiana" },
      { label: "Delhi", href: "/rentals/in/delhi" },
      { label: "Jaipur", href: "/rentals/in/jaipur" },
      { label: "Lucknow", href: "/rentals/in/lucknow" },
      { label: "Mumbai", href: "/rentals/in/mumbai" },
      { label: "London", href: "/rentals/uk/london" },
      { label: "Nairobi", href: "/rentals/ke/nairobi" },
      { label: "Lagos", href: "/rentals/ng/lagos" },
    ]},
    { title: "COMPANY", links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ]},
    { title: "LEGAL", links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ]},
  ];

  return (
    <footer style={{ background: BRAND.surface, borderTop: `1px solid ${BRAND.border}`, padding: "40px 24px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 28 }} className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Image src="/logo/logo.png" alt="RentalPins" width={26} height={26} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: BRAND.primary }}>
              Rental<span style={{ color: BRAND.accent }}>Pins</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.6, maxWidth: 220 }}>
            Rent Anything Anywhere. India&apos;s map-first rental marketplace.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {[
              { label: "f", href: "https://www.facebook.com/rentalpins" },
              { label: "ig", href: "https://www.instagram.com/rentalpins/" },
              { label: "X", href: "https://x.com/rentalpins" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                width: 30, height: 30, borderRadius: "50%", background: BRAND.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: BRAND.muted, textDecoration: "none",
              }}>{s.label}</a>
            ))}
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 10, fontWeight: 700, color: BRAND.muted, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" as const }}>{col.title}</h4>
            {col.links.map(link => (
              <a key={link.label} href={link.href} style={{ display: "block", fontSize: 12, fontWeight: 500, color: BRAND.text, textDecoration: "none", padding: "3px 0" }}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: "24px auto 0", paddingTop: 16, borderTop: `1px solid ${BRAND.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 8 }}>
        <span style={{ fontSize: 11, color: BRAND.muted }}>© {new Date().getFullYear()} RentalPins. All rights reserved.</span>
        <span style={{ fontSize: 11, color: BRAND.muted }}>Made with love in Punjab, India</span>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function HomePageClient() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        .desktop-nav     { display: flex !important; }
        .mobile-menu-btn { display: none !important; }

        @keyframes pinFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pinPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        @keyframes ringExpand {
          0%   { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes loadSweep {
          0%   { transform: translateX(-80%); }
          100% { transform: translateX(220%); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }

        @media (min-width: 900px) {
          .owner-hero-grid {
            grid-template-columns: 1fr 1fr !important;
            text-align: left !important;
          }
          .owner-hero-grid > div:first-child { text-align: left !important; }
          .owner-hero-grid > div:first-child p { margin-left: 0 !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav     { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .footer-grid     { grid-template-columns: 1fr 1fr !important; }
          .sticky-mobile-cta { display: block !important; }
          body { padding-bottom: 72px; }
        }
        @media (max-width: 480px) {
          .footer-grid     { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <React.Suspense fallback={<LoadingScreenFallback />}>
        <HomePageInner />
      </React.Suspense>
    </>
  );
}
