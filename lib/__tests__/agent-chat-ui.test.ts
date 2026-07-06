import { describe, expect, it } from "vitest";
import { formatAgentChatError } from "@/lib/agent/chat-ui";

describe("formatAgentChatError", () => {
  it("parses JSON error bodies from the API", () => {
    const msg = formatAgentChatError(
      '{"error":"Property agent is not configured. Set OPENAI_API_KEY on the server (Vercel production env)."}'
    );
    expect(msg).toContain("OPENAI_API_KEY");
    expect(msg).not.toContain("{");
  });

  it("handles plain not-configured messages", () => {
    expect(formatAgentChatError("OPENAI_API_KEY is not configured")).toContain(".env.local");
  });
});
