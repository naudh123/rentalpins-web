import { describe, expect, it } from "vitest";
import { formatBudgetLabel } from "@/lib/buyer-requirements";

describe("buyer-requirements", () => {
  it("formats budget bands for display", () => {
    expect(formatBudgetLabel(50_00_000, 80_00_000)).toBe("₹50L – ₹80L");
    expect(formatBudgetLabel(null, 1_20_00_000)).toBe("Up to ₹1.2Cr");
    expect(formatBudgetLabel(1_00_00_000, null)).toBe("₹1Cr+");
  });
});
