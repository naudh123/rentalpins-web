import { describe, expect, it } from "vitest";
import {
  isCoordOnlyLocationLabel,
  isValidListingCoordinate,
  listingCoordinateWarning,
  pickListingLocationName,
} from "@/lib/listing-location";

describe("listing-location", () => {
  it("rejects invalid coordinates", () => {
    expect(isValidListingCoordinate(0, 0)).toBe(false);
    expect(isValidListingCoordinate(91, 0)).toBe(false);
  });

  it("detects coord-only labels", () => {
    expect(isCoordOnlyLocationLabel("30.7333, 76.7794")).toBe(true);
    expect(isCoordOnlyLocationLabel("Sector 17, Chandigarh")).toBe(false);
  });

  it("warns for pins outside India when homeIso is IN", () => {
    expect(listingCoordinateWarning(40, 10, "IN")).toContain("outside India");
    expect(listingCoordinateWarning(30.73, 76.78, "IN")).toBeNull();
  });

  it("pickListingLocationName prefers geocoded address", () => {
    expect(
      pickListingLocationName("30.7333, 76.7794", "Sector 17, Chandigarh")
    ).toBe("Sector 17, Chandigarh");
    expect(pickListingLocationName("Sector 17", null)).toBe("Sector 17");
  });
});
