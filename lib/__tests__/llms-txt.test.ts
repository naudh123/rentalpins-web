import { describe, expect, it } from "vitest";
import { buildAiTxt } from "@/lib/ai-txt";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms-txt";
import { getDeveloperSitemapPaths } from "@/lib/seo/developers-config";
import { getGeoPageSitemapPaths } from "@/lib/seo/geo-pages-config";

describe("llms txt", () => {
  it("includes canonical host and listing sitemap in llms.txt", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("https://www.rentalpins.com");
    expect(txt).toContain("https://www.rentalpins.com/sitemap-listings.xml");
    expect(txt).toContain("https://www.rentalpins.com/sitemap-projects.xml");
    expect(txt).toContain("https://www.rentalpins.com/sitemap-blog.xml");
    expect(txt).toContain("https://www.rentalpins.com/buy/search");
    expect(txt).toContain("buy/listings");
    expect(txt).toContain("/projects");
    expect(txt).toContain("/builders");
    expect(txt).toContain("/developers");
    expect(txt).toContain("/invest");
    expect(txt).toContain("/invest/calculator");
    expect(txt).toContain("/invest/pulse");
    expect(txt).toContain("/blog/all");
    expect(txt).toContain("/blog/buy");
    expect(txt).toContain("property investment");
    for (const path of getGeoPageSitemapPaths()) {
      expect(txt).toContain(path);
    }
    for (const path of getDeveloperSitemapPaths()) {
      expect(txt).toContain(path);
    }
  });

  it("includes extended retrieval guidance in llms-full.txt", () => {
    const txt = buildLlmsFullTxt();
    expect(txt).toContain("RentalPins LLM Guide (Extended)");
    expect(txt).toContain("URL hierarchy");
    expect(txt).toContain("Live city hubs");
    expect(txt).toContain("Usage guidance");
    expect(txt).toContain("/invest/pulse");
  });

  it("exposes ai.txt with llms pointer", () => {
    const txt = buildAiTxt();
    expect(txt).toContain("AI Search Guide");
    expect(txt).toContain("/llms.txt");
    expect(txt).toContain("/llms-full.txt");
    expect(txt).toContain("Crawl policy");
  });
});
