import { getPostBySlug } from "@/lib/blog";
import { generateBlogOgImageResponse } from "@/lib/blog-og-card";

export const runtime = "nodejs";
export const alt = "RentalPins blog article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return generateBlogOgImageResponse(post);
}
