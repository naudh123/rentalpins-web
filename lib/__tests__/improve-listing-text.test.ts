import { describe, expect, it } from "vitest";

describe("improveListingText module", () => {
  it("exports improveListingText and persistListingContentAfterAi", async () => {
    const mod = await import("@/lib/improve-listing-text");
    expect(typeof mod.improveListingText).toBe("function");
    expect(typeof mod.persistListingContentAfterAi).toBe("function");
    expect(typeof mod.persistListingContentAfterAiWithTimeout).toBe("function");
  });
});
