import { getAllPosts } from "@/lib/blog";
import { fetchBlogRelatedSaleListings, resolveBlogBuyHub } from "@/lib/blog-buy-hubs";
import { pickRelatedPosts } from "@/lib/blog-related";
import {
  fetchBlogRelatedListings,
  resolveBlogListingHub,
} from "@/lib/blog-related-listings";
import type { BlogPost } from "@/lib/blog-types";
import { blogIndexHref, verticalBadgeClass, verticalLabel } from "@/lib/blog-vertical";
import { resolveBlogImageUrl } from "@/lib/blog-image";
import { resolveMetaDescription, resolveMetaTitle } from "@/lib/blog-validation";
import { appPath } from "@/lib/config";
import { resolveBlogAuthorName, RENTALPINS_EDITORIAL_TEAM } from "@/lib/seo/blog-author";
import {
  getBrowseHref,
  getBuyBrowseHref,
  getListForSaleHref,
  getListPropertyHref,
  slugsFromRentalHubHref,
} from "@/lib/seo-links";
import { resolveSupplyCtaOverride } from "@/lib/supply-pages-config";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { JsonLdBlogPosting } from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import FAQSchema from "@/components/seo/FAQSchema";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import BlogAuthorBox from "@/components/blog/BlogAuthorBox";
import BlogBuyHubLink from "@/components/blog/BlogBuyHubLink";
import BlogFaqSection from "@/components/blog/BlogFaqSection";
import BlogNeutralCTA from "@/components/blog/BlogNeutralCTA";
import BlogPostAuthorActions from "@/components/blog/BlogPostAuthorActions";
import BlogRelatedListings from "@/components/blog/BlogRelatedListings";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import BlogRentalHubLink from "@/components/blog/BlogRentalHubLink";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import { createBlogMdxComponents } from "@/components/blog/blog-mdx-components";
import { extractBlogToc } from "@/lib/blog-toc";
import { canonicalUrl } from "@/lib/seo";
import { resolveBlogImageAbsolute } from "@/lib/blog-image";
import { siteUrl } from "@/lib/config";

export function postSeoTitle(post: BlogPost): string {
  return resolveMetaTitle(post.title, post.metaTitle ?? "");
}

export function postSeoDescription(post: BlogPost): string {
  return resolveMetaDescription(post.excerpt, post.metaDescription ?? "");
}

interface Props {
  post: BlogPost;
  postUrl: string;
}

export default async function BlogPostArticle({ post, postUrl }: Props) {
  const allPosts = await getAllPosts();
  const relatedPosts = pickRelatedPosts(post, allPosts, 3);
  const isBuy = post.vertical === "buy";
  const isNeutral = post.vertical === "neutral";
  const transactionType = isBuy ? "sale" : "rent";

  const rentalHub = !isBuy ? resolveBlogListingHub(post.tags) : null;
  const buyHub = isBuy || isNeutral ? resolveBlogBuyHub(post.tags) : null;
  const relatedRentListings =
    !isBuy ? await fetchBlogRelatedListings(post.tags, 6) : null;
  const relatedSaleListings =
    isBuy || isNeutral ? await fetchBlogRelatedSaleListings(post.tags, 6) : null;

  const seoDescription = postSeoDescription(post);
  const authorName = resolveBlogAuthorName(post.author);
  const coverImage = resolveBlogImageUrl(post.coverImage);
  const coverImageAbsolute = resolveBlogImageAbsolute(post.coverImage, siteUrl, appPath);
  const toc = extractBlogToc(post.content);
  const mdxComponents = createBlogMdxComponents(toc);

  const hubSlugs = rentalHub ? slugsFromRentalHubHref(rentalHub.hubHref) : {};
  const buyCitySlug = buyHub?.hubHref.split("/")[2];
  const blogCityName =
    rentalHub?.areaConfig.city ?? rentalHub?.placeName ?? buyHub?.placeName;
  const blogAreaName =
    rentalHub && hubSlugs.areaSlug ? rentalHub.placeName : undefined;

  const blogBrowseHref = isBuy
    ? getBuyBrowseHref({
        placeQuery: buyHub?.placeQuery,
        lat: buyHub?.mapCenter.lat,
        lng: buyHub?.mapCenter.lng,
        zoom: buyHub?.mapZoom,
      })
    : rentalHub
      ? getBrowseHref({
          citySlug: hubSlugs.citySlug,
          areaSlug: hubSlugs.areaSlug,
          lat: rentalHub.areaConfig.center.lat,
          lng: rentalHub.areaConfig.center.lng,
          placeQuery: rentalHub.placeName,
        })
      : undefined;

  const blogListHref = isBuy
    ? getListForSaleHref({ citySlug: buyCitySlug })
    : getListPropertyHref({
        citySlug: hubSlugs.citySlug,
        areaSlug: hubSlugs.areaSlug,
        intent: "pg",
      });

  const blogCtaOverride = resolveSupplyCtaOverride(`/blog/${post.slug}`);
  const blogIntent = blogCtaOverride?.intent ?? (isBuy ? "property" : "pg");
  const indexHref = blogIndexHref(post.vertical);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Insights", url: canonicalUrl(indexHref) },
          { name: post.title, url: postUrl },
        ]}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: authorName,
          description: RENTALPINS_EDITORIAL_TEAM.bio,
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
          authorName,
          image: coverImageAbsolute,
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
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${verticalBadgeClass(post.vertical)}`}
          >
            {verticalLabel(post.vertical)}
          </span>
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
        <h1
          className={`font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem] ${
            isBuy ? "text-[var(--brand-navy)]" : "text-[#1E3A6E]"
          }`}
        >
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
        {coverImage ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage.startsWith("/") ? appPath(coverImage) : coverImage}
              alt={post.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        ) : null}

        {rentalHub ? <BlogRentalHubLink hub={rentalHub} /> : null}
        {buyHub && (isBuy || isNeutral) ? <BlogBuyHubLink hub={buyHub} /> : null}

        {isNeutral ? (
          <BlogNeutralCTA
            cityName={blogCityName}
            citySlug={buyCitySlug ?? hubSlugs.citySlug}
            variant="blog"
          />
        ) : (
          <ListPropertyCTA
            variant="blog"
            transactionType={transactionType}
            cityName={blogCtaOverride?.cityName ?? blogCityName}
            areaName={blogCtaOverride?.areaName ?? blogAreaName}
            intent={blogIntent}
            browseHref={blogBrowseHref}
            listHref={blogListHref}
            citySlug={blogCtaOverride?.citySlug ?? buyCitySlug ?? hubSlugs.citySlug}
            areaSlug={blogCtaOverride?.areaSlug ?? hubSlugs.areaSlug}
            headlineOverride={blogCtaOverride?.headline}
            bodyOverride={blogCtaOverride?.body}
          />
        )}

        <BlogTableOfContents entries={toc} />
        <div
          className={`prose prose-lg prose-slate mt-10 max-w-none prose-headings:font-serif prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl ${
            isBuy
              ? "prose-headings:text-[var(--brand-navy)] prose-a:text-[var(--sale-gold)]"
              : "prose-headings:text-[#1E3A6E] prose-a:text-[#E8501A]"
          }`}
        >
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {relatedRentListings ? (
          <BlogRelatedListings
            hub={relatedRentListings.hub}
            listings={relatedRentListings.listings}
            transactionType="rent"
          />
        ) : null}
        {relatedSaleListings && isBuy ? (
          <BlogRelatedListings
            hub={relatedSaleListings.hub}
            listings={relatedSaleListings.listings}
            transactionType="sale"
          />
        ) : null}

        <div className="mt-14 border-t border-slate-200 pt-8">
          <div className="mb-4 flex justify-end">
            <BlogPostAuthorActions slug={post.slug} authorId={post.authorId} />
          </div>
          <BlogAuthorBox
            authorName={authorName}
            category={post.category}
            vertical={post.vertical}
            readTime={post.readTime}
          />
        </div>

        <BlogFaqSection faqs={post.faqs ?? []} />

        {isNeutral ? (
          <BlogNeutralCTA
            cityName={blogCityName}
            citySlug={buyCitySlug ?? hubSlugs.citySlug}
            variant="bottom"
          />
        ) : (
          <ListPropertyCTA
            variant="bottom"
            transactionType={transactionType}
            cityName={blogCtaOverride?.cityName ?? blogCityName}
            areaName={blogCtaOverride?.areaName ?? blogAreaName}
            intent={blogIntent}
            browseHref={blogBrowseHref}
            listHref={blogListHref}
            citySlug={blogCtaOverride?.citySlug ?? buyCitySlug ?? hubSlugs.citySlug}
            areaSlug={blogCtaOverride?.areaSlug ?? hubSlugs.areaSlug}
            headlineOverride={blogCtaOverride?.headline}
            bodyOverride={blogCtaOverride?.body}
          />
        )}

        <BlogRelatedPosts posts={relatedPosts} />

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link href={appPath(indexHref)} className="font-semibold text-[#E8501A] hover:underline">
            ← Back to {verticalLabel(post.vertical)} guides
          </Link>
        </p>
      </article>

      {!isNeutral ? (
        <StickySeoCTA
          transactionType={transactionType}
          browseHref={blogBrowseHref}
          listHref={blogListHref}
          citySlug={blogCtaOverride?.citySlug ?? buyCitySlug ?? hubSlugs.citySlug}
          areaSlug={blogCtaOverride?.areaSlug ?? hubSlugs.areaSlug}
          intent={blogIntent}
          placeQuery={rentalHub?.placeName ?? buyHub?.placeName}
        />
      ) : null}
    </>
  );
}
