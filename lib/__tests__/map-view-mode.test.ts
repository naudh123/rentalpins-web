import { describe, expect, it, vi } from "vitest";

vi.stubGlobal("google", {
  maps: {
    MapTypeId: {
      ROADMAP: "roadmap",
      SATELLITE: "satellite",
      HYBRID: "hybrid",
    },
  },
});

import {
  MAP_BUILDING_PIN_ZOOM,
  MAP_SATELLITE_AUTO_ZOOM,
  resolveMapTypeId,
} from "../map-view-mode";

describe("MAP_BUILDING_PIN_ZOOM", () => {
  it("groups co-located pins before satellite auto-switch", () => {
    expect(MAP_BUILDING_PIN_ZOOM).toBeLessThan(MAP_SATELLITE_AUTO_ZOOM);
  });
});

describe("resolveMapTypeId", () => {
  it("uses roadmap in auto mode below satellite threshold", () => {
    expect(resolveMapTypeId("auto", MAP_SATELLITE_AUTO_ZOOM - 1)).toBe(
      google.maps.MapTypeId.ROADMAP
    );
  });

  it("uses hybrid in auto mode at and above satellite threshold", () => {
    expect(resolveMapTypeId("auto", MAP_SATELLITE_AUTO_ZOOM)).toBe(
      google.maps.MapTypeId.HYBRID
    );
    expect(resolveMapTypeId("auto", 18)).toBe(google.maps.MapTypeId.HYBRID);
  });

  it("locks to roadmap or satellite when mode is explicit", () => {
    expect(resolveMapTypeId("roadmap", 18)).toBe(google.maps.MapTypeId.ROADMAP);
    expect(resolveMapTypeId("satellite", 12)).toBe(google.maps.MapTypeId.SATELLITE);
  });
});
