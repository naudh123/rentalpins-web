"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { BRAND, UI } from "@/lib/brand";

// ─── Listing cards link to www /:listingId → top-level redirect to app.rentalpins.com ─

// Internal CTAs (like "Post Free Listing") go to our homepage map handoff
const HOMEPAGE_URL = "/";

const UNIT_SHORT: Record<string, string> = {
  "per hour":  "/hr",
  "per day":   "/day",
  "per week":  "/wk",
  "per month": "/mo",
  "per year":  "/yr",
};

interface ListingCard {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  category: string;
  subCategory: string;
  locationName: string;
  imageUrl: string;
  isPromoted: boolean;
  viewsCount: number;
  inquiryCount: number;
  createdAt: string;
}

/** Avoid misleading teasers when Firestore has bad/test values (e.g. ₹1/mo). */
function formatPrice(price: number, priceUnit: string): string {
  const unit = (priceUnit || "").toLowerCase();
  // Only flag implausible long-term rents; keep hourly/daily prices untouched
  const longTerm =
    unit.includes("month") || unit.includes("year") || unit.includes("week");
  if (price > 0 && price < 500 && longTerm) {
    return "See price in app";
  }
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(1)}L`;
  if (price >= 1000)     return `₹${(price / 1000).toFixed(1)}K`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function ListingCardItem({
  listing,
  fromUrl,
}: {
  listing: ListingCard;
  fromUrl: string;
}) {
  const unitSuffix = UNIT_SHORT[listing.priceUnit] || "";
  const priceLine = formatPrice(listing.price, listing.priceUnit);
  const showUnitSuffix = !priceLine.startsWith("See ");
  // Link directly to Flutter app with listing ID as query param.
  // Same tab (no target="_blank"). Flutter reads ?listing= and opens detail.
  const detailUrl = `/listings/${listing.id}?from=${encodeURIComponent(fromUrl)}`;

  return (
    <a
      href={detailUrl}
      style={{
        display: "block",
        background: "#fff",
        borderRadius: 16,
        border: listing.isPromoted
          ? `2px solid ${BRAND.accent}`
          : `1px solid ${BRAND.border}`,
        overflow: "hidden",
        textDecoration: "none",
        color: BRAND.text,
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(15, 28, 53, 0.04)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = UI.shadowCard;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 28, 53, 0.04)";
      }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        paddingTop: "65%",
        background: BRAND.surface,
        overflow: "hidden",
      }}>
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            loading="lazy"
            style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: BRAND.muted, fontSize: 32,
          }}>📷</div>
        )}

        {listing.isPromoted && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            background: BRAND.accent, color: "#fff",
            fontSize: 10, fontWeight: 700,
            padding: "3px 8px", borderRadius: 6,
            letterSpacing: "0.04em",
          }}>⚡ PROMOTED</div>
        )}

        <div style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(0,0,0,0.6)", color: "#fff",
          fontSize: 10, fontWeight: 600,
          padding: "3px 8px", borderRadius: 6,
          backdropFilter: "blur(4px)",
        }}>
          {listing.subCategory || listing.category}
        </div>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 20, fontWeight: 700,
          color: BRAND.primary,
          marginBottom: 2,
        }}>
          {priceLine}
          {showUnitSuffix ? (
            <span style={{ fontSize: 12, fontWeight: 500, color: BRAND.muted }}>{unitSuffix}</span>
          ) : null}
        </div>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600,
          color: BRAND.text,
          lineHeight: 1.3,
          marginBottom: 6,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as any,
        }}>{listing.title}</div>

        {listing.locationName && (
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: BRAND.muted,
            marginBottom: 8,
            overflow: "hidden",
            whiteSpace: "nowrap" as const,
            textOverflow: "ellipsis",
          }}>
            📍 {listing.locationName}
          </div>
        )}

        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11, color: BRAND.muted,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span>👁 {listing.viewsCount}</span>
            <span>💬 {listing.inquiryCount}</span>
          </div>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </a>
  );
}

export default function ListingsGrid({
  listings,
  areaName,
}: {
  listings: ListingCard[];
  areaName: string;
}) {
  const pathname = usePathname();
  const fromUrl = pathname;

  if (!listings || listings.length === 0) {
    return (
      <section style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "48px 24px", textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700,
          color: BRAND.primary, marginBottom: 16,
        }}>
          Latest Rentals in {areaName}
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          color: BRAND.muted, marginBottom: 24,
        }}>
          No listings yet in this area. Be the first to post!
        </p>
        <a href={HOMEPAGE_URL} style={{
          display: "inline-block",
          background: BRAND.accent, color: "#fff",
          padding: "12px 28px", borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
          textDecoration: "none",
        }}>Post Free Listing →</a>
      </section>
    );
  }

  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "48px 24px",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 28,
        flexWrap: "wrap" as const, gap: 12,
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700,
          color: BRAND.primary,
        }}>
          Latest Rentals in {areaName}
        </h2>
        <a href={HOMEPAGE_URL} style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 600,
          color: BRAND.accent, textDecoration: "none",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          View all on map →
        </a>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
      }}>
        {listings.map(listing => (
          <ListingCardItem key={listing.id} listing={listing} fromUrl={fromUrl} />
        ))}
      </div>

      <div style={{
        textAlign: "center", marginTop: 40,
        padding: "32px 24px",
        background: BRAND.surface,
        borderRadius: 18,
        border: `1px solid ${BRAND.border}`,
        boxShadow: UI.shadowSoft,
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          color: BRAND.text, marginBottom: 16,
        }}>
          Want to see more? Browse all {areaName} listings on the live map.
        </p>
        <a href={HOMEPAGE_URL} style={{
          display: "inline-block",
          background: BRAND.accent, color: "#fff",
          padding: "12px 28px", borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
          textDecoration: "none",
          boxShadow: `0 4px 12px ${BRAND.accent}44`,
        }}>🗺️ Browse Live Map</a>
      </div>
    </section>
  );
}