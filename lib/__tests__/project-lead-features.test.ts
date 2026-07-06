import { describe, expect, it } from "vitest";
import { PLATFORM_SALES_PHONE, resolveProjectContact } from "@/lib/builders/project-contact";
import { estimateEmi, formatEmi } from "@/lib/builders/project-emi";
import {
  formatAvailabilityLabel,
  daysUntilLaunch,
} from "@/lib/builders/project-scarcity";

describe("project-contact", () => {
  it("defaults to platform sales phone", () => {
    expect(resolveProjectContact(null, null).phone).toBe(PLATFORM_SALES_PHONE);
    expect(PLATFORM_SALES_PHONE).toBe("9915061640");
  });

  it("uses builder phone only for direct routing", () => {
    expect(resolveProjectContact("9876543210", null, "direct").phone).toBe("9876543210");
    expect(resolveProjectContact("9876543210", null, "platform").phone).toBe(
      PLATFORM_SALES_PHONE
    );
  });
});

describe("project-emi", () => {
  it("computes positive EMI for valid principal", () => {
    const emi = estimateEmi(1_00_00_000, 8.5, 20);
    expect(emi).toBeGreaterThan(0);
    expect(formatEmi(emi)).toMatch(/₹/);
  });
});

describe("project-scarcity", () => {
  it("formats scarcity labels", () => {
    expect(
      formatAvailabilityLabel({
        total: 10,
        available: 1,
        reserved: 0,
        sold: 9,
        comingSoon: 0,
        hold: 0,
        notReleased: 0,
      })
    ).toBe("Only 1 unit left");
  });

  it("returns days until launch", () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const days = daysUntilLaunch(future.toISOString().slice(0, 10));
    expect(days).toBeGreaterThanOrEqual(29);
  });
});
