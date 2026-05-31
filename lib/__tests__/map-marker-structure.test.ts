import { describe, expect, it } from "vitest";
import {
  buildingKeysForAffectedListings,
  isListingHoverOnlyHighlight,
  listingMarkerIconStyleChanged,
  listingMarkerStyleKey,
  listingMarkerSvgKey,
  mapPinStructureKey,
  selectionAffectedListingIds,
} from "@/lib/map-marker-structure";

describe("listingMarkerStyleKey", () => {
  it("changes only when selection or highlight moves", () => {
    expect(listingMarkerStyleKey("a", "a", null)).toBe("1|0");
    expect(listingMarkerStyleKey("a", null, "a")).toBe("0|1");
    expect(listingMarkerStyleKey("a", null, null)).toBe("0|0");
  });
});

describe("listingMarkerSvgKey", () => {
  it("ignores selection state", () => {
    const key = listingMarkerSvgKey({ price: 5000, isPromoted: true, homeIso: "IN" }, "compact");
    expect(key).toContain("5000");
    expect(key).not.toContain("|1|0");
  });
});

describe("listingMarkerIconStyleChanged", () => {
  it("skips icon rebuild for hover-only highlight", () => {
    expect(listingMarkerIconStyleChanged("0|0", "0|1", true)).toBe(false);
    expect(listingMarkerIconStyleChanged("0|0", "0|1", false)).toBe(true);
  });
});

describe("isListingHoverOnlyHighlight", () => {
  it("is true for list hover without selection", () => {
    expect(isListingHoverOnlyHighlight("a", null, "a")).toBe(true);
    expect(isListingHoverOnlyHighlight("a", "a", "a")).toBe(false);
  });
});

describe("mapPinStructureKey", () => {
  it("changes when pin set or label tier changes", () => {
    const base = mapPinStructureKey({
      useBuildingPins: true,
      labelTier: "compact",
      pinIdsKey: "a,b",
      buildingKeysKey: "k1",
    });
    expect(
      mapPinStructureKey({
        useBuildingPins: true,
        labelTier: "detailed",
        pinIdsKey: "a,b",
        buildingKeysKey: "k1",
      })
    ).not.toBe(base);
  });
});

describe("selectionAffectedListingIds", () => {
  it("includes previous and current selection ids", () => {
    const ids = selectionAffectedListingIds("a", "b", "c", "d");
    expect([...ids].sort()).toEqual(["a", "b", "c", "d"]);
  });
});

describe("buildingKeysForAffectedListings", () => {
  it("returns building keys touching affected listings", () => {
    const groups = new Map([
      ["b1", [{ id: "x" }, { id: "y" }]],
      ["b2", [{ id: "z" }]],
    ]);
    expect(
      buildingKeysForAffectedListings(groups, new Set(["y"]))
    ).toEqual(["b1"]);
  });
});
