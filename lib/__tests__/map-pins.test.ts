import { describe, expect, it } from "vitest";
import { formatMapPinLabel, resolveMapPinColors } from "@/lib/map-pins";

const saleListing = {
  price: 4_190_000,
  homeIso: "IN",
  category: "property",
  priceUnit: "total",
  transactionType: "sale",
};

describe("formatMapPinLabel", () => {
  it("compactifies sale prices at every zoom tier", () => {
    expect(formatMapPinLabel(saleListing, "detailed")).toBe("₹42L");
    expect(formatMapPinLabel(saleListing, "compact")).toBe("₹42L");
  });

  it("compactifies rent prices at every zoom tier", () => {
    expect(
      formatMapPinLabel(
        {
          price: 25_000,
          homeIso: "IN",
          category: "property",
          priceUnit: "per month",
          transactionType: "rent",
        },
        "detailed"
      )
    ).toBe("₹25k");
    expect(
      formatMapPinLabel(
        {
          price: 18_000,
          homeIso: "IN",
          category: "property",
          priceUnit: "per month",
          transactionType: "rent",
        },
        "compact"
      )
    ).toBe("₹18k");
  });

  it("shows Ask on map pins for suspicious low rent", () => {
    expect(
      formatMapPinLabel(
        {
          price: 1_200,
          homeIso: "IN",
          category: "property",
          priceUnit: "per month",
          transactionType: "rent",
        },
        "compact"
      )
    ).toBe("Ask");
  });

  it("uses production navy rent pins and amber sale pins", () => {
    expect(resolveMapPinColors({ sale: false }).bg).toBe("#1E3A6E");
    expect(resolveMapPinColors({ sale: false }).text).toBe("#ffffff");
    expect(resolveMapPinColors({ sale: true }).bg).toBe("#fbb316");
    expect(resolveMapPinColors({ sale: true }).text).toBe("#1E3A6E");
  });

  it("uses orange when a rent pin is selected", () => {
    expect(resolveMapPinColors({ sale: false, selected: true }).bg).toBe("#E8501A");
  });
});
