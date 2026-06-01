import { canonicalUrl } from "@/lib/seo";

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export function buildSitemapXml(urls: SitemapUrlEntry[]): string {
  const body = urls
    .map((u) => {
      const parts = [`    <url>`, `      <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`      <lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`      <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority != null) parts.push(`      <priority>${u.priority.toFixed(1)}</priority>`);
      parts.push(`    </url>`);
      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function buildSitemapIndexXml(sitemapUrls: string[]): string {
  const now = new Date().toISOString();
  const body = sitemapUrls
    .map(
      (loc) =>
        `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toSitemapEntry(
  path: string,
  opts?: Omit<SitemapUrlEntry, "loc">
): SitemapUrlEntry {
  return { loc: canonicalUrl(path), ...opts };
}
