import Link from "next/link";
import ListingsGrid from "@/components/ListingsGrid";
import MarketingShell from "@/components/MarketingShell";
import HubPagination from "@/components/seo/HubPagination";
import { BRAND } from "@/lib/brand";
import { canonicalUrl } from "@/lib/seo";
import type { HubPage } from "@/lib/seo/hub-pagination";

export interface HubCrumb {
  name: string;
  path: string;
}

interface Props {
  placeName: string;
  /** Hub path for page 1, e.g. `/rentals/in/gurugram`. */
  basePath: string;
  hubPage: HubPage;
  /** Home › Rentals › City (› Locality) — the hub itself is the last crumb. */
  crumbs: HubCrumb[];
  /** Nearby localities / sibling hubs to keep link equity flowing. */
  relatedLinks: Array<{ label: string; href: string }>;
}

/** `/rentals/{country}/{city}[/{area}]/page/{n}`: one crawlable slice of a hub's listings. */
export default function HubListingsPage({
  placeName,
  basePath,
  hubPage,
  crumbs,
  relatedLinks,
}: Props) {
  const { page, totalPages } = hubPage;
  const selfUrl = canonicalUrl(`${basePath}/page/${page}`);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: canonicalUrl(c.path),
      })),
      { "@type": "ListItem", position: crumbs.length + 1, name: `Page ${page}`, item: selfUrl },
    ],
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px 0" }}>
        <nav aria-label="Breadcrumb" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted }}>
          {crumbs.map((c) => (
            <span key={c.path}>
              <Link href={c.path} style={{ color: BRAND.muted }}>
                {c.name}
              </Link>
              {" › "}
            </span>
          ))}
          <span aria-current="page">Page {page}</span>
        </nav>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(24px, 4vw, 34px)",
            color: BRAND.navy,
            margin: "12px 0 8px",
          }}
        >
          Rentals in {placeName} — page {page} of {totalPages}
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: BRAND.muted, margin: 0 }}>
          Owner-direct flats, PG, rooms and commercial space in {placeName}.{" "}
          <Link href={basePath} style={{ color: BRAND.orange, fontWeight: 600 }}>
            Back to the {placeName} rental guide
          </Link>
          .
        </p>
      </header>

      <ListingsGrid listings={hubPage.listings} areaName={placeName} />

      <HubPagination
        basePath={basePath}
        page={page}
        totalPages={totalPages}
        total={hubPage.total}
        from={hubPage.from}
        to={hubPage.to}
        placeName={placeName}
      />

      {relatedLinks.length > 0 ? (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 48px" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: BRAND.navy, margin: "0 0 12px" }}>
            Nearby areas
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {relatedLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={{
                    display: "inline-block",
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${BRAND.border}`,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: BRAND.navy,
                    textDecoration: "none",
                  }}
                >
                  Rentals in {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </MarketingShell>
  );
}
