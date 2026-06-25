import { getPostBySlug, getStaticBlogSlugs } from "@/lib/blog";
import BlogPostArticle, {
  postSeoDescription,
  postSeoTitle,
} from "@/components/blog/BlogPostArticle";
import MarketingShell from "@/components/MarketingShell";
import SaleShell from "@/components/sale/SaleShell";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveBlogAuthorName } from "@/lib/seo/blog-author";
import { resolveBlogImageAbsolute } from "@/lib/blog-image";
import { appPath, siteUrl } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getStaticBlogSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const postUrl = canonicalUrl(`/blog/${post.slug}`);
  const seoTitle = postSeoTitle(post);
  const seoDescription = postSeoDescription(post);
  const authorName = resolveBlogAuthorName(post.author);
  const coverImage = resolveBlogImageAbsolute(post.coverImage, siteUrl, appPath);

  return {
    title: `${seoTitle} — Blog`,
    description: seoDescription,
    keywords: post.tags?.length ? post.tags : undefined,
    alternates: {
      canonical: postUrl,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [authorName],
      section: post.category,
      tags: post.tags,
      images: [{ url: coverImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const postUrl = canonicalUrl(`/blog/${post.slug}`);
  const article = <BlogPostArticle post={post} postUrl={postUrl} />;

  if (post.vertical === "buy") {
    return <SaleShell>{article}</SaleShell>;
  }

  return <MarketingShell>{article}</MarketingShell>;
}
