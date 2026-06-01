import { describe, expect, it, vi, beforeEach } from "vitest";

describe("siteUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses localhost in development when configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const { siteUrl } = await import("@/lib/config");
    expect(siteUrl).toBe("http://localhost:3000");
  });

  it("uses production URL when localhost is configured at build time", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const { siteUrl } = await import("@/lib/config");
    expect(siteUrl).toBe("https://www.rentalpins.com");
  });

  it("canonicalUrl never emits localhost in production builds", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const { canonicalUrl } = await import("@/lib/seo");
    expect(canonicalUrl("/")).toBe("https://www.rentalpins.com/");
    expect(canonicalUrl("/search")).toBe("https://www.rentalpins.com/search");
  });
});
