import { describe, expect, it } from "vitest";
import {
  buildMohaliCanonicalAreaMetadata,
  buildMohaliCategoryMetadata,
  isMohaliCanonicalArea,
  MOHALI_GSC_LINKS,
} from "@/lib/seo/mohali-seo-overrides";
import { getIndianRentalPageConfig } from "@/lib/rental-area-config";

describe("mohali SEO overrides", () => {
  it("detects canonical Mohali area path", () => {
    expect(isMohaliCanonicalArea("in", "chandigarh", "mohali")).toBe(true);
    expect(isMohaliCanonicalArea("in", "chandigarh", "kharar")).toBe(false);
  });

  it("builds CTR-focused canonical area metadata", () => {
    const meta = buildMohaliCanonicalAreaMetadata("/rentals/in/chandigarh/mohali");
    expect(meta.title).toMatch(/Flats for Rent in Mohali/i);
    expect(String(meta.description)).toMatch(/no broker|map/i);
  });

  it("builds Mohali flats category metadata", () => {
    const meta = buildMohaliCategoryMetadata(
      "flats",
      "/rentals/in/chandigarh/mohali/flats"
    );
    expect(meta?.title).toMatch(/Flats for Rent in Mohali/i);
    expect(String(meta?.description)).toMatch(/broker/i);
  });

  it("exposes Mohali GSC internal links including sector URLs", () => {
    const hrefs = MOHALI_GSC_LINKS.map((l) => l.href);
    expect(hrefs).toContain("/rentals/mohali");
    expect(hrefs).toContain("/rentals/mohali/sector-70");
    expect(hrefs).toContain("/rentals/in/chandigarh/mohali/flats");
  });
});

describe("Mohali GSC page copy (CTR)", () => {
  it("uses query-aligned titles on short URLs", () => {
    const hub = getIndianRentalPageConfig("mohali")!;
    expect(hub.title).toMatch(/Flats for Rent in Mohali/i);

    const s70 = getIndianRentalPageConfig("mohali", "sector-70")!;
    expect(s70.title).toMatch(/Sector 70 Mohali/i);

    const phase7 = getIndianRentalPageConfig("mohali", "phase-7")!;
    expect(phase7.title).toMatch(/Phase 7 Mohali/i);
  });
});
