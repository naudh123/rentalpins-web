import { describe, expect, it } from "vitest";
import { resolveBlogListingHub } from "@/lib/blog-related-listings";

describe("resolveBlogListingHub", () => {
  it("maps a city tag to the live city hub", () => {
    const hub = resolveBlogListingHub(["Ludhiana"]);
    expect(hub).not.toBeNull();
    expect(hub?.placeName).toBe("Ludhiana");
    expect(hub?.hubHref).toBe("/rentals/in/ludhiana");
  });

  it("maps an area tag to the area hub under its parent city", () => {
    const hub = resolveBlogListingHub(["Kharar"]);
    expect(hub).not.toBeNull();
    expect(hub?.placeName).toBe("Kharar");
    expect(hub?.hubHref).toBe("/rentals/in/chandigarh/kharar");
  });

  it("returns null when no tag matches a live hub", () => {
    expect(resolveBlogListingHub(["Broker tips"])).toBeNull();
    expect(resolveBlogListingHub(undefined)).toBeNull();
  });
});
