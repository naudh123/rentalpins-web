import { describe, expect, it } from "vitest";
import {
  looksLikeSalePriceOnRentFlow,
  looksLikeSaleTitleOnRentFlow,
  rentFlowLooksLikeSaleListing,
} from "@/lib/post-listing-intent";

describe("post-listing-intent", () => {
  it("flags lakh-scale monthly rent as likely sale", () => {
    expect(looksLikeSalePriceOnRentFlow("4200000", "per month")).toBe(true);
    expect(looksLikeSalePriceOnRentFlow("25000", "per month")).toBe(false);
  });

  it("flags crore-scale yearly rent as likely sale", () => {
    expect(looksLikeSalePriceOnRentFlow("6000000", "per year")).toBe(true);
    expect(looksLikeSalePriceOnRentFlow("360000", "per year")).toBe(false);
  });

  it("flags sale wording in title", () => {
    expect(looksLikeSaleTitleOnRentFlow("2BHK flat for sale in Sector 70")).toBe(true);
    expect(looksLikeSaleTitleOnRentFlow("Furnished 2BHK near Sector 17")).toBe(false);
  });

  it("combines title and price signals", () => {
    expect(rentFlowLooksLikeSaleListing("Nice flat", "4200000", "per month")).toBe(true);
    expect(rentFlowLooksLikeSaleListing("Nice flat", "18000", "per month")).toBe(false);
  });
});
