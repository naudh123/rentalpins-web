import { describe, expect, it } from "vitest";
import { chunkMarkdown } from "@/lib/agent/rag-chunker";
import { cosineSimilarity } from "@/lib/agent/rag";
import { formatUserContextForPrompt } from "@/lib/agent/user-context";
import { extractListingPreviewsFromParts } from "@/lib/agent/chat-ui";

describe("rag chunker", () => {
  it("splits long markdown into chunks", () => {
    const body = `## Section A\n\n${"Paragraph one. ".repeat(120)}\n\n## Section B\n\nShort tail.`;
    const chunks = chunkMarkdown(body);
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe("cosine similarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });
});

describe("user context prompt", () => {
  it("formats saved searches and prior sessions", () => {
    const text = formatUserContextForPrompt({
      userId: "uid1",
      displayName: "Asha",
      savedSearches: [
        {
          id: "s1",
          name: "Phase 7 buy",
          placeQuery: "Phase 7 Mohali",
          keywords: "3bhk",
          priceMin: null,
          priceMax: 8000000,
          bhk: "3",
          category: "Property",
        },
      ],
      priorSessions: [
        {
          sessionId: "sess1",
          surface: "advisor",
          summary: "Compared Mohali vs Zirakpur",
          mapPath: "/buy/search?q=test",
          intentScore: 45,
          updatedAtMs: Date.now(),
        },
      ],
    });
    expect(text).toContain("Asha");
    expect(text).toContain("Phase 7 buy");
    expect(text).toContain("Compared Mohali");
  });
});

describe("chat ui listing extraction", () => {
  it("extracts listings from sampleListings tool output", () => {
    const previews = extractListingPreviewsFromParts([
      {
        type: "tool-sampleListings",
        state: "output-available",
        output: {
          listings: [
            {
              id: "abc",
              title: "3 BHK Phase 7",
              price: 7500000,
              location: "Mohali",
              path: "/buy/listings/abc",
            },
          ],
        },
      },
    ]);
    expect(previews).toHaveLength(1);
    expect(previews[0]?.title).toContain("3 BHK");
  });
});
