import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  getUserRole,
  isAdminRole,
  verifyAuthToken,
} from "@/lib/firebase-auth-server";
import { getFirestorePostBySlug, slugExists } from "@/lib/blog-firestore";
import { estimateReadTime, slugify } from "@/lib/seo";

const COLLECTION = "blog_posts";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const existing = await getFirestorePostBySlug(slug);
  if (!existing?.authorId) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const role = await getUserRole(decoded.uid);
  if (existing.authorId !== decoded.uid && !isAdminRole(role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : existing.title;
  const excerpt =
    typeof body.excerpt === "string" ? body.excerpt.trim() : existing.excerpt;
  const content =
    typeof body.content === "string" ? body.content.trim() : existing.content;
  const category =
    typeof body.category === "string" ? body.category.trim() : existing.category;
  const coverImage =
    typeof body.coverImage === "string" ? body.coverImage.trim() : existing.coverImage ?? "";
  const published =
    typeof body.published === "boolean" ? body.published : existing.published !== false;

  const newSlug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : existing.slug;

  if (newSlug !== existing.slug && (await slugExists(newSlug))) {
    return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
  }

  const snap = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", existing.slug)
    .limit(1)
    .get();
  if (snap.empty) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await snap.docs[0].ref.update({
    slug: newSlug,
    title,
    excerpt,
    content,
    category,
    coverImage: coverImage || null,
    published,
    readTime: estimateReadTime(content),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, slug: newSlug });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const decoded = await verifyAuthToken(_request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const existing = await getFirestorePostBySlug(slug);
  if (!existing?.authorId) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const role = await getUserRole(decoded.uid);
  if (existing.authorId !== decoded.uid && !isAdminRole(role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const snap = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await snap.docs[0].ref.delete();
  return NextResponse.json({ ok: true });
}
