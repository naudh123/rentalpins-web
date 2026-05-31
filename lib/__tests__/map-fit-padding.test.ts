import { describe, expect, it } from "vitest";
import { fitBoundsPaddingForMobileView } from "@/lib/map-fit-padding";

describe("fitBoundsPaddingForMobileView", () => {
  it("reserves more bottom space when the list sheet is open", () => {
    const map = fitBoundsPaddingForMobileView("map");
    const peek = fitBoundsPaddingForMobileView("peek");
    const list = fitBoundsPaddingForMobileView("list");
    expect(peek.bottom).toBeGreaterThan(map.bottom);
    expect(list.bottom).toBeGreaterThan(peek.bottom);
  });
});
