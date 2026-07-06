import { describe, expect, it } from "vitest";
import {
  getIndexableAreas,
  getLiveCities,
  rentalAreaPath,
  rentalCityPath,
} from "@/lib/cities-config";
import { getIndianGscSitemapPaths } from "@/lib/rental-area-config";
import { getInvestSitemapPaths } from "@/lib/invest/invest-sitemap";
import { protectedRoutes } from "@/lib/seo/protectedRoutes";
import { getProgrammaticSeoSitemapPaths } from "@/lib/seo/seoData";
import { getCoreMarketingSitemapSlugs } from "@/lib/seo/sitemap-config";

const BASE = process.env.SEO_AUDIT_BASE_URL ?? "http://127.0.0.1:3000";
const RUN_AUDIT = process.env.SEO_AUDIT === "1";

interface AuditResult {
  path: string;
  status: number;
  title: string;
  description: string;
  canonical: string;
  h1Count: number;
  robotsNoindex: boolean;
  hasFaqSchema: boolean;
  jsonLdCount: number;
  issues: string[];
}

function collectIndexablePaths(): string[] {
  const paths = new Set<string>([
    "/",
    "/search",
    "/rentals",
    "/blog",
    "/advisor",
    ...getInvestSitemapPaths(),
    ...protectedRoutes,
  ]);

  for (const slug of getCoreMarketingSitemapSlugs()) {
    paths.add(`/${slug}`);
  }
  for (const path of getIndianGscSitemapPaths()) {
    paths.add(path);
  }
  for (const { path } of getProgrammaticSeoSitemapPaths()) {
    paths.add(path);
  }
  for (const city of getLiveCities()) {
    paths.add(rentalCityPath(city.countrySlug, city.slug));
  }
  for (const area of getIndexableAreas()) {
    paths.add(
      rentalAreaPath(area.parentCountrySlug, area.parentSlug, area.slug)
    );
  }

  return [...paths].sort();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function auditHtml(path: string, status: number, html: string): AuditResult {
  const issues: string[] = [];
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta\s+name="description"\s+content="([^"]*)"/i
  );
  const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  const title = titleMatch ? stripTags(titleMatch[1]) : "";
  const description = descMatch?.[1] ?? "";
  const canonical = canonMatch?.[1] ?? "";
  const robotsNoindex = /noindex/i.test(robotsMatch?.[1] ?? "");
  const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/.test(html);
  const jsonLdCount = (html.match(/<script type="application\/ld\+json">/g) ?? [])
    .length;

  if (status !== 200) issues.push(`HTTP ${status}`);
  if (!title) issues.push("missing <title>");
  if (title.length > 70) issues.push(`title too long (${title.length})`);
  if (!description) issues.push("missing meta description");
  if (description.length > 165) issues.push(`description too long (${description.length})`);
  if (!canonical) issues.push("missing canonical");
  if (h1Count === 0) issues.push("missing H1");
  if (h1Count > 1) issues.push(`multiple H1 (${h1Count})`);
  if (jsonLdCount === 0) issues.push("no JSON-LD");

  return {
    path,
    status,
    title,
    description,
    canonical,
    h1Count,
    robotsNoindex,
    hasFaqSchema,
    jsonLdCount,
    issues,
  };
}

async function fetchPage(path: string): Promise<AuditResult> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  return auditHtml(path, res.status, html);
}

describe.skipIf(!RUN_AUDIT)("SEO runtime audit (indexable pages)", () => {
  const paths = collectIndexablePaths();

  it(`audits ${paths.length} indexable paths on ${BASE}`, async () => {
    const results: AuditResult[] = [];
    const batchSize = 8;

    for (let i = 0; i < paths.length; i += batchSize) {
      const batch = paths.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((path) => fetchPage(path)));
      results.push(...batchResults);
    }

    const failed = results.filter((r) => r.status !== 200);
    const issueRows = results.filter((r) => r.issues.length > 0);
    const noindexProtected = results.filter(
      (r) => protectedRoutes.includes(r.path as (typeof protectedRoutes)[number]) && r.robotsNoindex
    );
    const marketingNoFaq = results.filter(
      (r) =>
        getCoreMarketingSitemapSlugs().some((slug) => `/${slug}` === r.path) &&
        !r.hasFaqSchema &&
        r.status === 200
    );

    if (failed.length > 0) {
      console.error("\n--- 404 / non-200 pages ---");
      for (const row of failed) {
        console.error(`${row.path} -> ${row.status}`);
      }
    }

    if (issueRows.length > 0) {
      console.error("\n--- SEO issues ---");
      for (const row of issueRows.slice(0, 40)) {
        console.error(`${row.path}: ${row.issues.join("; ")}`);
      }
      if (issueRows.length > 40) {
        console.error(`... and ${issueRows.length - 40} more`);
      }
    }

    if (noindexProtected.length > 0) {
      console.error("\n--- protected routes marked noindex ---");
      for (const row of noindexProtected) {
        console.error(row.path);
      }
    }

    if (marketingNoFaq.length > 0) {
      console.warn("\n--- marketing pages without FAQ schema ---");
      for (const row of marketingNoFaq.slice(0, 20)) {
        console.warn(row.path);
      }
    }

    console.log(
      `\nAudit summary: ${results.length} paths, ${failed.length} non-200, ${issueRows.length} with issues`
    );

    expect(failed, "All indexable paths should return 200").toHaveLength(0);
    expect(
      noindexProtected,
      "Protected routes must not be noindex"
    ).toHaveLength(0);
  }, 600_000);
});

describe("SEO static inventory", () => {
  it("collects a non-trivial indexable path set", () => {
    const paths = collectIndexablePaths();
    expect(paths.length).toBeGreaterThan(100);
    expect(paths).toContain("/pg-near-chandigarh-university");
    expect(paths).toContain("/pg-near-isb-mohali");
    expect(paths).toContain("/accommodation-near-jlpl-industrial-area");
    expect(paths).toContain("/rentals/in/chandigarh/banur");
    expect(paths).toContain("/universities/chandigarh-university/pg");
  });
});
