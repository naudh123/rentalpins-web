import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/firebase-auth-server";
import { isMdxSlugTaken } from "@/lib/blog";
import { slugExists } from "@/lib/blog-firestore";
import {
  blogReadTimeLabel,
  normalizeBlogPostBody,
} from "@/lib/blog-validation";

const COLLECTION = "blog_posts";

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

  const validated = normalizeBlogPostBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.errors[0] }, { status: 400 });
  }

  const data = validated.data;
  if (await slugExists(data.slug)) {
    return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
  }
  if (isMdxSlugTaken(data.slug)) {
    return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
  }

  const authorName =
    (typeof body.authorName === "string" && body.authorName.trim()) ||
    decoded.name ||
    "RentalPins User";

  const docRef = adminDb.collection(COLLECTION).doc();
  const now = FieldValue.serverTimestamp();
  await docRef.set({
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    vertical: data.vertical,
    category: data.category,
    coverImage: data.coverImage || null,
    tags: data.tags,
    faqs: data.faqs,
    metaTitle: data.metaTitle || null,
    metaDescription: data.metaDescription || null,
    authorId: decoded.uid,
    authorName,
    published: data.published,
    readTime: blogReadTimeLabel(data.content),
    source: "web",
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({
    ok: true,
    slug: data.slug,
    id: docRef.id,
    published: data.published,
  });
}
