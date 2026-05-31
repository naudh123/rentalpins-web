import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  GA4_COLLECT_ENDPOINT,
  ga4TagLoaderUrl,
  isGa4ScriptEnabledOnBuild,
} from "@/lib/analytics-config";

describe("analytics-config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("points at Google Analytics collect endpoint", () => {
    expect(GA4_COLLECT_ENDPOINT).toContain("google-analytics.com");
  });

  it("loads gtag for production builds", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "production");
    expect(isGa4ScriptEnabledOnBuild()).toBe(true);
    expect(ga4TagLoaderUrl("G-TEST123")).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-TEST123"
    );
  });

  it("disables gtag on staging builds", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ENV", "staging");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/staging");
    expect(isGa4ScriptEnabledOnBuild()).toBe(false);
  });
});
