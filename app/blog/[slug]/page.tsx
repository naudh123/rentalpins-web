import { getPostBySlug, getStaticBlogSlugs } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog-types";
import { resolveMetaDescription, resolveMetaTitle } from "@/lib/blog-validation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import { JsonLdBlogPosting } from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import type { Metadata } from "next";
import { appPath, siteUrl } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";
import BlogPostAuthorActions from "@/components/blog/BlogPostAuthorActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getStaticBlogSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = true;
export const revalidate = 300;

function postSeoTitle(post: BlogPost): string {
  return resolveMetaTitle(post.title, post.metaTitle ?? "");
}

function postSeoDescription(post: BlogPost): string {
  return resolveMetaDescription(post.excerpt, post.metaDescription ?? "");
}

function postOgImage(post: BlogPost): string {
  const image = post.coverImage || "/og-image.png";
  return image.startsWith("http") ? image : `${siteUrl}${appPath(image.startsWith("/") ? image : `/${image}`)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const postUrl = canonicalUrl(`/blog/${post.slug}`);
  const seoTitle = postSeoTitle(post);
  const seoDescription = postSeoDescription(post);
  const ogImage = postOgImage(post);

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
      authors: [post.author ?? "RentalPins"],
      section: post.category,
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const postUrl = canonicalUrl(`/blog/${post.slug}`);
  const seoDescription = postSeoDescription(post);
  const authorName = post.author ?? "RentalPins";

  return (
    <MarketingShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Blog", url: canonicalUrl("/blog") },
          { name: post.title, url: postUrl },
        ]}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: authorName,
          worksFor: { "@type": "Organization", name: "RentalPins" },
        }}
      />
      <JsonLdBlogPosting
        post={{
          title: postSeoTitle(post),
          description: seoDescription,
          url: postUrl,
          datePublished: post.date,
          dateModified: post.updatedAt,
          authorName: post.author ?? "RentalPins",
          image: post.coverImage,
          tags: post.tags,
          articleSection: post.category,
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
        {post.tags?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        {post.coverImage ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        ) : null}
        <div className="prose prose-lg prose-slate mt-10 max-w-none prose-headings:font-serif prose-headings:text-[#1E3A6E] prose-a:text-[#E8501A] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <MDXRemote source={post.content} />
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <p>
            Written by{" "}
            <span className="font-medium text-slate-800">{post.author}</span>
          </p>
          <BlogPostAuthorActions slug={post.slug} authorId={post.authorId} />
        </div>
      </article>
    </MarketingShell>
  );
}
