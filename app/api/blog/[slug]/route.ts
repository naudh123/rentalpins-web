import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  getUserRole,
  isAdminRole,
  verifyAuthToken,
} from "@/lib/firebase-auth-server";
import { isMdxSlugTaken } from "@/lib/blog";
import {
  getFirestorePostBySlug,
  getFirestorePostDocId,
  slugExists,
} from "@/lib/blog-firestore";
import {
  blogReadTimeLabel,
  normalizeBlogPostBody,
} from "@/lib/blog-validation";

const COLLECTION = "blog_posts";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

async function authorizePostAccess(slug: string, uid: string) {
  const existing = await getFirestorePostBySlug(slug);
  if (!existing?.authorId) {
    return { error: "Post not found.", status: 404 as const, existing: null };
  }
  const role = await getUserRole(uid);
  if (existing.authorId !== uid && !isAdminRole(role)) {
    return { error: "Forbidden.", status: 403 as const, existing: null };
  }
  return { existing, error: null, status: null };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const access = await authorizePostAccess(slug, decoded.uid);
  if (!access.existing) {
    return NextResponse.json({ error: access.error }, { status: access.status ?? 404 });
  }

  const post = access.existing;
  return NextResponse.json({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    vertical: post.vertical,
    category: post.category,
    coverImage: post.coverImage ?? "",
    tags: post.tags ?? [],
    faqs: post.faqs ?? [],
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    published: post.published !== false,
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const access = await authorizePostAccess(slug, decoded.uid);
  if (!access.existing) {
    return NextResponse.json({ error: access.error }, { status: access.status ?? 404 });
  }
  const existing = access.existing;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const merged = {
    title: typeof body.title === "string" ? body.title : existing.title,
    excerpt: typeof body.excerpt === "string" ? body.excerpt : existing.excerpt,
    content: typeof body.content === "string" ? body.content : existing.content,
    vertical: body.vertical ?? existing.vertical ?? "rent",
    category: typeof body.category === "string" ? body.category : existing.category,
    coverImage:
      typeof body.coverImage === "string" ? body.coverImage : existing.coverImage ?? "",
    slug: typeof body.slug === "string" ? body.slug : existing.slug,
    tags: body.tags ?? existing.tags ?? [],
    faqs: body.faqs ?? existing.faqs ?? [],
    metaTitle: typeof body.metaTitle === "string" ? body.metaTitle : existing.metaTitle ?? "",
    metaDescription:
      typeof body.metaDescription === "string"
        ? body.metaDescription
        : existing.metaDescription ?? "",
    published:
      typeof body.published === "boolean" ? body.published : existing.published !== false,
  };

  const validated = normalizeBlogPostBody(merged);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.errors[0] }, { status: 400 });
  }

  const data = validated.data;
  if (data.slug !== existing.slug) {
    const docId = await getFirestorePostDocId(existing.slug);
    if (await slugExists(data.slug, docId ?? undefined)) {
      return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
    }
    if (isMdxSlugTaken(data.slug)) {
      return NextResponse.json({ error: "Slug already taken." }, { status: 409 });
    }
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
    published: data.published,
    readTime: blogReadTimeLabel(data.content),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, slug: data.slug, published: data.published });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const decoded = await verifyAuthToken(_request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const access = await authorizePostAccess(slug, decoded.uid);
  if (!access.existing) {
    return NextResponse.json({ error: access.error }, { status: access.status ?? 404 });
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
