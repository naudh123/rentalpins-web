import { getAllPosts, getPostBySlug, getStaticBlogSlugs } from "@/lib/blog";
import { pickRelatedPosts } from "@/lib/blog-related";
import type { BlogPost } from "@/lib/blog-types";
import { resolveMetaDescription, resolveMetaTitle } from "@/lib/blog-validation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import { JsonLdBlogPosting } from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import FAQSchema from "@/components/seo/FAQSchema";
import BlogAuthorBox from "@/components/blog/BlogAuthorBox";
import BlogFaqSection from "@/components/blog/BlogFaqSection";
import BlogRelatedListings from "@/components/blog/BlogRelatedListings";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import BlogRentalHubLink from "@/components/blog/BlogRentalHubLink";
import BlogPostAuthorActions from "@/components/blog/BlogPostAuthorActions";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import { createBlogMdxComponents } from "@/components/blog/blog-mdx-components";
import { extractBlogToc } from "@/lib/blog-toc";
import {
  fetchBlogRelatedListings,
  resolveBlogListingHub,
} from "@/lib/blog-related-listings";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import {
  getBrowseHref,
  getListPropertyHref,
  slugsFromRentalHubHref,
} from "@/lib/seo-links";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const postUrl = canonicalUrl(`/blog/${post.slug}`);
  const seoTitle = postSeoTitle(post);
  const seoDescription = postSeoDescription(post);

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
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const relatedPosts = pickRelatedPosts(post, allPosts, 3);
  const relatedListings = await fetchBlogRelatedListings(post.tags, 6);
  const rentalHub = resolveBlogListingHub(post.tags);

  const postUrl = canonicalUrl(`/blog/${post.slug}`);
  const seoDescription = postSeoDescription(post);
  const authorName = post.author ?? "RentalPins";
  const toc = extractBlogToc(post.content);
  const mdxComponents = createBlogMdxComponents(toc);
  const hubSlugs = rentalHub ? slugsFromRentalHubHref(rentalHub.hubHref) : {};
  const blogCityName = rentalHub?.areaConfig.city ?? rentalHub?.placeName;
  const blogAreaName =
    rentalHub && hubSlugs.areaSlug ? rentalHub.placeName : undefined;
  const blogBrowseHref = rentalHub
    ? getBrowseHref({
        citySlug: hubSlugs.citySlug,
        areaSlug: hubSlugs.areaSlug,
        lat: rentalHub.areaConfig.center.lat,
        lng: rentalHub.areaConfig.center.lng,
        placeQuery: rentalHub.placeName,
      })
    : undefined;
  const blogListHref = getListPropertyHref({
    citySlug: hubSlugs.citySlug,
    areaSlug: hubSlugs.areaSlug,
  });

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
      {post.faqs?.length ? (
        <FAQSchema
          faqs={post.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
        />
      ) : null}
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
        {rentalHub ? <BlogRentalHubLink hub={rentalHub} /> : null}
        <ListPropertyCTA
          variant="blog"
          cityName={blogCityName}
          areaName={blogAreaName}
          browseHref={blogBrowseHref}
          listHref={blogListHref}
          citySlug={hubSlugs.citySlug}
          areaSlug={hubSlugs.areaSlug}
        />
        <BlogTableOfContents entries={toc} />
        <div className="prose prose-lg prose-slate mt-10 max-w-none prose-headings:font-serif prose-headings:text-[#1E3A6E] prose-a:text-[#E8501A] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
        {relatedListings ? (
          <BlogRelatedListings
            hub={relatedListings.hub}
            listings={relatedListings.listings}
          />
        ) : null}
        <div className="mt-14 border-t border-slate-200 pt-8">
          <div className="mb-4 flex justify-end">
            <BlogPostAuthorActions slug={post.slug} authorId={post.authorId} />
          </div>
          <BlogAuthorBox
            authorName={authorName}
            category={post.category}
            readTime={post.readTime}
          />
        </div>
        <BlogFaqSection faqs={post.faqs ?? []} />
        <ListPropertyCTA
          variant="bottom"
          cityName={blogCityName}
          areaName={blogAreaName}
          browseHref={blogBrowseHref}
          listHref={blogListHref}
          citySlug={hubSlugs.citySlug}
          areaSlug={hubSlugs.areaSlug}
        />
        <BlogRelatedPosts posts={relatedPosts} />
      </article>
      <StickySeoCTA
        browseHref={blogBrowseHref}
        listHref={blogListHref}
        citySlug={hubSlugs.citySlug}
        areaSlug={hubSlugs.areaSlug}
        placeQuery={rentalHub?.placeName}
      />
    </MarketingShell>
  );
}
