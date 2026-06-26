import { describe, expect, it } from "vitest";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import { suggestedPromptsForSurface } from "@/lib/agent/prompts";

describe("agent system prompt", () => {
  it("includes tool names for advisor mode", () => {
    const prompt = buildAgentSystemPrompt({ surface: "advisor" });
    expect(prompt).toContain("buildMapSearch");
    expect(prompt).toContain("compareAreas");
    expect(prompt).toContain("searchFaqs");
    expect(prompt).toContain("scheduleContact");
    expect(prompt).toContain("/buy/requirements/post");
  });

  it("map mode uses transaction type", () => {
    const prompt = buildAgentSystemPrompt({ surface: "map", transactionType: "sale" });
    expect(prompt).toContain("buy map");
    expect(prompt).toContain("sale");
  });

  it("showcase mode mentions white-label", () => {
    const prompt = buildAgentSystemPrompt({ surface: "showcase" });
    expect(prompt.toLowerCase()).toContain("white-label");
  });
});

describe("agent suggested prompts", () => {
  it("returns map sale prompts", () => {
    const prompts = suggestedPromptsForSurface("map", "sale");
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts.some((p) => p.toLowerCase().includes("lakh"))).toBe(true);
  });
});
