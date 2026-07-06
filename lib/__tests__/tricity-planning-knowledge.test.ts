import { describe, expect, it } from "vitest";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import {
  getTricityPlanningTopic,
  searchTricityPlanning,
} from "@/lib/agent/tricity-planning-knowledge";

describe("tricity-planning-knowledge", () => {
  it("finds PSIEC and industrial topics", () => {
    expect(searchTricityPlanning("PSIEC Rajpura").some((t) => t.id === "psiec-industrial-estates")).toBe(
      true
    );
    expect(searchTricityPlanning("industrial warehouse Banur").length).toBeGreaterThan(0);
  });

  it("distinguishes IT Park vs IT City", () => {
    const itPark = searchTricityPlanning("mohali IT Park STPI");
    const itCity = searchTricityPlanning("IT City sector 82");
    expect(itPark.some((t) => t.id === "mohali-it-park-legacy")).toBe(true);
    expect(itCity.some((t) => t.id === "it-city-mohali-jlpl")).toBe(true);
  });

  it("covers master plan and MC limits", () => {
    expect(searchTricityPlanning("GMADA master plan").some((t) => t.id === "gmada-master-plan")).toBe(
      true
    );
    expect(searchTricityPlanning("MC limits municipal").some((t) => t.id === "mc-limits-overview")).toBe(
      true
    );
  });

  it("covers mixed use and residential", () => {
    expect(searchTricityPlanning("mixed use SCO").some((t) => t.category === "mixed-use")).toBe(true);
    expect(searchTricityPlanning("residential phase mohali").some((t) => t.category === "residential")).toBe(
      true
    );
  });

  it("includes verify checklists on topics", () => {
    const psiec = getTricityPlanningTopic("psiec-industrial-estates");
    expect(psiec?.verifyChecklist.length).toBeGreaterThan(0);
    expect(psiec?.keyDistinctions.some((d) => d.includes("Focal Point"))).toBe(true);
  });
});

describe("agent system prompt planning training", () => {
  it("includes searchTricityPlanning and PSIEC", () => {
    const prompt = buildAgentSystemPrompt({ surface: "advisor" });
    expect(prompt).toContain("searchTricityPlanning");
    expect(prompt).toContain("PSIEC");
    expect(prompt).toContain("IT Park vs IT City");
  });
});
