import { getPostBySlug, getStaticBlogSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import { JsonLdBlogPosting } from "@/components/JsonLd";
import type { Metadata } from "next";
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
  return {
    title: `${post.title} — Blog`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [post.author ?? "RentalPins"],
      images: [{ url: post.coverImage || "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || "/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const postUrl = canonicalUrl(`/blog/${post.slug}`);

  return (
    <MarketingShell>
      <JsonLdBlogPosting
        post={{
          title: post.title,
          description: post.excerpt,
          url: postUrl,
          datePublished: post.date,
          dateModified: post.updatedAt,
          authorName: post.author ?? "RentalPins",
          image: post.coverImage,
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-[#1E3A6E]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E3A6E]">
            {post.category}
          </span>
          <span>
            {new Date(post.date).toLocaleDateString("en-IN", {
              dateStyle: "long",
            })}
          </span>
          <span className="text-slate-400">·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-[#1E3A6E] sm:text-4xl md:text-[2.75rem]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>
        <div className="prose prose-lg prose-slate mt-10 max-w-none prose-headings:font-serif prose-headings:text-[#1E3A6E] prose-a:text-[#E8501A] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <MDXRemote source={post.content} />
        </div>
        <div className="mt-14 border-t border-slate-200 pt-8 text-sm text-slate-500">
          Written by{" "}
          <span className="font-medium text-slate-800">{post.author}</span>
        </div>
      </article>
    </MarketingShell>
  );
}
