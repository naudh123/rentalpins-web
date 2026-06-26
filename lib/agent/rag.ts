import { adminDb } from "@/lib/firebase-admin";
import { searchBlogInsights, searchRentBlogInsights } from "./knowledge";
import { embedText, isEmbeddingConfigured } from "./embeddings";
import { getKnowledgeChunkCount } from "./rag-index";

const COLLECTION = "agent_knowledge_chunks";
const MATCH_THRESHOLD = 0.42;
const MAX_CHUNKS_LOAD = 400;

export interface KnowledgeSearchResult {
  title: string;
  slug: string;
  excerpt: string;
  url: string;
  vertical: string;
  similarity?: number;
  sourceType: string;
}

interface StoredChunk {
  sourceType: string;
  sourceId: string;
  title: string;
  content: string;
  url: string;
  vertical: string;
  embedding: number[];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom > 0 ? dot / denom : 0;
}

async function loadChunks(): Promise<StoredChunk[]> {
  const snap = await adminDb.collection(COLLECTION).limit(MAX_CHUNKS_LOAD).get();
  return snap.docs
    .map((doc) => doc.data() as StoredChunk)
    .filter((row) => Array.isArray(row.embedding) && row.embedding.length > 0);
}

export async function searchKnowledgeVector(
  query: string,
  limit = 5
): Promise<KnowledgeSearchResult[]> {
  if (!isEmbeddingConfigured) return [];

  const chunks = await loadChunks();
  if (chunks.length === 0) return [];

  const queryEmbedding = await embedText(query);

  const scored = chunks
    .map((chunk) => ({
      chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((s) => s.similarity >= MATCH_THRESHOLD)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return scored.map(({ chunk, similarity }) => ({
    title: chunk.title,
    slug: chunk.sourceId,
    excerpt:
      chunk.content.slice(0, 320) + (chunk.content.length > 320 ? "…" : ""),
    url: chunk.url,
    vertical: chunk.vertical,
    similarity: Math.round(similarity * 1000) / 1000,
    sourceType: chunk.sourceType,
  }));
}

function keywordFallback(query: string, limit: number): KnowledgeSearchResult[] {
  const buy = searchBlogInsights(query, limit).map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    url: p.path,
    vertical: "buy",
    sourceType: "blog-keyword",
  }));
  const rent = searchRentBlogInsights(query, Math.max(1, limit - buy.length)).map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    url: p.path,
    vertical: "rent",
    sourceType: "blog-keyword",
  }));
  return [...buy, ...rent].slice(0, limit);
}

/** Hybrid: vector over full MDX chunks, then keyword excerpt fallback. */
export async function searchKnowledge(
  query: string,
  limit = 5
): Promise<{ results: KnowledgeSearchResult[]; mode: "vector" | "keyword" | "hybrid" }> {
  const vector = await searchKnowledgeVector(query, limit);

  if (vector.length >= limit) {
    return { results: vector, mode: "vector" };
  }

  const keyword = keywordFallback(query, limit);
  if (vector.length === 0) {
    return { results: keyword, mode: "keyword" };
  }

  const seen = new Set(vector.map((r) => r.slug));
  const merged = [
    ...vector,
    ...keyword.filter((k) => !seen.has(k.slug)),
  ].slice(0, limit);

  return { results: merged, mode: "hybrid" };
}

export async function isRagAvailable(): Promise<boolean> {
  if (!isEmbeddingConfigured) return false;
  try {
    const count = await getKnowledgeChunkCount();
    return count > 0;
  } catch {
    return false;
  }
}
