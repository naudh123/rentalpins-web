import { describe, expect, it } from "vitest";
import {
  countCitySeoWords,
  getCitySeoConfig,
  listCitySeoConfigKeys,
} from "@/lib/seo/city-seo-config";

describe("getCitySeoConfig", () => {
  it("returns priority city configs", () => {
    expect(getCitySeoConfig("in", "chandigarh")?.placeName).toBe("Chandigarh Tricity");
    expect(getCitySeoConfig("in", "ludhiana")?.placeName).toBe("Ludhiana");
    expect(getCitySeoConfig("in", "delhi")?.placeName).toBe("Delhi NCR");
    expect(getCitySeoConfig("in", "jaipur")?.placeName).toBe("Jaipur");
  });

  it("returns priority area configs under parent city", () => {
    expect(getCitySeoConfig("in", "chandigarh", "mohali")?.placeName).toBe("Mohali");
    expect(getCitySeoConfig("in", "chandigarh", "kharar")?.placeName).toBe("Kharar");
  });

  it("returns null for markets without structured config", () => {
    expect(getCitySeoConfig("in", "lucknow")).toBeNull();
    expect(getCitySeoConfig("in", "chandigarh", "panchkula")).toBeNull();
  });

  it("lists six priority money-page keys", () => {
    expect(listCitySeoConfigKeys()).toEqual([
      "in/chandigarh",
      "in/chandigarh/mohali",
      "in/chandigarh/kharar",
      "in/ludhiana",
      "in/jaipur",
      "in/delhi",
    ]);
  });

  it("merges long-form sections and meets content depth targets", () => {
    for (const lookupKey of listCitySeoConfigKeys()) {
      const parts = lookupKey.split("/");
      const config = getCitySeoConfig(parts[0], parts[1], parts[2]);
      expect(config?.sections?.length).toBeGreaterThanOrEqual(7);
      expect(countCitySeoWords(config!)).toBeGreaterThanOrEqual(1500);
    }
  });
});
