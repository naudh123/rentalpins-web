import { describe, expect, it } from "vitest";
import { buildContactHandoff } from "@/lib/agent/agent-knowledge";

describe("project agent contact handoff", () => {
  it("routes project surface to WhatsApp sales line", () => {
    const result = buildContactHandoff({
      surface: "project",
      summary: "Interested in 250 sq yd plot, visit on Saturday",
    });
    expect(result.contactUrl).toContain("wa.me/919915061640");
    expect(result.message).toContain("9915061640");
  });
});
