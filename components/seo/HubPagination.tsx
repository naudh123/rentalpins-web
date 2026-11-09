import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { hubPagePath } from "@/lib/seo/hub-pagination";

interface Props {
  /** Hub path without `/page/n`, e.g. `/rentals/in/gurugram`. */
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  placeName: string;
}

/** Page numbers to show: first, last, current ±2, with gaps as null. */
function pageWindow(page: number, totalPages: number): Array<number | null> {
  const pages = new Set<number>([1, totalPages]);
  for (let p = page - 2; p <= page + 2; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | null> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

const pill = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 40,
  height: 40,
  padding: "0 12px",
  borderRadius: 10,
  border: `1px solid ${BRAND.border}`,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
  color: BRAND.navy,
  background: BRAND.white,
} as const;

/**
 * Plain-link pagination for rental hubs. Server-rendered <a href> so Googlebot
 * can follow every page and reach every listing without running the map.
 */
export default function HubPagination({
  basePath,
  page,
  totalPages,
  total,
  from,
  to,
  placeName,
}: Props) {
  if (total === 0) return null;

  return (
    <nav
      aria-label={`More rentals in ${placeName}`}
      style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 16px 40px", textAlign: "center" }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: BRAND.muted,
          margin: "0 0 14px",
        }}
      >
        Showing {from}–{to} of {total} rentals in {placeName}
      </p>
      {totalPages > 1 ? (
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {page > 1 ? (
            <li>
              <Link href={hubPagePath(basePath, page - 1)} rel="prev" style={pill}>
                ‹ Previous
              </Link>
            </li>
          ) : null}
          {pageWindow(page, totalPages).map((p, i) =>
            p === null ? (
              <li key={`gap-${i}`} aria-hidden="true" style={{ ...pill, border: "none", background: "transparent" }}>
                …
              </li>
            ) : (
              <li key={p}>
                {p === page ? (
                  <span
                    aria-current="page"
                    style={{ ...pill, background: BRAND.navy, color: BRAND.white, borderColor: BRAND.navy }}
                  >
                    {p}
                  </span>
                ) : (
                  <Link href={hubPagePath(basePath, p)} style={pill} aria-label={`Page ${p}`}>
                    {p}
                  </Link>
                )}
              </li>
            )
          )}
          {page < totalPages ? (
            <li>
              <Link href={hubPagePath(basePath, page + 1)} rel="next" style={pill}>
                Next ›
              </Link>
            </li>
          ) : null}
        </ol>
      ) : null}
    </nav>
  );
}
