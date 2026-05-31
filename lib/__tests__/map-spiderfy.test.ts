import { describe, expect, it } from "vitest";
import { spiderfyPositions } from "../map-spiderfy";

describe("spiderfyPositions", () => {
  it("returns one position for a single marker", () => {
    expect(spiderfyPositions(12, 77, 1)).toEqual([{ lat: 12, lng: 77 }]);
  });

  it("spreads multiple markers in a ring", () => {
    const positions = spiderfyPositions(12, 77, 4);
    expect(positions).toHaveLength(4);
    const keys = new Set(positions.map((p) => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`));
    expect(keys.size).toBe(4);
  });
});
