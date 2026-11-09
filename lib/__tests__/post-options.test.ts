import { describe, expect, it } from "vitest";
import { currentPostIntent, isPostFlowPath, POST_OPTIONS } from "@/lib/nav/post-options";

describe("post-options", () => {
  it("offers Rent, Sell and Invest in that order with the right flows", () => {
    expect(POST_OPTIONS.map((o) => [o.intent, o.href])).toEqual([
      ["rent", "/post"],
      ["sell", "/buy/post"],
      ["invest", "/projects/post"],
    ]);
  });

  it("detects posting-flow paths", () => {
    expect(isPostFlowPath("/post")).toBe(true);
    expect(isPostFlowPath("/post/activate")).toBe(true);
    expect(isPostFlowPath("/buy/post")).toBe(true);
    expect(isPostFlowPath("/projects/post")).toBe(true);
    expect(isPostFlowPath("/posts")).toBe(false);
    expect(isPostFlowPath("/buy")).toBe(false);
    expect(isPostFlowPath(null)).toBe(false);
  });

  it("maps the current path to the matching option", () => {
    expect(currentPostIntent("/post/activate")).toBe("rent");
    expect(currentPostIntent("/buy/post")).toBe("sell");
    expect(currentPostIntent("/projects/post")).toBe("invest");
    expect(currentPostIntent("/search")).toBeNull();
  });
});
