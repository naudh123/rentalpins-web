import { FieldValue } from "firebase-admin/firestore";
import { getAllPosts, getAllMdxPostsFull } from "@/lib/blog";
import { adminDb } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/blog-types";
import { embedTexts } from "./embeddings";
import { chunkMarkdown } from "./rag-chunker";

const COLLECTION = "agent_knowledge_chunks";
const WRITE_BATCH_SIZE = 12;
const EMBED_BATCH_SIZE = 24;

async function commitChunkBatch(
  chunkMeta: Omit<KnowledgeChunkDocument, "embedding">[],
  embeddings: number[][]
): Promise<void> {
  const col = adminDb.collection(COLLECTION);
  const batch = adminDb.batch();

  for (let i = 0; i < chunkMeta.length; i++) {
    const meta = chunkMeta[i];
    batch.set(col.doc(meta.id), {
      ...meta,
      embedding: embeddings[i],
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
}

export interface KnowledgeChunkDocument {
  id: string;
  sourceType: "blog";
  sourceId: string;
  chunkIndex: number;
  title: string;
  content: string;
  url: string;
  vertical: string;
  embedding: number[];
}

function chunkDocId(sourceId: string, chunkIndex: number): string {
  return `blog_${sourceId}_${chunkIndex}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
}

function postToChunks(post: BlogPost): Omit<KnowledgeChunkDocument, "embedding">[] {
  const body = [post.excerpt, post.content].filter(Boolean).join("\n\n");
  const pieces = chunkMarkdown(body);
  const url = `/blog/${post.slug}`;

  return pieces.map((content, chunkIndex) => ({
    id: chunkDocId(post.slug, chunkIndex),
    sourceType: "blog" as const,
    sourceId: post.slug,
    chunkIndex,
    title: post.title,
    content: `${post.title}\n\n${content}`.trim(),
    url,
    vertical: post.vertical,
  }));
}

export async function loadAllBlogPostsForIndex(): Promise<BlogPost[]> {
  const mdx = getAllMdxPostsFull();
  const mdxSlugs = new Set(mdx.map((p) => p.slug));
  const merged = await getAllPosts();
  const firestoreOnly = merged.filter((s) => !mdxSlugs.has(s.slug));
  const firestoreFull = await Promise.all(
    firestoreOnly.map(async (s) => {
      const { getPostBySlug } = await import("@/lib/blog");
      return getPostBySlug(s.slug);
    })
  );
  return [...mdx, ...firestoreFull.filter((p): p is BlogPost => p != null && Boolean(p.content?.trim()))];
}

export async function indexBlogKnowledge(): Promise<{
  success: boolean;
  indexed: number;
  posts: number;
  error?: string;
}> {
  try {
    const posts = await loadAllBlogPostsForIndex();
    const chunkMeta = posts.flatMap((post) => postToChunks(post));

    if (chunkMeta.length === 0) {
      return { success: true, indexed: 0, posts: 0 };
    }

    const embeddings: number[][] = [];
    for (let i = 0; i < chunkMeta.length; i += EMBED_BATCH_SIZE) {
      const slice = chunkMeta.slice(i, i + EMBED_BATCH_SIZE);
      const vectors = await embedTexts(slice.map((c) => c.content));
      embeddings.push(...vectors);
    }

    for (let i = 0; i < chunkMeta.length; i += WRITE_BATCH_SIZE) {
      const metaSlice = chunkMeta.slice(i, i + WRITE_BATCH_SIZE);
      const embedSlice = embeddings.slice(i, i + WRITE_BATCH_SIZE);
      await commitChunkBatch(metaSlice, embedSlice);
    }

    return { success: true, indexed: chunkMeta.length, posts: posts.length };
  } catch (err) {
    console.error("[agent/rag-index]", err);
    return {
      success: false,
      indexed: 0,
      posts: 0,
      error: err instanceof Error ? err.message : "Index failed",
    };
  }
}

export async function getKnowledgeChunkCount(): Promise<number> {
  const snap = await adminDb.collection(COLLECTION).count().get();
  return snap.data().count;
}
