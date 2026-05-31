import { describe, expect, it } from "vitest";
import { nextMapMobileView } from "@/hooks/useMapKeyboardShortcuts";

describe("nextMapMobileView", () => {
  it("toggles map ↔ list (peek migrates to map)", () => {
    expect(nextMapMobileView("map")).toBe("list");
    expect(nextMapMobileView("list")).toBe("map");
    expect(nextMapMobileView("peek")).toBe("map");
  });
});
