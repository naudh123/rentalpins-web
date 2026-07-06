import { describe, expect, it } from "vitest";
import {
  resolveFloatingAgentContext,
  shouldShowFloatingAgent,
} from "@/lib/agent/floating-agent-context";

describe("floating agent context", () => {
  it("hides on admin, auth, chat, and dedicated advisor page", () => {
    expect(shouldShowFloatingAgent("/admin/agent")).toBe(false);
    expect(shouldShowFloatingAgent("/auth/login")).toBe(false);
    expect(shouldShowFloatingAgent("/chat")).toBe(false);
    expect(shouldShowFloatingAgent("/advisor")).toBe(false);
  });

  it("shows on rent and buy map search", () => {
    expect(shouldShowFloatingAgent("/search")).toBe(true);
    expect(shouldShowFloatingAgent("/buy/search")).toBe(true);
  });

  it("shows on projects pages", () => {
    expect(shouldShowFloatingAgent("/projects")).toBe(true);
    expect(shouldShowFloatingAgent("/projects/mohali")).toBe(true);
  });

  it("resolves project microsite context from URL", () => {
    const ctx = resolveFloatingAgentContext("/projects/mohali/green-valley-residences");
    expect(ctx.surface).toBe("project");
    expect(ctx.citySlug).toBe("mohali");
    expect(ctx.projectSlug).toBe("green-valley-residences");
    expect(ctx.transactionType).toBe("sale");
  });

  it("resolves city projects index context", () => {
    const ctx = resolveFloatingAgentContext("/projects/zirakpur");
    expect(ctx.surface).toBe("project");
    expect(ctx.citySlug).toBe("zirakpur");
    expect(ctx.projectSlug).toBeUndefined();
  });

  it("resolves map copilot context for rent and buy search", () => {
    const rent = resolveFloatingAgentContext("/search");
    expect(rent.surface).toBe("map");
    expect(rent.transactionType).toBe("rent");
    expect(rent.placement).toBe("map");

    const buy = resolveFloatingAgentContext("/buy/search");
    expect(buy.surface).toBe("map");
    expect(buy.transactionType).toBe("sale");
    expect(buy.title).toBe("Ask AI");
  });
});
