import { describe, expect, it } from "vitest";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import {
  matchInvestmentsByCriteria,
  searchTricityInvestments,
} from "@/lib/agent/tricity-investment-knowledge";

describe("tricity-investment-knowledge", () => {
  it("finds professional yield playbooks", () => {
    const hits = searchTricityInvestments("rental yield aerocity mohali");
    expect(hits.some((p) => p.id === "mohali-professional-yield")).toBe(true);
  });

  it("finds budget under 40 lakh strategies", () => {
    const hits = searchTricityInvestments("best investment under 40 lakh");
    expect(hits.some((p) => p.id === "budget-invest-under-40L")).toBe(true);
  });

  it("finds student and jhanjeri investment angles", () => {
    expect(searchTricityInvestments("student pg kharar").some((p) => p.strategy === "student-yield")).toBe(
      true
    );
    expect(searchTricityInvestments("jhanjeri invest").some((p) => p.id === "jhanjeri-student-emerging")).toBe(
      true
    );
  });

  it("matches by budget criteria", () => {
    const mid = matchInvestmentsByCriteria({ budgetLakh: 60 });
    expect(mid.some((p) => p.id === "mid-invest-40-90L" || p.id === "zirakpur-commuter-yield")).toBe(true);
  });

  it("includes risks and due diligence on every playbook", () => {
    for (const p of searchTricityInvestments("tricity invest", 12)) {
      expect(p.risks.length).toBeGreaterThan(0);
      expect(p.dueDiligence.length).toBeGreaterThan(0);
      expect(p.mapSearchTip).toContain("map");
    }
  });
});

describe("agent system prompt investment training", () => {
  it("includes searchTricityInvestments and investment framework", () => {
    const prompt = buildAgentSystemPrompt({ surface: "advisor" });
    expect(prompt).toContain("searchTricityInvestments");
    expect(prompt).toContain("yield vs appreciation");
    expect(prompt.toLowerCase()).toContain("never invent roi");
  });
});
