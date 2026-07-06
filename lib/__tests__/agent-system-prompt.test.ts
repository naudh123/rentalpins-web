import { describe, expect, it } from "vitest";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import { suggestedPromptsForSurface } from "@/lib/agent/prompts";

describe("agent system prompt", () => {
  it("includes tool names for advisor mode", () => {
    const prompt = buildAgentSystemPrompt({ surface: "advisor" });
    expect(prompt).toContain("buildMapSearch");
    expect(prompt).toContain("compareAreas");
    expect(prompt).toContain("searchTricityAreas");
    expect(prompt).toContain("searchTricityInvestments");
    expect(prompt).toContain("searchTricityPlanning");
    expect(prompt).toContain("searchPropertyTransactionGuides");
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

  it("project mode includes concierge playbook and tools", () => {
    const prompt = buildAgentSystemPrompt({ surface: "project", transactionType: "sale" });
    expect(prompt).toContain("Project Concierge");
    expect(prompt).toContain("captureConversationLead");
    expect(prompt).toContain("name, phone, and email");
    expect(prompt.toLowerCase()).toContain("budget");
  });
});

describe("agent suggested prompts", () => {
  it("returns map sale prompts", () => {
    const prompts = suggestedPromptsForSurface("map", "sale");
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts.some((p) => p.toLowerCase().includes("lakh"))).toBe(true);
  });

  it("returns project microsite prompts when project name provided", () => {
    const prompts = suggestedPromptsForSurface("project", "sale", "Green Valley");
    expect(prompts.some((p) => p.includes("Green Valley"))).toBe(true);
  });

  it("returns directory prompts for project surface without name", () => {
    const prompts = suggestedPromptsForSurface("project", "sale");
    expect(prompts.some((p) => p.toLowerCase().includes("mohali"))).toBe(true);
  });
});
