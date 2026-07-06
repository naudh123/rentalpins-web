import { describe, expect, it } from "vitest";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import { searchPropertyTransactionGuides } from "@/lib/agent/tricity-transaction-knowledge";

describe("tricity-transaction-knowledge", () => {
  it("finds sale agreement and sale deed guides", () => {
    expect(
      searchPropertyTransactionGuides("how sale agreement is made").some(
        (g) => g.id === "sale-agreement-ats"
      )
    ).toBe(true);
    expect(
      searchPropertyTransactionGuides("sale deed registration stamp duty").some(
        (g) => g.id === "sale-deed-conveyance"
      )
    ).toBe(true);
  });

  it("finds ownership transfer and precautions", () => {
    expect(
      searchPropertyTransactionGuides("ownership transfer process").some(
        (g) => g.id === "ownership-transfer-overview"
      )
    ).toBe(true);
    expect(
      searchPropertyTransactionGuides("token money precautions").some(
        (g) => g.id === "token-money-precautions"
      )
    ).toBe(true);
  });

  it("includes RentalPins guidance role", () => {
    const rp = searchPropertyTransactionGuides("RentalPins guide sale deed");
    expect(rp.some((g) => g.id === "rentalpins-transaction-support")).toBe(true);
    expect(rp[0]?.rentalPinsGuidance.toLowerCase()).toContain("rentalpins");
  });

  it("default query returns overview and rentalpins guides", () => {
    const defaults = searchPropertyTransactionGuides("", 4);
    expect(defaults.some((g) => g.id === "rentalpins-transaction-support")).toBe(true);
    expect(defaults.some((g) => g.id === "ownership-transfer-overview")).toBe(true);
  });
});

describe("agent system prompt transaction training", () => {
  it("includes searchPropertyTransactionGuides and RentalPins guidance", () => {
    const prompt = buildAgentSystemPrompt({ surface: "advisor" });
    expect(prompt).toContain("searchPropertyTransactionGuides");
    expect(prompt).toContain("RentalPins guides you");
    expect(prompt).toContain("Sale Deed");
  });
});
