import { describe, expect, it } from "vitest";
import { getCitySeoConfig, listCitySeoConfigKeys } from "@/lib/seo/city-seo-config";

describe("getCitySeoConfig", () => {
  it("returns priority city configs", () => {
    expect(getCitySeoConfig("in", "chandigarh")?.placeName).toBe("Chandigarh Tricity");
    expect(getCitySeoConfig("in", "ludhiana")?.placeName).toBe("Ludhiana");
    expect(getCitySeoConfig("in", "delhi")?.placeName).toBe("Delhi NCR");
  });

  it("returns priority area configs under parent city", () => {
    expect(getCitySeoConfig("in", "chandigarh", "mohali")?.placeName).toBe("Mohali");
    expect(getCitySeoConfig("in", "chandigarh", "kharar")?.placeName).toBe("Kharar");
  });

  it("returns null for markets without structured config", () => {
    expect(getCitySeoConfig("in", "jaipur")).toBeNull();
    expect(getCitySeoConfig("in", "chandigarh", "panchkula")).toBeNull();
  });

  it("lists five priority money-page keys", () => {
    expect(listCitySeoConfigKeys()).toEqual([
      "in/chandigarh",
      "in/chandigarh/mohali",
      "in/chandigarh/kharar",
      "in/ludhiana",
      "in/delhi",
    ]);
  });
});
