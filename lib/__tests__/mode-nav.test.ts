import { describe, expect, it } from "vitest";
import {
  GLOBAL_PRIMARY_NAV,
  GLOBAL_SECONDARY_NAV,
} from "@/lib/nav/mode-nav";

describe("marketing global nav", () => {
  it("surfaces three products and blog in primary nav", () => {
    const labels = GLOBAL_PRIMARY_NAV.map((item) => item.label);
    expect(labels).toEqual(["Rent", "Buy", "Invest", "Blog"]);
  });

  it("moves projects and cities to secondary nav", () => {
    const labels = GLOBAL_SECONDARY_NAV.map((item) => item.label);
    expect(labels).toContain("Projects");
    expect(labels).toContain("Cities");
    expect(labels).not.toContain("Rent");
    expect(labels).not.toContain("Blog");
  });
});
