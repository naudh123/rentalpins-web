import { ImageResponse } from "next/og";
import type { BlogPost } from "@/lib/blog-types";
import { appPath, siteUrl } from "@/lib/config";
import { isValidBlogImageUrl } from "@/lib/blog-image";

const NAVY = "#1e3a6e";
const NAVY_DARK = "#0f2554";
const ORANGE = "#e8501a";
const GOLD = "#fbb316";
const EMERALD = "#12a58b";
const MUTED = "#b8c4dc";

function truncate(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function absoluteCoverUrl(coverImage?: string): string | null {
  if (!isValidBlogImageUrl(coverImage)) return null;
  const c = coverImage!.trim();
  if (/^https?:\/\//i.test(c) || c.startsWith("data:")) return c;
  return `${siteUrl}${appPath(c)}`;
}

/** Small deterministic hash so each post gets its own pin layout. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function accentFor(post: BlogPost | null): string {
  if (post?.vertical === "buy") return GOLD;
  if (post?.vertical === "neutral") return EMERALD;
  return ORANGE;
}

/** First tag that reads like a place (used as the main pin's label). */
function placeLabel(post: BlogPost | null): string | null {
  const generic = /^(flats?|pg|students?|rent|renting|buy|sale|tips?|guide|owners?|investment|legal|commercial|families|it professionals?)$/i;
  const tag = post?.tags?.find((t) => t && !generic.test(t.trim()));
  return tag ? truncate(tag, 22) : null;
}

function Pin({ x, y, color, size }: { x: number; y: number; color: string; size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        borderRadius: `${size}px ${size}px ${size}px 0`,
        transform: "rotate(-45deg)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          width: size * 0.38,
          height: size * 0.38,
          borderRadius: size,
          background: "#ffffff",
        }}
      />
    </div>
  );
}

/** Decorative city map: street grid, a river, a park and pins. */
function MapArt({
  post,
  width,
  height,
  k = 1,
}: {
  post: BlogPost | null;
  width: number;
  height: number;
  /** Scale for pins, streets and labels. */
  k?: number;
}) {
  const seed = hash(post?.slug ?? "rentalpins");
  const accent = accentFor(post);
  const label = placeLabel(post);
  const cols = [0.18, 0.42, 0.68, 0.9].map((f, i) => Math.round(width * f + ((seed >> (i * 3)) % 24) * k - 12 * k));
  const rows = [0.2, 0.47, 0.76].map((f, i) => Math.round(height * f + ((seed >> (i * 4 + 2)) % 24) * k - 12 * k));
  const main = { x: cols[1] + 46 * k, y: rows[1] - 6 * k };
  const others = [
    { x: cols[0] + 40 * k, y: rows[0] + 52 * k, color: GOLD },
    { x: cols[2] + 38 * k, y: rows[2] - 30 * k, color: EMERALD },
    { x: cols[2] + 64 * k, y: rows[0] + 34 * k, color: ORANGE },
  ];

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, display: "flex", overflow: "hidden" }}>
      {/* park */}
      <div
        style={{
          position: "absolute",
          left: cols[2] + 14 * k,
          top: rows[1] + 14 * k,
          width: cols[3] - cols[2] - 28 * k,
          height: rows[2] - rows[1] - 28 * k,
          borderRadius: 18,
          background: "rgba(18,165,139,0.22)",
        }}
      />
      {/* blocks */}
      <div
        style={{
          position: "absolute",
          left: cols[0] + 14 * k,
          top: rows[1] + 14 * k,
          width: cols[1] - cols[0] - 28 * k,
          height: rows[2] - rows[1] - 28 * k,
          borderRadius: 14,
          background: "rgba(255,255,255,0.06)",
        }}
      />
      {/* streets */}
      {cols.map((x, i) => (
        <div
          key={`c${i}`}
          style={{
            position: "absolute",
            left: x - 6 * k,
            top: 0,
            width: 12 * k,
            height,
            background: "rgba(255,255,255,0.10)",
          }}
        />
      ))}
      {rows.map((y, i) => (
        <div
          key={`r${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: y - 6 * k,
            width,
            height: 12 * k,
            background: "rgba(255,255,255,0.10)",
          }}
        />
      ))}
      {/* river */}
      <div
        style={{
          position: "absolute",
          left: -80,
          top: height - 120 * k,
          width: width + 160,
          height: 70 * k,
          borderRadius: 70 * k,
          background: "rgba(90,150,230,0.22)",
          transform: "rotate(-9deg)",
        }}
      />
      {others.map((p, i) => (
        <Pin key={i} x={p.x} y={p.y} color={p.color} size={34 * k} />
      ))}
      {/* pulse under the main pin */}
      <div
        style={{
          position: "absolute",
          left: main.x - 44 * k,
          top: main.y - 18 * k,
          width: 88 * k,
          height: 36 * k,
          borderRadius: 88 * k,
          background: `${accent}55`,
        }}
      />
      <Pin x={main.x} y={main.y} color={accent} size={64 * k} />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: main.x - 120 * k,
            top: main.y + 26 * k,
            width: 240 * k,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: `${8 * k}px ${16 * k}px`,
              borderRadius: 999,
              background: "#ffffff",
              color: NAVY_DARK,
              fontSize: 20 * k,
              fontWeight: 700,
              boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * 1200×630 card used as the blog post's OG image and — when the post has no
 * usable cover — as its hero/card image (see resolveBlogImageUrl).
 */
export function generateBlogOgImageResponse(post: BlogPost | null): ImageResponse {
  // The article headline reads better on an image than the SEO title (which
  // often carries a "| RentalPins" suffix).
  const title = truncate(post?.title?.trim() || "RentalPins Blog", 84);
  const category = truncate(post?.category ?? "Blog", 28);
  const cover = absoluteCoverUrl(post?.coverImage);
  const accent = accentFor(post);
  const W = 1200;
  const H = 630;
  const artWidth = 500;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 60%, #2a4f8f 100%)`,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          color: "#ffffff",
        }}
      >
        {/* right-hand art: the real cover photo, or a generated map */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: artWidth,
            height: H,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              width={artWidth}
              height={H}
              style={{ width: artWidth, height: H, objectFit: "cover" }}
            />
          ) : (
            <MapArt post={post} width={artWidth} height={H} />
          )}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: artWidth,
              height: H,
              background: `linear-gradient(90deg, ${NAVY_DARK} 0%, rgba(15,37,84,0) 28%)`,
            }}
          />
        </div>

        {/* text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: W - artWidth + 20,
            height: H,
            padding: "56px 40px 52px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: ORANGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              R
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
              RentalPins
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  padding: "7px 16px",
                  borderRadius: 999,
                  background: `${accent}33`,
                  border: `2px solid ${accent}`,
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {category}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 60 ? 46 : 54,
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
              }}
            >
              {title}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: MUTED }}>
            <div style={{ width: 28, height: 4, borderRadius: 4, background: accent }} />
            <span>Owner-direct homes on a live map · rentalpins.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}

/**
 * 1200×750 (16:10) illustrated cover for the article hero and blog cards when a
 * post has no usable cover photo. No headline — the page already shows it.
 */
export function generateBlogCoverResponse(post: BlogPost | null): ImageResponse {
  const W = 1200;
  const H = 750;
  const accent = accentFor(post);
  const category = truncate(post?.category ?? "Blog", 28);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 60%, #2a4f8f 100%)`,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          color: "#ffffff",
        }}
      >
        <MapArt post={post} width={W} height={H} k={1.7} />
        <div
          style={{
            position: "absolute",
            left: 48,
            top: 44,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: ORANGE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            R
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(15,37,84,0.75)",
              border: `3px solid ${accent}`,
              fontSize: 26,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {category}
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
