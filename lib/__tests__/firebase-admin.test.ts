import { describe, expect, it } from "vitest";
import {
  isFirebaseAdminConfigured,
  isFirebaseAdminCredentialError,
  safeAdminRead,
} from "@/lib/firebase-admin";

describe("firebase-admin", () => {
  it("detects credential errors for safe fallbacks", () => {
    expect(isFirebaseAdminCredentialError(new Error("Could not load the default credentials"))).toBe(
      true
    );
    expect(isFirebaseAdminCredentialError(new Error("Firebase Admin is not configured"))).toBe(
      true
    );
    expect(isFirebaseAdminCredentialError(new Error("permission denied"))).toBe(false);
  });

  it("returns fallback when Admin is not configured", async () => {
    const originalEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const originalKey = process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;

    expect(isFirebaseAdminConfigured()).toBe(false);
    const result = await safeAdminRead(async () => ["live"], [] as string[]);
    expect(result).toEqual([]);

    if (originalEmail) process.env.FIREBASE_CLIENT_EMAIL = originalEmail;
    if (originalKey) process.env.FIREBASE_PRIVATE_KEY = originalKey;
  });
});
