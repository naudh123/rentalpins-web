import { describe, expect, it } from "vitest";
import { nextMapMobileView } from "@/hooks/useMapKeyboardShortcuts";

describe("nextMapMobileView", () => {
  it("cycles map → peek → list → map", () => {
    expect(nextMapMobileView("map")).toBe("peek");
    expect(nextMapMobileView("peek")).toBe("list");
    expect(nextMapMobileView("list")).toBe("map");
  });
});
