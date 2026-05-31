import { describe, expect, it } from "vitest";
import {
  MOBILE_MAP_MAX_FIT_ZOOM,
  MOBILE_MAP_MIN_FOCUS_ZOOM,
} from "@/lib/map-mobile";

describe("map-mobile constants", () => {
  it("keeps focus zoom below aggressive desktop pin zoom", () => {
    expect(MOBILE_MAP_MIN_FOCUS_ZOOM).toBeLessThan(15);
    expect(MOBILE_MAP_MAX_FIT_ZOOM).toBeLessThanOrEqual(15);
  });
});
