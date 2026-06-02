import { describe, expect, it } from "vitest";
import { detectInAppBrowser } from "@/lib/in-app-browser";

describe("detectInAppBrowser", () => {
  it("detects Facebook in-app browser", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/450.0.0.24.109;]";
    expect(detectInAppBrowser(ua)).toMatchObject({ inApp: true, kind: "facebook" });
  });

  it("detects Instagram in-app browser", () => {
    expect(detectInAppBrowser("Instagram 300.0.0.0 Android")).toMatchObject({
      inApp: true,
      kind: "instagram",
    });
  });

  it("returns false for normal Chrome mobile", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
    expect(detectInAppBrowser(ua).inApp).toBe(false);
  });
});
