import { describe, expect, it } from "vitest";
import {
  HOME_FAQS,
  HOME_FORBIDDEN_CLAIMS,
  HOME_HERO,
  HOME_INVESTMENT_INTEL,
  HOME_OWNER_VALUE,
  HOME_TRICITY_CITIES,
} from "@/lib/seo/home-page-content";

describe("home page content", () => {
  it("includes owner listing FAQs", () => {
    const questions = HOME_FAQS.map((f) => f.q.toLowerCase());
    expect(questions.some((q) => q.includes("list"))).toBe(true);
    expect(questions.some((q) => q.includes("who can list"))).toBe(true);
  });

  it("avoids fake social proof claims", () => {
    const blobs = [
      HOME_HERO.subhead,
      HOME_HERO.headline,
      ...HOME_OWNER_VALUE.benefits.flatMap((b) => [b.title, b.desc]),
      ...HOME_FAQS.flatMap((f) => [f.q, f.a]),
    ];
    for (const text of blobs) {
      expect(text).not.toMatch(HOME_FORBIDDEN_CLAIMS);
    }
  });

  it("mentions free listing for owners", () => {
    expect(HOME_OWNER_VALUE.benefits.some((b) => /free/i.test(b.title))).toBe(true);
  });

  it("uses real invest URLs in tricity and intel sections", () => {
    const investHrefs = HOME_TRICITY_CITIES.flatMap((c) =>
      c.lanes.invest.map((l) => l.href)
    );
    expect(investHrefs.every((h) => !h.endsWith("/invest") || h === "/invest")).toBe(
      true
    );
    expect(
      HOME_INVESTMENT_INTEL.areas.some((a) =>
        a.href.includes("investment-guide")
      )
    ).toBe(true);
    expect(HOME_INVESTMENT_INTEL.advisorCta.href).toBe("/invest/advisor");
    expect(HOME_INVESTMENT_INTEL.projectsCta.href).toBe("/invest/projects");
  });
});
