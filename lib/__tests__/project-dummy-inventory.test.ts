import { describe, expect, it } from "vitest";
import { buildDummyInventoryForProject } from "@/lib/builders/project-dummy-inventory";
import { resolveInventorySummary } from "@/lib/builders/builders-server";
import type { BuilderProject } from "@/lib/types/builder-microsite";

describe("project dummy inventory", () => {
  it("generates non-zero deterministic counts per slug", () => {
    const a = buildDummyInventoryForProject({ slug: "gillco-valley", projectType: "plots" });
    const b = buildDummyInventoryForProject({ slug: "gillco-valley", projectType: "plots" });
    const c = buildDummyInventoryForProject({ slug: "ansal-api-sector-115", projectType: "plots" });

    expect(a).toEqual(b);
    expect(a.totalUnits).toBeGreaterThan(0);
    expect(a.availableUnits).toBeGreaterThan(0);
    expect(a.soldUnits).toBeGreaterThan(0);
    expect(a.availableUnits + a.reservedUnits + a.soldUnits + a.comingSoonUnits).toBe(
      a.totalUnits
    );
    expect(c.totalUnits).not.toBe(a.totalUnits);
  });

  it("resolveInventorySummary uses project aggregates when no units", () => {
    const project = {
      slug: "gillco-valley",
      projectType: "plots",
      totalUnits: 200,
      availableUnits: 24,
      reservedUnits: 8,
      soldUnits: 160,
      comingSoonUnits: 8,
    } as Pick<
      BuilderProject,
      | "slug"
      | "projectType"
      | "totalUnits"
      | "availableUnits"
      | "reservedUnits"
      | "soldUnits"
      | "comingSoonUnits"
    >;

    const summary = resolveInventorySummary(project, []);
    expect(summary.total).toBe(200);
    expect(summary.available).toBe(24);
    expect(summary.comingSoon).toBe(8);
  });
});
