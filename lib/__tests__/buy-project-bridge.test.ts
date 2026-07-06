import { describe, expect, it } from "vitest";
import {
  PLATFORM_BUY_BUILDER_SLUG,
  micrositePathForProject,
} from "@/lib/builders/buy-project-bridge";

describe("buy-project-bridge", () => {
  it("uses platform builder slug fallback constant", () => {
    expect(PLATFORM_BUY_BUILDER_SLUG).toBe("rentalpins-desk");
  });

  it("builds microsite path for canonical project URLs", () => {
    expect(micrositePathForProject("mohali", "green-valley-residences")).toContain(
      "/projects/mohali/green-valley-residences"
    );
  });
});
