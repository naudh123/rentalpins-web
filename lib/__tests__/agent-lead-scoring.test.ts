import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import {
  extractToolsFromMessages,
  scoreAgentConversation,
  serializeAgentTranscript,
} from "@/lib/agent/lead-scoring";

describe("agent lead scoring", () => {
  it("detects tools from message parts", () => {
    const messages: UIMessage[] = [
      {
        id: "1",
        role: "assistant",
        parts: [
          { type: "tool-buildMapSearch", toolCallId: "a", state: "output-available" },
          { type: "text", text: "Here is your map." },
        ],
      },
    ];
    expect(extractToolsFromMessages(messages)).toContain("buildMapSearch");
  });

  it("scores high intent for scheduleContact tool", () => {
    const messages: UIMessage[] = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "We want to build a PropTech portal" }] },
    ];
    const score = scoreAgentConversation({
      messages,
      toolsUsed: ["scheduleContact", "getDeveloperOffering"],
      surface: "showcase",
    });
    expect(score.highIntent).toBe(true);
    expect(score.interest).toContain("strategy");
  });

  it("scores high intent for buyer requirement tool", () => {
    const messages: UIMessage[] = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "I want 3BHK under 80 lakh in Mohali" }] },
    ];
    const score = scoreAgentConversation({
      messages,
      toolsUsed: ["matchBuyerRequirement", "buildMapSearch"],
      surface: "advisor",
    });
    expect(score.highIntent).toBe(true);
    expect(score.score).toBeGreaterThan(40);
  });

  it("scores high intent for project enquiry tool", () => {
    const messages: UIMessage[] = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "Book site visit Saturday, budget 1.2 crore" }] },
    ];
    const score = scoreAgentConversation({
      messages,
      toolsUsed: ["submitProjectEnquiry", "listProjectUnits"],
      surface: "project",
    });
    expect(score.highIntent).toBe(true);
    expect(score.interest).toContain("site visit");
  });

  it("scores high intent for captureConversationLead", () => {
    const messages: UIMessage[] = [
      {
        id: "u1",
        role: "user",
        parts: [{ type: "text", text: "Rahul, 9876543210, rahul@gmail.com" }],
      },
    ];
    const score = scoreAgentConversation({
      messages,
      toolsUsed: ["captureConversationLead", "searchTricityProjects"],
      surface: "project",
    });
    expect(score.highIntent).toBe(true);
    expect(score.signals).toContain("email_shared");
  });

  it("serializes transcript", () => {
    const messages: UIMessage[] = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "Hello" }] },
      { id: "a1", role: "assistant", parts: [{ type: "text", text: "Hi there" }] },
    ];
    expect(serializeAgentTranscript(messages)).toContain("USER: Hello");
    expect(serializeAgentTranscript(messages)).toContain("ASSISTANT: Hi there");
  });
});
