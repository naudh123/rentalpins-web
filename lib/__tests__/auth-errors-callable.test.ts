import { describe, expect, it } from "vitest";
import { CallableError } from "@/lib/firebase-callable";
import { mapCallableError } from "@/lib/auth-errors";

describe("mapCallableError", () => {
  it("maps deadline-exceeded to AI-friendly copy", () => {
    const err = new CallableError(
      "functions/deadline-exceeded",
      "Request timed out. Please try again."
    );
    expect(mapCallableError(err)).toContain("too long");
  });

  it("maps unauthenticated callable errors", () => {
    const err = new CallableError("functions/unauthenticated", "Sign in required.");
    expect(mapCallableError(err)).toContain("session expired");
  });

  it("maps improve listing internal errors", () => {
    const err = new CallableError("functions/internal", "Failed to improve listing");
    expect(mapCallableError(err)).toContain("publish manually");
  });
});
