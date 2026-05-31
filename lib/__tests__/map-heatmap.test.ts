import { describe, expect, it } from "vitest";
import {
  heatmapRadiusForZoom,
  heatmapWeight,
  sampleListingsForHeatmap,
} from "@/lib/map-heatmap";
import type { ListingCard } from "@/lib/types/listing";

function card(id: string, promoted = false): ListingCard {
  return {
    id,
    title: "Test",
    price: 1000,
    priceUnit: "mo",
    category: "Residential",
    lat: 30.7,
    lng: 76.7,
    imageUrl: "",
    locationName: "Test",
    isPromoted: promoted,
    updatedAt: new Date().toISOString(),
  };
}

describe("map-heatmap", () => {
  it("caps sample size", () => {
    const many = Array.from({ length: 500 }, (_, i) => card(String(i)));
    expect(sampleListingsForHeatmap(many, 100).length).toBeLessThanOrEqual(100);
  });

  it("weights promoted listings higher", () => {
    expect(heatmapWeight(card("a", true))).toBe(2);
    expect(heatmapWeight(card("b"))).toBe(1);
  });

  it("uses larger radius when zoomed out", () => {
    expect(heatmapRadiusForZoom(5)).toBeGreaterThan(heatmapRadiusForZoom(9));
  });
});
