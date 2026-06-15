import { describe, expect, it } from "vitest";
import {
  buildAllNewChandigarhSectorPages,
  NEW_CHANDIGARH_BUY_SECTOR_KEYS,
  NEW_CHANDIGARH_SECTOR_NUMBERS,
  newChandigarhSectorSlug,
} from "@/lib/sale/new-chandigarh-buy-sectors";
import { getBuyPageConfig } from "@/lib/sale/buy-pages-config";

describe("new-chandigarh-buy-sectors", () => {
  it("covers GMADA sectors 105–120", () => {
    expect(NEW_CHANDIGARH_SECTOR_NUMBERS).toHaveLength(16);
    expect(NEW_CHANDIGARH_SECTOR_NUMBERS[0]).toBe(105);
    expect(NEW_CHANDIGARH_SECTOR_NUMBERS.at(-1)).toBe(120);
    expect(NEW_CHANDIGARH_BUY_SECTOR_KEYS).toHaveLength(16);
    expect(newChandigarhSectorSlug(117)).toBe("new-chandigarh-sector-117");
  });

  it("generates buy page configs for every Mullanpur sector", () => {
    const pages = buildAllNewChandigarhSectorPages();
    expect(Object.keys(pages)).toHaveLength(16);
    expect(getBuyPageConfig("mohali", "new-chandigarh-sector-115")?.headline).toContain(
      "Sector 115"
    );
    expect(getBuyPageConfig("mohali", "new-chandigarh-sector-120")?.placeQuery).toContain(
      "Mullanpur"
    );
  });
});
