import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  resolveDeployEnv,
  resolveShowStagingBanner,
} from "@/lib/deploy-env";

describe("deploy-env", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to production when env unset", () => {
    expect(resolveDeployEnv()).toBe("production");
    expect(resolveShowStagingBanner("production")).toBe(false);
  });

  it("uses staging only when DEPLOY_ENV is staging", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "staging");
    expect(resolveDeployEnv()).toBe("staging");
    expect(resolveShowStagingBanner("staging")).toBe(true);
  });

  it("treats SHOW_STAGING_BANNER alone as production (no banner)", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOW_STAGING_BANNER", "true");
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "production");
    expect(resolveDeployEnv()).toBe("production");
    expect(resolveShowStagingBanner("production")).toBe(false);
  });

  it("infers staging from BASE_PATH=/staging", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/staging");
    expect(resolveDeployEnv()).toBe("staging");
  });
});
