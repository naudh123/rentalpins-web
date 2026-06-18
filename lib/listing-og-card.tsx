import { ImageResponse } from "next/og";
import type { ListingDetail } from "@/lib/types/listing";
import { formatPrice } from "@/lib/format";
import { LISTING_OG_HEIGHT, LISTING_OG_WIDTH } from "@/lib/listing-share-constants";

const NAVY = "#1e3a6e";
const NAVY_DARK = "#0f2554";
const ORANGE = "#e8501a";
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

export function generateListingOgImageResponse(
  listing: ListingDetail | null
): ImageResponse {
  const title = truncate(listing?.title ?? "Rental listing", 72);
  const priceLabel = listing
    ? formatPrice(listing.price, listing.priceUnit, listing.homeIso)
    : "View on RentalPins";
  const location = truncate(listing?.locationName ?? "", 48);
  const category = truncate(
    [listing?.category, listing?.subCategory].filter(Boolean).join(" · ") ||
      "Rental",
    36
  );
  const photo = pickOgPhoto(listing);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 55%, #2a4f8f 100%)`,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            width: "58%",
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
                background: `linear-gradient(160deg, ${ORANGE} 0%, ${NAVY} 100%)`,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 120,
              }}
            >
              📍
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 55%, rgba(15,37,84,0.92) 100%)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "42%",
            height: "100%",
            padding: "44px 40px",
            justifyContent: "space-between",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: ORANGE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                R
              </div>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                RentalPins
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {category}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                maxHeight: 180,
                overflow: "hidden",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: ORANGE,
                lineHeight: 1.1,
              }}
            >
              {priceLabel}
            </div>
            {location ? (
              <div
                style={{
                  fontSize: 20,
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 15,
              color: MUTED,
            }}
          >
            <span>www.rentalpins.com</span>
            <span
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 999,
                padding: "8px 16px",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              View listing →
            </span>
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
