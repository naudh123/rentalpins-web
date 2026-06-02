/**
 * One-off export: `npm test -- --run lib/__tests__/export-slug-areas.test.ts`
 * Writes compact area hubs for Cloud Functions slug generation.
 */
import { describe, it } from "vitest";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ALL_AREAS } from "@/lib/area-config";

describe("export slug areas", () => {
  it("writes listing-slug-areas.json for web + functions", () => {
    const compact = ALL_AREAS.map((a) => ({
      slug: a.slug,
      name: a.name,
      center: a.center,
      radiusKm: a.radiusKm,
    }));
    const json = JSON.stringify(compact, null, 2);
    writeFileSync(resolve(__dirname, "../listing-slug-areas.json"), json);
    writeFileSync(
      resolve(__dirname, "../../../rentit_clean/functions/listing-slug-areas.json"),
      json
    );
  });
});
