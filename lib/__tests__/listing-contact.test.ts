import { describe, expect, it } from "vitest";
import { showContactNotVerifiedBadge } from "@/lib/listing-contact";

describe("listing-contact", () => {
  it("shows badge only when explicitly unverified", () => {
    expect(showContactNotVerifiedBadge({ ownerPhoneVerified: false })).toBe(true);
    expect(showContactNotVerifiedBadge({ ownerPhoneVerified: true })).toBe(false);
    expect(showContactNotVerifiedBadge({})).toBe(false);
  });
});
