import { describe, expect, it } from "vitest";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms-txt";

describe("llms txt", () => {
  it("includes canonical host and listing sitemap in llms.txt", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("https://www.rentalpins.com");
    expect(txt).toContain("https://www.rentalpins.com/sitemap-listings.xml");
    expect(txt).toContain("Preferred detail URL");
  });

  it("includes extended retrieval guidance in llms-full.txt", () => {
    const txt = buildLlmsFullTxt();
    expect(txt).toContain("RentalPins LLM Guide (Extended)");
    expect(txt).toContain("URL hierarchy");
    expect(txt).toContain("Live city hubs");
    expect(txt).toContain("Usage guidance");
  });
});
