import { describe, expect, it } from "vitest";
import { CallableError } from "@/lib/firebase-callable";

describe("CallableError", () => {
  it("carries functions/* code for mapCallableError", () => {
    const err = new CallableError("functions/invalid-argument", "listingId is required");
    expect(err.code).toBe("functions/invalid-argument");
    expect(err.message).toContain("listingId");
  });
});
