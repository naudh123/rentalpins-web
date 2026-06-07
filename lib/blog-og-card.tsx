import { ImageResponse } from "next/og";
import type { BlogPost } from "@/lib/blog-types";
import { appPath, siteUrl } from "@/lib/config";
import { resolveMetaDescription, resolveMetaTitle } from "@/lib/blog-validation";

const NAVY = "#1e3a6e";
const NAVY_DARK = "#0f2554";
const ORANGE = "#e8501a";
const MUTED = "#b8c4dc";

function truncate(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function resolveCoverImageUrl(coverImage?: string): string | null {
  if (!coverImage) return null;
  if (coverImage.startsWith("https://")) return coverImage;
  const path = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;
  return `${siteUrl}${appPath(path)}`;
}

export function generateBlogOgImageResponse(post: BlogPost | null): ImageResponse {
  const title = truncate(
    post ? resolveMetaTitle(post.title, post.metaTitle ?? "") : "RentalPins Blog",
    90
  );
  const description = truncate(
    post
      ? resolveMetaDescription(post.excerpt, post.metaDescription ?? "")
      : "Rental tips and city guides across India.",
    120
  );
  const category = truncate(post?.category ?? "Blog", 32);
  const author = truncate(post?.author ?? "RentalPins", 28);
  const cover = resolveCoverImageUrl(post?.coverImage);

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
            width: cover ? "52%" : "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
          {cover ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent 50%, rgba(15,37,84,0.94) 100%)",
              }}
            />
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: cover ? "48%" : "100%",
            height: "100%",
            padding: "48px 44px",
            justifyContent: "space-between",
            color: "#ffffff",
            position: cover ? "absolute" : "relative",
            right: 0,
            top: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
                RentalPins Blog
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

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                maxHeight: 190,
                overflow: "hidden",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.35,
                color: MUTED,
                maxHeight: 96,
                overflow: "hidden",
              }}
            >
              {description}
            </div>
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
            <span>{author}</span>
            <span>www.rentalpins.com/blog</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
