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

/** Turn API / transport errors into user-facing copy (never raw JSON). */
export function formatAgentChatError(message: string | undefined): string {
  const raw = (message ?? "").trim();
  if (!raw) {
    return "Something went wrong. Please try again in a moment.";
  }

  try {
    const parsed = JSON.parse(raw) as { error?: string };
    if (typeof parsed.error === "string" && parsed.error.trim()) {
      return formatAgentChatError(parsed.error);
    }
  } catch {
    // not JSON — use raw text below
  }

  if (/OPENAI_API_KEY|not configured|503/i.test(raw)) {
    return "AI concierge is not available yet — OPENAI_API_KEY must be set on the server. Add it to .env.local (local) or Vercel env (production), then restart the dev server.";
  }

  return raw;
}
