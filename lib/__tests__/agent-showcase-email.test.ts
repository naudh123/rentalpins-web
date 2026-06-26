import { describe, expect, it, vi, afterEach } from "vitest";
import { shouldNotifyShowcaseLead } from "@/lib/agent/showcase-lead-email";

describe("showcase lead email", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires showcase surface and high intent", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(
      shouldNotifyShowcaseLead({
        surface: "advisor",
        highIntent: true,
        alreadyNotified: false,
      })
    ).toBe(false);

    expect(
      shouldNotifyShowcaseLead({
        surface: "showcase",
        highIntent: false,
        alreadyNotified: false,
      })
    ).toBe(false);
  });

  it("skips when already notified", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("LEAD_NOTIFICATION_EMAIL", "leads@example.com");

    expect(
      shouldNotifyShowcaseLead({
        surface: "showcase",
        highIntent: true,
        alreadyNotified: true,
      })
    ).toBe(false);
  });

  it("notifies when configured and showcase high intent", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("LEAD_NOTIFICATION_EMAIL", "leads@example.com");

    expect(
      shouldNotifyShowcaseLead({
        surface: "showcase",
        highIntent: true,
        alreadyNotified: false,
      })
    ).toBe(true);
  });
});
