import { describe, expect, it } from "vitest";
import {
  trackProjectContactClicked,
  trackProjectLeadStarted,
  trackProjectLeadSubmitted,
} from "@/lib/ga4";

describe("project GA4 helpers", () => {
  it("exports project lead tracking helpers", () => {
    expect(typeof trackProjectLeadStarted).toBe("function");
    expect(typeof trackProjectLeadSubmitted).toBe("function");
    expect(typeof trackProjectContactClicked).toBe("function");
  });
});
