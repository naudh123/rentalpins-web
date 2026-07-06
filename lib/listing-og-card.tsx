import { ImageResponse } from "next/og";
import type { ListingDetail } from "@/lib/types/listing";
import { formatListingPrice } from "@/lib/listing-price";
import { LISTING_OG_HEIGHT, LISTING_OG_WIDTH } from "@/lib/listing-share-constants";

const RENT_NAVY = "#1e3a6e";
const RENT_NAVY_DEEP = "#0a1628";
const RENT_ORANGE = "#e8501a";
const SALE_GOLD = "#fbb316";
const SALE_GOLD_DEEP = "#9a7b1a";
const SALE_IVORY = "#faf8f5";
const MUTED = "#b8c4dc";

function pickOgPhoto(listing: ListingDetail | null): string | null {
  if (!listing) return null;
  const candidates = [
    listing.imageUrls[0],
    listing.imageUrl,
    ...listing.imageUrls.slice(1),
  ];
  for (const raw of candidates) {
    if (typeof raw !== "string") continue;
    const u = raw.trim();
    if (u.startsWith("https://")) return u;
  }
  return null;
}

function truncate(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function specChips(listing: ListingDetail | null): string[] {
  if (!listing) return [];
  const chips: string[] = [];
  const bhk = listing.attributes?.bhk?.trim();
  if (bhk) chips.push(bhk);
  const furnish = listing.attributes?.furnishing?.trim();
  if (furnish) chips.push(furnish);
  if (listing.subCategory?.trim()) chips.push(listing.subCategory.trim());
  return chips.slice(0, 3);
}

export function generateListingOgImageResponse(
  listing: ListingDetail | null
): ImageResponse {
  const isSale = listing?.transactionType === "sale";
  const title = truncate(listing?.title ?? "Property listing", 64);
  const priceLabel = listing
    ? formatListingPrice({
        price: listing.price,
        priceUnit: listing.priceUnit,
        category: listing.category,
        subCategory: listing.subCategory,
        transactionType: listing.transactionType,
        homeIso: listing.homeIso,
      })
    : "View on RentalPins";
  const location = truncate(listing?.locationName ?? "", 44);
  const chips = specChips(listing);
  const photo = pickOgPhoto(listing);

  const accent = isSale ? SALE_GOLD : RENT_ORANGE;
  const bgDeep = isSale ? "#1a1408" : RENT_NAVY_DEEP;
  const bgMid = isSale ? "#2a2210" : RENT_NAVY;
  const brandLabel = isSale ? "RentalPins Buy" : "RentalPins";
  const modeBadge = isSale ? "For sale · Owner direct" : "For rent · Owner direct";
  const cta = isSale ? "View photos & enquire" : "View photos & contact";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: `linear-gradient(145deg, ${bgDeep} 0%, ${bgMid} 48%, ${isSale ? "#3d3218" : "#2a4f8f"} 100%)`,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            width: "62%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                background: `linear-gradient(160deg, ${accent} 0%, ${bgMid} 100%)`,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 96,
              }}
            >
              🏡
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 40%, rgba(10,15,30,0.94) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 28,
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.45)",
              border: `2px solid ${accent}`,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {modeBadge}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "38%",
            height: "100%",
            padding: "36px 32px",
            justifyContent: "space-between",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: isSale ? bgDeep : "#fff",
                }}
              >
                R
              </div>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {brandLabel}
              </span>
            </div>
            {chips.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      display: "flex",
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                maxHeight: 148,
                overflow: "hidden",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: accent,
                lineHeight: 1.05,
              }}
            >
              {priceLabel}
            </div>
            {location ? (
              <div
                style={{
                  fontSize: 18,
                  color: MUTED,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>📍</span>
                <span>{location}</span>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: accent,
                color: isSale ? bgDeep : "#fff",
                borderRadius: 999,
                padding: "14px 22px",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.02em",
              }}
            >
              {cta} →
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 14,
                color: isSale ? SALE_IVORY : MUTED,
                opacity: 0.85,
              }}
            >
              www.rentalpins.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: LISTING_OG_WIDTH,
      height: LISTING_OG_HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
