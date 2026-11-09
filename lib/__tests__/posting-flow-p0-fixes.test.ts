import { describe, expect, it } from "vitest";
import { isActivationConfirmed, parseActivateListing } from "@/lib/activate-listing";
import { pickOwnerProjectPatch } from "@/lib/builders/project-patch";
import { isOwnerPhoneVerified } from "@/lib/phone-auth";

describe("pickOwnerProjectPatch", () => {
  it("keeps content fields and drops protected ones", () => {
    const out = pickOwnerProjectPatch({
      name: "Green Valley",
      isPublished: true,
      priceMin: 100,
      ownerUserId: "attacker",
      builderId: "other-builder",
      slug: "someone-elses-slug",
      leadRouting: "builder",
      viewCount: 9999,
      enquiryCount: 50,
      isFeatured: true,
      featuredUntil: 123,
      createdBy: "x",
    });
    expect(out).toEqual({ name: "Green Valley", priceMin: 100 });
  });

  it("does not let owners publish (staff review publishes projects)", () => {
    expect(pickOwnerProjectPatch({ isPublished: true })).toEqual({});
    expect(pickOwnerProjectPatch({ isPublished: true, seoTitle: "t" })).toEqual({ seoTitle: "t" });
  });

  it("drops undefined values and rejects non-objects", () => {
    expect(pickOwnerProjectPatch({ name: undefined, description: "d" })).toEqual({
      description: "d",
    });
    expect(pickOwnerProjectPatch(null)).toEqual({});
    expect(pickOwnerProjectPatch(["name"])).toEqual({});
  });
});

describe("isOwnerPhoneVerified", () => {
  it("is true only when the contact number is the OTP-verified number", () => {
    expect(isOwnerPhoneVerified("+91 98765 43210", "+919876543210")).toBe(true);
    expect(isOwnerPhoneVerified("9876543210", "+919876543210")).toBe(true);
  });

  it("is false for a different number or no verified phone", () => {
    expect(isOwnerPhoneVerified("+91 91111 22222", "+919876543210")).toBe(false);
    expect(isOwnerPhoneVerified("+91 98765 43210", null)).toBe(false);
    expect(isOwnerPhoneVerified("+91 ", "+919876543210")).toBe(false);
  });
});

describe("isActivationConfirmed", () => {
  it("first activation: confirmed once the doc is active", () => {
    expect(isActivationConfirmed({ isActive: false }, null)).toBe(false);
    expect(isActivationConfirmed({ isActive: true }, null)).toBe(true);
  });

  it("renew: an unrelated write to the live doc is not success", () => {
    const baseline = { expiresAtMs: 1_000 };
    expect(isActivationConfirmed({ isActive: true, listingExpiresAtMs: 1_000 }, baseline)).toBe(
      false
    );
    expect(isActivationConfirmed({ isActive: true }, baseline)).toBe(false);
  });

  it("renew: confirmed when the expiry moves later", () => {
    expect(
      isActivationConfirmed({ isActive: true, listingExpiresAtMs: 2_000 }, { expiresAtMs: 1_000 })
    ).toBe(true);
    expect(
      isActivationConfirmed({ isActive: true, listingExpiresAtMs: 2_000 }, { expiresAtMs: undefined })
    ).toBe(true);
  });

  it("parseActivateListing reads listingExpiresAt timestamps", () => {
    const parsed = parseActivateListing("id1", {
      isActive: true,
      listingExpiresAt: { toMillis: () => 5_000 },
    });
    expect(parsed.listingExpiresAtMs).toBe(5_000);
  });
});
