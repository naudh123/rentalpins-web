import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  isProjectLeadEmailConfigured,
  sendProjectLeadEmail,
} from "@/lib/builders/project-lead-email";

describe("project-lead-email", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("reports not configured without RESEND_API_KEY", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(isProjectLeadEmailConfigured()).toBe(false);
  });

  it("skips send when email not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const result = await sendProjectLeadEmail({
      leadId: "abc",
      input: {
        builderId: "b1",
        source: "project_page",
        name: "Test User",
        phone: "9876543210",
        email: "test@example.com",
      },
    });
    expect(result.success).toBe(false);
  });

  it("sends to LEAD_NOTIFICATION_EMAIL when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("LEAD_NOTIFICATION_EMAIL", "admin@rentalpins.com");

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendProjectLeadEmail({
      leadId: "abc",
      input: {
        builderId: "b1",
        projectId: "p1",
        source: "brochure_download",
        name: "Raj",
        phone: "9915061640",
        email: "raj@example.com",
        budgetRange: "₹1 – ₹2 Cr",
      },
      projectName: "DLF Hyde Park",
      builderName: "DLF",
      citySlug: "mohali",
    });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.to).toEqual(["admin@rentalpins.com"]);
    expect(body.replyTo).toBe("raj@example.com");
    expect(body.subject).toContain("DLF Hyde Park");
  });
});
