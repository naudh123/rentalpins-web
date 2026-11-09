import { getPostBySlug } from "@/lib/blog";
import { generateBlogCoverResponse } from "@/lib/blog-og-card";

export const runtime = "nodejs";

/** Illustrated 16:10 cover for posts without a cover photo (hero + blog cards). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return generateBlogCoverResponse(post);
}
