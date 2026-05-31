import { describe, expect, it } from "vitest";
import { buildMapViewportKey } from "@/lib/map-viewport-key";

describe("buildMapViewportKey", () => {
  it("uses zoom only when bounds are missing", () => {
    expect(buildMapViewportKey(null, 12)).toBe("z12");
  });

  it("includes rounded bounds and zoom", () => {
    const key = buildMapViewportKey(
      { north: 30.8, south: 30.65, east: 76.85, west: 76.7 },
      13
    );
    expect(key).toContain("30.800");
    expect(key).toContain("|13");
  });
});
