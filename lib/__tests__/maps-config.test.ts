import { describe, expect, it, vi, afterEach } from "vitest";

describe("isGoogleMapsConfigured", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("is false when env key is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "");
    const { isGoogleMapsConfigured } = await import("@/components/MapsApiKeyMissingNotice");
    expect(isGoogleMapsConfigured()).toBe(false);
  });

  it("is true when env key is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");
    const { isGoogleMapsConfigured } = await import("@/components/MapsApiKeyMissingNotice");
    expect(isGoogleMapsConfigured()).toBe(true);
  });
});
