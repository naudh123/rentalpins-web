import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/firebase-auth-server";
import { getMdxPosts } from "@/lib/blog";
import { slugExists } from "@/lib/blog-firestore";
import { estimateReadTime, slugify } from "@/lib/seo";

const COLLECTION = "blog_posts";

function validateBody(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const category =
    typeof body.category === "string" && body.category.trim()
      ? body.category.trim()
      : "General";
  const coverImage =
    typeof body.coverImage === "string" && body.coverImage.trim()
      ? body.coverImage.trim()
      : "";
  const published = body.published === true;

  if (title.length < 5 || title.length > 120) {
    return { error: "Title must be 5–120 characters." };
  }
  if (excerpt.length < 20 || excerpt.length > 300) {
    return { error: "Excerpt must be 20–300 characters." };
  }
  if (content.length < 100) {
    return { error: "Content must be at least 100 characters." };
  }
  return { title, excerpt, content, category, coverImage, published };
}

export async function POST(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const validated = validateBody(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { title, excerpt, content, category, coverImage, published } = validated;
  const requestedSlug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(title);
  if (!requestedSlug) {
    return NextResponse.json({ error: "Could not generate slug." }, { status: 400 });
  }

  if (await slugExists(requestedSlug)) {
    return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
  }
  if (getMdxPosts().some((p) => p.slug === requestedSlug)) {
    return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
  }

  const authorName =
    (typeof body.authorName === "string" && body.authorName.trim()) ||
    decoded.name ||
    "RentalPins User";

  const docRef = adminDb.collection(COLLECTION).doc();
  const now = FieldValue.serverTimestamp();
  await docRef.set({
    slug: requestedSlug,
    title,
    excerpt,
    content,
    category,
    coverImage: coverImage || null,
    authorId: decoded.uid,
    authorName,
    published,
    readTime: estimateReadTime(content),
    source: "web",
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true, slug: requestedSlug, id: docRef.id });
}
