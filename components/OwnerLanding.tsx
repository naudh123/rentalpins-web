"use client";

import React from "react";
import { BRAND } from "@/lib/brand";
import { trackGa4Event } from "@/lib/gtag";
import { trackSmartLoaderEvent } from "@/lib/meta-pixel";

export const POST_PROPERTY_URL = "https://app.rentalpins.com/?web=1&skipSplash=1";

const glass: React.CSSProperties = {
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)",
  border: "1px solid rgba(255,255,255,0.32)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  borderRadius: 18,
};

const HERO_GRADIENT =
  "linear-gradient(155deg, #1a3560 0%, #284d86 38%, #152a52 72%, #0f2240 100%)";

const BENEFIT_CARDS = [
  {
    icon: "free",
    title: "FREE Property Listing",
    body: "Post flats, rooms, PGs & shops completely free.",
  },
  {
    icon: "tenants",
    title: "Find Tenants Faster",
    body: "Reach genuine tenants searching nearby on map.",
  },
  {
    icon: "broker",
    title: "No Broker Fees",
    body: "Connect directly with tenants without middlemen.",
  },
  {
    icon: "fast",
    title: "Post in 2 Minutes",
    body: "Simple and quick listing process from your phone.",
  },
  {
    icon: "app",
    title: "RentalPins Owner App",
    body: "Built specially for property owners and landlords.",
  },
  {
    icon: "map",
    title: "Map-Based Visibility",
    body: "Your property appears directly on RentalPins map.",
  },
] as const;

const OWNER_CHECKLIST = [
  "FREE listing",
  "Direct tenant calls",
  "No broker commission",
  "Faster visibility on map",
  "Easy mobile posting",
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Delete account", href: "/delete-account" },
  { label: "Cities", href: "/rentals" },
] as const;

function BenefitIcon({ type }: { type: (typeof BENEFIT_CARDS)[number]["icon"] }) {
  const stroke = BRAND.accent;
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "free":
      return (
        <svg {...common}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "tenants":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "broker":
      return (
        <svg {...common}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      );
    case "fast":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

function trackPostClick(entryPoint: string, isGoogleAds: boolean) {
  trackSmartLoaderEvent("LandingContinueToApp", {
    source: isGoogleAds ? "google_ads" : "organic",
    city: "www_owner_landing",
  });
  trackGa4Event("post_property_cta", {
    entry_point: entryPoint,
    traffic: isGoogleAds ? "google_ads" : "organic",
  });
}

function PrimaryCta({
  label,
  entryPoint,
  isGoogleAds,
  size = "large",
}: {
  label: string;
  entryPoint: string;
  isGoogleAds: boolean;
  size?: "large" | "medium";
}) {
  const isLarge = size === "large";
  return (
    <a
      href={POST_PROPERTY_URL}
      onClick={() => trackPostClick(entryPoint, isGoogleAds)}
      style={{
        display: "inline-block",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: isLarge ? "clamp(17px, 2.6vw, 20px)" : 16,
        fontWeight: 800,
        color: "#fff",
        background: BRAND.accent,
        border: "none",
        borderRadius: isLarge ? 16 : 14,
        padding: isLarge ? "18px 40px" : "14px 32px",
        minWidth: isLarge ? "min(92vw, 320px)" : undefined,
        cursor: "pointer",
        textAlign: "center",
        textDecoration: "none",
        boxShadow:
          "0 18px 44px rgba(241,90,34,0.5), 0 0 0 1px rgba(255,255,255,0.12) inset",
      }}
    >
      {label}
    </a>
  );
}

function OwnerVisualPanel() {
  return (
    <div
      className="owner-visual-panel"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        minHeight: 340,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "8% 6% 12% 10%",
          borderRadius: 24,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "6%",
          transform: "translateX(-50%)",
          width: "58%",
          padding: 12,
          borderRadius: 22,
          background: "linear-gradient(180deg, #1a2f52 0%, #0f1f38 100%)",
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            height: 8,
            width: 36,
            borderRadius: 4,
            background: "rgba(255,255,255,0.2)",
            margin: "0 auto 10px",
          }}
        />
        <div
          style={{
            height: 72,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${BRAND.primary} 0%, #3d6ba8 100%)`,
            marginBottom: 8,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {[
            { left: "22%", top: "35%" },
            { left: "48%", top: "55%" },
            { left: "68%", top: "28%" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: 14,
                height: 14,
                borderRadius: "50% 50% 50% 0",
                background: BRAND.accent,
                transform: "rotate(-45deg)",
                boxShadow: `0 0 10px ${BRAND.accent}`,
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
          Your listing on map
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "8px 10px",
            borderRadius: 10,
            background: "rgba(241,90,34,0.2)",
            border: `1px solid ${BRAND.accent}55`,
            fontSize: 10,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Post Property FREE
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: "4%",
          top: "38%",
          ...glass,
          padding: "12px 14px",
          maxWidth: 160,
          animation: "cardFloat 4s ease-in-out infinite",
        }}
      >
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
          Incoming call
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Tenant inquiry</div>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: BRAND.accentLight,
            fontWeight: 600,
          }}
        >
          Direct • No broker
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "2%",
          bottom: "8%",
          display: "flex",
          gap: 6,
          alignItems: "flex-end",
        }}
      >
        {[52, 72, 48, 64].map((h, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: h,
              borderRadius: "6px 6px 0 0",
              background: `linear-gradient(180deg, rgba(255,255,255,${0.22 - i * 0.03}) 0%, rgba(255,255,255,0.06) 100%)`,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function OwnerLanding({ isGoogleAds }: { isGoogleAds: boolean }) {
  const pins = [
    { left: "10%", top: "22%" },
    { left: "72%", top: "18%" },
    { left: "85%", top: "55%" },
    { left: "18%", top: "68%" },
  ];

  return (
    <div style={{ background: HERO_GRADIENT, overflow: "hidden" }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "32px 18px 48px",
          minHeight: "min(92vh, 820px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {pins.map((pin, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pin.left,
              top: pin.top,
              opacity: 0.3,
              animation: `pinPulse 2.4s ease-in-out ${i * 0.4}s infinite`,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50% 50% 50% 0",
                background: `${BRAND.accent}99`,
                transform: "rotate(-45deg)",
              }}
            />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,34,64,0.4) 0%, rgba(40,77,134,0.25) 50%, rgba(15,34,64,0.65) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="owner-hero-grid"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1140,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {isGoogleAds ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  padding: "6px 14px",
                  borderRadius: 100,
                  background: "rgba(241,90,34,0.2)",
                  border: `1px solid ${BRAND.accent}66`,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: BRAND.accentLight,
                    animation: "dotPulse 1s ease-in-out infinite",
                  }}
                />
                Free listing for property owners
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: 12,
                }}
              >
                Built for landlords & property owners
              </div>
            )}
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(30px, 5vw, 48px)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.12,
                marginBottom: 14,
              }}
            >
              Rent Out Your Property Faster
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(15px, 2.2vw, 18px)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.65,
                maxWidth: 540,
                margin: "0 auto 24px",
              }}
            >
              Post your flat, room, PG or shop{" "}
              <strong style={{ color: "#fff" }}>FREE</strong> on RentalPins and connect
              directly with tenants nearby.
            </p>
            <PrimaryCta
              label="Post Property FREE →"
              entryPoint="hero_primary"
              isGoogleAds={isGoogleAds}
            />
            <p
              style={{
                marginTop: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.02em",
              }}
            >
              No Broker • Zero Cost • 2 Minute Listing
            </p>
          </div>
          <OwnerVisualPanel />
        </div>
      </section>

      {/* ── Benefit cards ─────────────────────────────────────────────── */}
      <section
        id="benefits"
        style={{
          padding: "48px 18px",
          background: "linear-gradient(180deg, #0f2240 0%, #152a52 100%)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {BENEFIT_CARDS.map((card, i) => (
              <div
                key={card.title}
                style={{
                  ...glass,
                  padding: "20px 18px",
                  animation: `pinFadeIn 0.5s ease ${0.08 * i}s both`,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(241,90,34,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <BenefitIcon type={card.icon} />
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "40px 18px",
          textAlign: "center",
          background: BRAND.primary,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
          }}
        >
          Thousands of tenants search rentals every day
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
          }}
        >
          Rooms • PG • Flats • Shops • Offices • Vehicles
        </p>
      </section>

      {/* ── Why owners prefer ─────────────────────────────────────────── */}
      <section style={{ padding: "48px 18px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(22px, 3.5vw, 30px)",
              fontWeight: 700,
              color: BRAND.primary,
              marginBottom: 28,
            }}
          >
            Why Owners Prefer RentalPins
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              textAlign: "left",
            }}
          >
            {OWNER_CHECKLIST.map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: BRAND.text,
                  padding: "14px 18px",
                  background: BRAND.surface,
                  borderRadius: 12,
                  border: `1px solid ${BRAND.border}`,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${BRAND.accent}18`,
                    color: BRAND.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  ✔
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "56px 18px",
          textAlign: "center",
          background: HERO_GRADIENT,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: 20,
          }}
        >
          Ready to Rent Out Faster?
        </h2>
        <PrimaryCta
          label="Post Property FREE"
          entryPoint="footer_cta"
          isGoogleAds={isGoogleAds}
          size="medium"
        />
        <p
          style={{
            marginTop: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.88)",
          }}
        >
          No broker • No fees • Direct tenants
        </p>
      </section>

      {/* ── Legal bar (unchanged links) ───────────────────────────────── */}
      <div
        id="landing-legal"
        style={{
          padding: "16px 18px 24px",
          background: "#0f2240",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            ...glass,
            padding: "14px 16px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px 14px",
          }}
        >
          {LEGAL_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.35)",
                paddingBottom: 2,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StickyMobileCta({ isGoogleAds }: { isGoogleAds: boolean }) {
  return (
    <div
      className="sticky-mobile-cta"
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 180,
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${BRAND.border}`,
        boxShadow: "0 -8px 32px rgba(15,28,53,0.12)",
      }}
    >
      <a
        href={POST_PROPERTY_URL}
        onClick={() => trackPostClick("sticky_mobile", isGoogleAds)}
        style={{
          display: "block",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 800,
          color: "#fff",
          background: BRAND.accent,
          borderRadius: 12,
          padding: "14px 20px",
          textDecoration: "none",
          boxShadow: "0 8px 24px rgba(241,90,34,0.4)",
        }}
      >
        Post Property FREE →
      </a>
    </div>
  );
}
