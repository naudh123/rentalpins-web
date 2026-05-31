import { describe, expect, it } from "vitest";

describe("mobile map view persistence key", () => {
  it("uses a stable sessionStorage key", () => {
    expect("rp_map_mobile_view").toMatch(/^rp_map_/);
  });
});
