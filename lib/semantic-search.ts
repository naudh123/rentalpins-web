"use client";

import { semanticRankListingsCallable } from "@/lib/callable-functions";
import { CallableError } from "@/lib/firebase-callable";
import { applyTextSearchFilter } from "@/lib/listing-filters";
import type { ListingCard } from "@/lib/types/listing";

/** Default cosine similarity threshold (matches Cloud Function). */
export const SEMANTIC_MIN_SCORE = 0.2;

export interface SemanticScore {
  listingId: string;
  score: number;
}

export interface SemanticRankResult {
  scores: SemanticScore[];
  model?: string;
  threshold?: number;
}

export function semanticSearchErrorCode(err: unknown): string {
  if (err instanceof CallableError) {
    return err.code.replace(/^functions\//, "").replace(/-/g, "_") || "unknown";
  }
  if (err instanceof Error && err.name === "AbortError") return "timeout";
  return "unknown";
}

export function mapSemanticSearchError(err: unknown): string {
  if (err instanceof CallableError) {
    if (err.code === "functions/deadline-exceeded") {
      return "Semantic search took too long. Showing keyword matches instead.";
    }
    if (err.code === "functions/unavailable") {
      return "Semantic search is temporarily unavailable.";
    }
  }
  return "Semantic search failed. Showing keyword matches instead.";
}

/** Rank viewport candidate listings by embedding similarity to the query. */
export async function semanticRankListings(
  query: string,
  listingIds: string[],
  options?: { minScore?: number }
): Promise<SemanticRankResult> {
  const q = query.trim();
  if (!q || listingIds.length === 0) {
    return { scores: [] };
  }

  const data = (await semanticRankListingsCallable({
    query: q,
    listingIds,
    ...(options?.minScore != null ? { minScore: options.minScore } : {}),
  })) as {
    scores?: SemanticScore[];
    model?: string;
    threshold?: number;
  };

  const scores = Array.isArray(data.scores)
    ? data.scores.filter(
        (s) =>
          s &&
          typeof s.listingId === "string" &&
          typeof s.score === "number" &&
          Number.isFinite(s.score)
      )
    : [];

  return {
    scores,
    model: data.model,
    threshold: data.threshold,
  };
}

function listingMatchesText(listing: ListingCard, query: string): boolean {
  return applyTextSearchFilter([listing], query).length > 0;
}

/**
 * Merge semantic scores with keyword fallback for listings without embeddings.
 * Semantic matches are sorted by score; keyword-only matches follow.
 */
export function mergeSemanticSearchResults(
  listings: ListingCard[],
  scores: SemanticScore[],
  semanticQuery: string,
  keywordQuery: string,
  minScore = SEMANTIC_MIN_SCORE
): ListingCard[] {
  const q = semanticQuery.trim();
  if (!q) return listings;

  if (scores.length === 0) {
    return applyTextSearchFilter(listings, keywordQuery.trim() || q);
  }

  const scoreMap = new Map(scores.map((s) => [s.listingId, s.score]));
  const keyword = keywordQuery.trim() || q;
  const semanticMatches: ListingCard[] = [];
  const keywordOnly: ListingCard[] = [];

  for (const listing of listings) {
    const score = scoreMap.get(listing.id);
    if (score != null) {
      if (score >= minScore) semanticMatches.push(listing);
      continue;
    }
    if (listingMatchesText(listing, keyword)) {
      keywordOnly.push(listing);
    }
  }

  semanticMatches.sort(
    (a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0)
  );

  return [...semanticMatches, ...keywordOnly];
}
