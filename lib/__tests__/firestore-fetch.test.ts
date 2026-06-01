import { describe, expect, it } from "vitest";
import { isFirestoreOfflineError } from "@/lib/firestore-fetch";
import { mapAuthError } from "@/lib/auth-errors";

describe("firestore-fetch", () => {
  it("detects offline Firestore errors", () => {
    expect(
      isFirestoreOfflineError(
        new Error("Failed to get document because the client is offline.")
      )
    ).toBe(true);
    expect(isFirestoreOfflineError({ code: "unavailable" })).toBe(true);
    expect(isFirestoreOfflineError(new Error("permission denied"))).toBe(false);
  });

  it("maps offline errors to friendly copy", () => {
    expect(
      mapAuthError(new Error("Failed to get document because the client is offline."))
    ).toContain("offline");
  });
});
