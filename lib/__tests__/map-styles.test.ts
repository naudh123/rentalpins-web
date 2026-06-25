import { describe, expect, it } from "vitest";
import {
  MAP_ROADMAP_BACKGROUND,
  SALE_MAP_ROADMAP_BACKGROUND,
  SILVER_MAP_STYLES,
  SALE_MAP_STYLES,
  buildMapOptions,
  resolveMapRoadmapBackground,
  resolveMapRoadmapStyles,
} from "@/lib/map-styles";
import { getClusterRenderer, rentalPinsClusterRenderer, salePinsClusterRenderer } from "@/lib/map-cluster";

describe("map-styles", () => {
  it("resolves rent vs sale roadmap palettes", () => {
    expect(resolveMapRoadmapStyles("rent")).toBe(SILVER_MAP_STYLES);
    expect(resolveMapRoadmapStyles("sale")).toBe(SALE_MAP_STYLES);
    expect(resolveMapRoadmapBackground("rent")).toBe(MAP_ROADMAP_BACKGROUND);
    expect(resolveMapRoadmapBackground("sale")).toBe(SALE_MAP_ROADMAP_BACKGROUND);
  });

  it("builds map options with matching background and styles", () => {
    const rent = buildMapOptions("rent");
    expect(rent.backgroundColor).toBe(MAP_ROADMAP_BACKGROUND);
    expect(rent.styles).toBe(SILVER_MAP_STYLES);
    const sale = buildMapOptions("sale");
    expect(sale.backgroundColor).toBe(SALE_MAP_ROADMAP_BACKGROUND);
    expect(sale.styles).toBe(SALE_MAP_STYLES);
  });
});

describe("map-cluster renderers", () => {
  it("picks sale vs rental cluster renderer", () => {
    expect(getClusterRenderer(false)).toBe(rentalPinsClusterRenderer);
    expect(getClusterRenderer(true)).toBe(salePinsClusterRenderer);
  });
});
