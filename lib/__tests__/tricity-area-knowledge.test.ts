import { describe, expect, it } from "vitest";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import {
  getTricityArea,
  searchTricityAreas,
} from "@/lib/agent/tricity-area-knowledge";

describe("tricity-area-knowledge", () => {
  it("finds Kurali by name and alias", () => {
    const hits = searchTricityAreas("kurali bypass");
    expect(hits.some((a) => a.slug === "kurali")).toBe(true);
  });

  it("finds Banur and Chunni for outer belt queries", () => {
    expect(searchTricityAreas("banur gmada").some((a) => a.slug === "banur")).toBe(true);
    expect(searchTricityAreas("chunni kalan").some((a) => a.slug === "chunni")).toBe(true);
  });

  it("finds Jhanjeri on Landran–Chunni road", () => {
    expect(searchTricityAreas("jhanjeri").some((a) => a.slug === "jhanjeri")).toBe(true);
    expect(searchTricityAreas("landran chunni road").some((a) => a.slug === "jhanjeri")).toBe(
      true
    );
  });

  it("includes map centre and price bands on profiles", () => {
    const kurali = getTricityArea("kurali");
    expect(kurali?.mapCenter.lat).toBeGreaterThan(30);
    expect(kurali?.priceBands?.buy).toContain("₹");
    expect(kurali?.faqs.length).toBeGreaterThan(0);
  });

  it("returns outer belt defaults when query empty", () => {
    const outer = searchTricityAreas("", 3);
    expect(outer.every((a) => a.zone !== "core")).toBe(true);
  });
});

describe("agent system prompt tricity training", () => {
  it("includes searchTricityAreas and outer belt names", () => {
    const prompt = buildAgentSystemPrompt({ surface: "advisor" });
    expect(prompt).toContain("searchTricityAreas");
    expect(prompt).toContain("Kurali");
    expect(prompt).toContain("Jhanjeri");
    expect(prompt).toContain("Chunni");
    expect(prompt).toContain("Banur");
  });
});
