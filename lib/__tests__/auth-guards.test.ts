import { describe, expect, it, vi, afterEach } from "vitest";

describe("auth-guards phone gate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("requires Firebase phone when verification flag is true", async () => {
    vi.stubEnv("NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION", "true");
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "staging");
    const { mustVerifyPhone, canLeaveLogin } = await import("@/lib/auth-guards");
    const user = { phoneNumber: null } as { phoneNumber: string | null };
    expect(mustVerifyPhone(user)).toBe(true);
    expect(canLeaveLogin(user)).toBe(false);
  });

  it("allows user with verified phoneNumber", async () => {
    vi.stubEnv("NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION", "true");
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "staging");
    const { mustVerifyPhone, canLeaveLogin } = await import("@/lib/auth-guards");
    const user = { phoneNumber: "+919876543210" } as { phoneNumber: string };
    expect(mustVerifyPhone(user)).toBe(false);
    expect(canLeaveLogin(user)).toBe(true);
  });

  it("defaults to required on production deploy env", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION", "");
    const { mustVerifyPhone } = await import("@/lib/auth-guards");
    const user = { phoneNumber: null } as { phoneNumber: string | null };
    expect(mustVerifyPhone(user)).toBe(true);
  });
});
