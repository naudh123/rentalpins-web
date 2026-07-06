import { describe, expect, it } from "vitest";
import { drawAreaPrompt } from "@/lib/map-draw-ui";

describe("drawAreaPrompt", () => {
  it("describes desktop rectangle drag", () => {
    expect(drawAreaPrompt("rect", { mobile: false, pointCount: 0 })).toMatch(/drag/i);
  });

  it("describes mobile rectangle as two taps", () => {
    expect(drawAreaPrompt("rect", { mobile: true, pointCount: 0 })).toMatch(/two opposite corners/i);
  });

  it("guides polygon until three points", () => {
    expect(drawAreaPrompt("poly", { mobile: false, pointCount: 1 })).toMatch(/2 more points/i);
    expect(drawAreaPrompt("poly", { mobile: false, pointCount: 3 })).toMatch(/finish/i);
  });
});
