import type { Metadata } from "next";
import BlogEditor from "@/components/blog/BlogEditor";
import { canonicalUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Edit blog post`,
    description: `Edit your RentalPins blog post (${slug}).`,
    alternates: { canonical: canonicalUrl(`/blog/${slug}/edit`) },
    robots: { index: false, follow: false },
  };
}

export default async function BlogEditPage({ params }: Props) {
  const { slug } = await params;
  return <BlogEditor editSlug={slug} />;
}
