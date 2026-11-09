import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getLiveCities } from "@/lib/cities-config";
import {
  HOME_BUY_CHIPS,
  HOME_CITIES_SECTION,
  HOME_FAQS,
  HOME_FINAL_CTA,
  HOME_FORBIDDEN_CLAIMS,
  HOME_GUIDES,
  HOME_HERO,
  HOME_META,
  HOME_OWNERS,
  HOME_VERTICALS,
  getHomeGlobalCities,
  getHomeIndiaCities,
  getHomeListPropertyLinks,
} from "@/lib/seo/home-page-content";

const APP_DIR = path.join(process.cwd(), "app");

/** Resolve a URL path to an App Router page (static, dynamic and route-group segments). */
function routeExists(urlPath: string): boolean {
  const segments = urlPath.split("?")[0]!.split("/").filter(Boolean);

  function walk(dir: string, rest: string[]): boolean {
    const entries = readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
    // Route groups are transparent.
    for (const group of entries.filter((e) => /^\(.+\)$/.test(e.name))) {
      if (walk(path.join(dir, group.name), rest)) return true;
    }
    if (rest.length === 0) {
      return existsSync(path.join(dir, "page.tsx")) || existsSync(path.join(dir, "page.ts"));
    }
    const [head, ...tail] = rest;
    const exact = entries.find((e) => e.name === head);
    if (exact && walk(path.join(dir, exact.name), tail)) return true;
    // Skip the root-level dynamic route (app/[listingId]) — it would match any
    // single-segment path and hide broken links.
    const dynamic = dir === APP_DIR ? [] : entries.filter((e) => /^\[[^.].*\]$/.test(e.name));
    for (const dyn of dynamic) {
      if (walk(path.join(dir, dyn.name), tail)) return true;
    }
    const catchAll = entries.find((e) => /^\[\[?\.\.\..+\]\]?$/.test(e.name));
    return Boolean(catchAll && existsSync(path.join(dir, catchAll.name, "page.tsx")));
  }

  return walk(APP_DIR, segments);
}

describe("home page content", () => {
  it("has a descriptive title and description within SERP limits", () => {
    const fullTitle = `${HOME_META.title} | RentalPins`;
    expect(fullTitle.length).toBeLessThanOrEqual(65);
    expect(HOME_META.description.length).toBeGreaterThanOrEqual(120);
    expect(HOME_META.description.length).toBeLessThanOrEqual(160);
    expect(HOME_HERO.headline).not.toBe("RentalPins");
  });

  it("presents the three verticals, each with a primary and secondary action", () => {
    expect(HOME_VERTICALS.map((v) => v.key)).toEqual(["rent", "buy", "invest"]);
    for (const v of HOME_VERTICALS) {
      expect(v.audience).toMatch(/^For /);
      expect(v.primary.href).not.toBe(v.secondary.href);
    }
    const byKey = Object.fromEntries(HOME_VERTICALS.map((v) => [v.key, v]));
    expect(byKey.rent!.primary.href).toBe("/search");
    expect(byKey.buy!.primary.href).toBe("/buy/search");
    expect(byKey.buy!.secondary.href).toBe("/buy/post");
    expect(byKey.invest!.primary.href).toBe("/invest");
  });

  it("links every live city hub, including the newer cities", () => {
    const hrefs = getHomeIndiaCities().map((c) => c.href);
    const liveIndia = getLiveCities().filter((c) => c.countrySlug === "in");
    expect(hrefs).toHaveLength(liveIndia.length);
    for (const slug of ["bengaluru", "gurugram", "hyderabad", "kolkata", "ghaziabad", "pune", "patna", "indore", "bhopal"]) {
      expect(hrefs).toContain(`/rentals/in/${slug}`);
    }
  });

  it("includes owner listing FAQs", () => {
    const questions = HOME_FAQS.map((f) => f.q.toLowerCase());
    expect(questions.some((q) => q.includes("list"))).toBe(true);
    expect(questions.some((q) => q.includes("who can list"))).toBe(true);
    expect(HOME_FAQS.some((f) => /free/i.test(f.q))).toBe(true);
  });

  it("avoids fake social proof claims", () => {
    const blobs = [
      HOME_META.title,
      HOME_META.description,
      HOME_HERO.headline,
      HOME_HERO.subhead,
      ...HOME_VERTICALS.flatMap((v) => [v.title, v.audience, ...v.bullets]),
      ...HOME_FAQS.flatMap((f) => [f.q, f.a]),
    ];
    for (const text of blobs) {
      expect(text).not.toMatch(HOME_FORBIDDEN_CLAIMS);
    }
  });

  it("only links to routes that exist in the app", () => {
    const hrefs = [
      HOME_HERO.rentSearch.action,
      HOME_HERO.buySearch.action,
      ...HOME_VERTICALS.flatMap((v) => [v.primary.href, v.secondary.href, ...v.more.map((l) => l.href)]),
      ...HOME_BUY_CHIPS.map((l) => l.href),
      ...getHomeIndiaCities().map((c) => c.href),
      ...getHomeGlobalCities().map((c) => c.href),
      HOME_CITIES_SECTION.allCities.href,
      ...HOME_OWNERS.paths.map((p) => p.cta.href),
      ...HOME_OWNERS.noBrokerLinks.map((l) => l.href),
      ...getHomeListPropertyLinks().map((l) => l.href),
      ...HOME_GUIDES.cards.map((c) => c.href),
      ...HOME_GUIDES.more.map((l) => l.href),
      HOME_FINAL_CTA.primary.href,
      HOME_FINAL_CTA.secondary.href,
    ];
    const missing = [...new Set(hrefs)].filter((h) => !routeExists(h));
    expect(missing).toEqual([]);
  });
});
