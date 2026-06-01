import { describe, expect, it } from "vitest";
import { isValidPhoneForAuth, normalizePhoneForAuth } from "@/lib/phone-auth";

describe("phone-auth", () => {
  it("normalizes 10-digit IN mobiles to E.164", () => {
    expect(normalizePhoneForAuth("9876543210")).toBe("+919876543210");
    expect(normalizePhoneForAuth("+91 98765 43210")).toBe("+919876543210");
  });

  it("rejects incomplete numbers", () => {
    expect(isValidPhoneForAuth("+91")).toBe(false);
    expect(isValidPhoneForAuth("")).toBe(false);
  });

  it("accepts valid E.164 numbers", () => {
    expect(isValidPhoneForAuth("+919876543210")).toBe(true);
  });
});
