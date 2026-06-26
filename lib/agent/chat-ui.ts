import type { AgentListingPreview } from "@/components/agent/AgentListingCards";

interface ToolPart {
  type: string;
  state?: string;
  output?: unknown;
}

function isListingOutput(value: unknown): value is { listings: AgentListingPreview[] } {
  if (!value || typeof value !== "object") return false;
  const listings = (value as { listings?: unknown }).listings;
  return Array.isArray(listings);
}

/** Pull listing previews from sampleListings tool output parts for generative UI cards. */
export function extractListingPreviewsFromParts(
  parts: ToolPart[]
): AgentListingPreview[] {
  const previews: AgentListingPreview[] = [];

  for (const part of parts) {
    if (part.type !== "tool-sampleListings") continue;
    if (part.state !== "output-available" && part.state !== "output-complete") continue;
    if (!isListingOutput(part.output)) continue;

    for (const listing of part.output.listings) {
      if (!listing?.id || !listing.title) continue;
      previews.push({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        location: listing.location,
        path: listing.path,
      });
    }
  }

  const seen = new Set<string>();
  return previews.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
