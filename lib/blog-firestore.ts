import { adminDb } from "./firebase-admin";
import { parseBlogTags, parseBlogFaqs } from "./blog-validation";
import { estimateReadTime } from "./seo";
import type { BlogPost, BlogPostSummary } from "./blog-types";

const COLLECTION = "blog_posts";

function toIso(value: unknown, fallback = ""): string {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return fallback;
}

function mapDoc(id: string, data: Record<string, unknown>): BlogPost {
  const created = toIso(data.createdAt, (data.date as string) ?? "");
  const updated = toIso(data.updatedAt, created);
  const content = (data.content as string) || "";
  return {
    slug: (data.slug as string) || id,
    title: (data.title as string) || "",
    date: created.slice(0, 10),
    excerpt: (data.excerpt as string) || "",
    category: (data.category as string) || "General",
    coverImage: (data.coverImage as string) || undefined,
    author: (data.authorName as string) || "RentalPins User",
    readTime: (data.readTime as string) || estimateReadTime(content),
    content,
    source: "firestore",
    authorId: data.authorId as string | undefined,
    published: data.published !== false,
    updatedAt: updated,
    tags: parseBlogTags(data.tags),
    metaTitle: (data.metaTitle as string) || undefined,
    metaDescription: (data.metaDescription as string) || undefined,
    faqs: parseBlogFaqs(data.faqs),
  };
}

export async function getFirestorePosts(options?: {
  publishedOnly?: boolean;
}): Promise<BlogPostSummary[]> {
  try {
    const base = adminDb.collection(COLLECTION);
    const snap =
      options?.publishedOnly !== false
        ? await base.where("published", "==", true).get()
        : await base.get();
    return snap.docs
      .map((doc) => {
        const post = mapDoc(doc.id, doc.data());
        const { content: _c, ...summary } = post;
        return summary;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error("getFirestorePosts:", err);
    return [];
  }
}

export async function getFirestorePostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const bySlug = await adminDb
      .collection(COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!bySlug.empty) {
      const doc = bySlug.docs[0];
      return mapDoc(doc.id, doc.data());
    }
    const byId = await adminDb.collection(COLLECTION).doc(slug).get();
    if (byId.exists) {
      return mapDoc(byId.id, byId.data()!);
    }
    return null;
  } catch (err) {
    console.error("getFirestorePostBySlug:", err);
    return null;
  }
}

export async function getFirestorePostDocId(slug: string): Promise<string | null> {
  const snap = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return snap.docs[0].id;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const snap = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return false;
  if (excludeId && snap.docs[0].id === excludeId) return false;
  return true;
}
