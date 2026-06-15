import { describe, expect, it } from "vitest";
import { normalizeListingRequestUrl } from "@/lib/listing-url-normalize";

function mockRequest(pathname: string, search = "") {
  const url = new URL(`https://www.rentalpins.com${pathname}${search}`);
  return {
    nextUrl: url,
  } as import("next/server").NextRequest;
}

describe("normalizeListingRequestUrl", () => {
  it("strips trailing slash on listing paths", () => {
    const result = normalizeListingRequestUrl(
      mockRequest("/listings/foo-bar-id1234567890123/")
    );
    expect(result?.pathname).toBe("/listings/foo-bar-id1234567890123");
  });

  it("strips utm params from listing paths", () => {
    const result = normalizeListingRequestUrl(
      mockRequest(
        "/listings/foo-bar-id1234567890123",
        "?utm_source=google&from=%2Fsearch"
      )
    );
    expect(result?.search).toBe("?from=%2Fsearch");
  });

  it("ignores non-listing paths without trailing slash", () => {
    const result = normalizeListingRequestUrl(mockRequest("/search?utm_source=x"));
    expect(result).toBeNull();
  });
});
