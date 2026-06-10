import { describe, expect, it } from "vitest";
import {
  COMMERCIAL_LONDON_AREA_SLUGS,
  COMMERCIAL_LONDON_AREAS,
  COMMERCIAL_LONDON_HUB,
  COMMERCIAL_LONDON_OPENING_NOTICE,
  commercialLondonMapHref,
  commercialLondonPostHref,
  getCommercialLondonArea,
  getCommercialLondonSitemapPaths,
} from "@/lib/commercial-london-config";

const FAKE_COUNT_PATTERN =
  /\b\d{1,3}(,\d{3})+\+?\s*(listings|users|downloads|verified)\b/i;

describe("commercial london config", () => {
  it("defines hub plus eight GSC priority areas", () => {
    expect(COMMERCIAL_LONDON_AREA_SLUGS).toEqual([
      "hackney",
      "islington",
      "camden",
      "shoreditch",
      "southwark",
      "tower-hamlets",
      "westminster",
      "canary-wharf",
    ]);
    expect(getCommercialLondonSitemapPaths()).toHaveLength(9);
  });

  it("resolves each area slug", () => {
    for (const slug of COMMERCIAL_LONDON_AREA_SLUGS) {
      expect(getCommercialLondonArea(slug)?.slug).toBe(slug);
    }
    expect(getCommercialLondonArea("manchester")).toBeNull();
  });

  it("keeps nearby area links internal and valid", () => {
    for (const area of COMMERCIAL_LONDON_AREAS) {
      for (const nearby of area.nearbyAreas) {
        expect(COMMERCIAL_LONDON_AREA_SLUGS).toContain(nearby);
      }
      expect(area.faqs.length).toBeGreaterThanOrEqual(5);
      expect(area.propertyTypes.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("avoids fake inventory or listing count claims in copy", () => {
    const blobs = [
      COMMERCIAL_LONDON_HUB.intro,
      COMMERCIAL_LONDON_OPENING_NOTICE,
      ...COMMERCIAL_LONDON_AREAS.flatMap((a) => [a.intro, ...a.faqs.map((f) => f.a)]),
      ...COMMERCIAL_LONDON_HUB.faqs.map((f) => f.a),
    ];
    for (const text of blobs) {
      expect(text).not.toMatch(FAKE_COUNT_PATTERN);
    }
  });

  it("builds map and post CTA hrefs", () => {
    const hackney = getCommercialLondonArea("hackney")!;
    expect(commercialLondonMapHref(hackney)).toContain("/search");
    expect(commercialLondonMapHref(hackney)).toContain("Hackney");
    expect(commercialLondonPostHref()).toContain("/post");
  });
});
