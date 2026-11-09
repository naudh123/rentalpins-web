import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { shouldRefetchOnFilters, shouldRefetchOnVisibility } from "@/lib/map-fetch-triggers";

const root = path.resolve(__dirname, "../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

describe("map fetch triggers", () => {
  it("refetches only when the tab goes hidden → visible", () => {
    expect(shouldRefetchOnVisibility(false, true)).toBe(true);
    // Mount while visible, and every later render while visible: no forced fetch.
    expect(shouldRefetchOnVisibility(true, true)).toBe(false);
    expect(shouldRefetchOnVisibility(true, false)).toBe(false);
    expect(shouldRefetchOnVisibility(false, false)).toBe(false);
  });

  it("an idle visible tab never triggers a refetch across many renders", () => {
    let wasVisible = true;
    let forced = 0;
    for (let render = 0; render < 1000; render++) {
      if (shouldRefetchOnVisibility(wasVisible, true)) forced++;
      wasVisible = true;
    }
    expect(forced).toBe(0);
  });

  it("refetches on filter changes only", () => {
    expect(shouldRefetchOnFilters("a", "a")).toBe(false);
    expect(shouldRefetchOnFilters("a", "b")).toBe(true);
  });
});

/**
 * Regression guards for the /search refetch loop (2.7 req/s on an idle tab):
 * the fix depends on these wiring details staying in place.
 */
describe("map fetch wiring (refetch-loop regression)", () => {
  it("useMapFetchTriggers effects do not depend on callback identity", () => {
    const src = read("hooks/useMapFetchTriggers.ts");
    const deps = [...src.matchAll(/\},\s*\[([^\]]*)\]\);/g)].map((m) => m[1]);
    expect(deps.length).toBeGreaterThanOrEqual(2);
    for (const d of deps) {
      expect(d).not.toMatch(/scheduleFetchBounds|invalidateFetchCache/);
    }
  });

  it("useMapListingsFetch.fetchBounds does not depend on onFetched", () => {
    const src = read("hooks/useMapListingsFetch.ts");
    expect(src).not.toMatch(/\[[^\]]*\bonFetched\b[^\]]*\]\s*\)/);
  });

  it("SearchMap passes a stable onFetched callback", () => {
    const src = read("components/map/SearchMap.tsx");
    expect(src).not.toMatch(/onFetched:\s*\(/);
  });
});
