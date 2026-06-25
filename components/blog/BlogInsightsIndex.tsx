import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import MarketingShell from "@/components/MarketingShell";
import type { BlogIndexFilter } from "@/lib/blog-config";
import { BLOG_INDEX_TABS, FEATURED_BUY_GUIDE_LINKS } from "@/lib/blog-config";
import type { BlogPostSummary } from "@/lib/blog-types";
import { filterPostsByIndex } from "@/lib/blog-vertical";
import { appPath } from "@/lib/config";

const INDEX_COPY: Record<
  BlogIndexFilter,
  { title: string; description: string; empty: string }
> = {
  all: {
    title: "RentalPins Insights",
    description:
      "Practical guides for renters, buyers, and property owners — rental tips, buy/sell advice, and local market context across India.",
    empty: "No articles yet. Check back soon.",
  },
  rent: {
    title: "Rental guides",
    description:
      "PG tips, city guides, and housing advice for renters and landlords on RentalPins.",
    empty: "No rental articles yet. Check back soon.",
  },
  buy: {
    title: "Buy & sell guides",
    description:
      "Buyer checklists, seller tips, and Tricity investment context for owner-direct property sales on RentalPins Buy.",
    empty: "Buy guides are launching soon. Explore featured investment pages below.",
  },
};

function activeTab(filter: BlogIndexFilter) {
  return BLOG_INDEX_TABS.find((tab) => tab.id === filter) ?? BLOG_INDEX_TABS[0];
}

interface Props {
  posts: BlogPostSummary[];
  filter: BlogIndexFilter;
}

export default function BlogInsightsIndex({ posts, filter }: Props) {
  const copy = INDEX_COPY[filter];
  const visible = filterPostsByIndex(posts, filter);
  const tab = activeTab(filter);

  return (
    <MarketingShell>
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 -top-20 h-52 rounded-full bg-gradient-to-br from-[#1E3A6E]/[0.07] via-transparent to-[#E8501A]/[0.05] blur-3xl"
          aria-hidden
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8501A]">
              RentalPins Insights
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#1E3A6E] sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-slate-600">{copy.description}</p>
          </div>
          <Link
            href={appPath("/blog/write")}
            className="rp-btn rp-btn-primary shrink-0 px-5 py-2.5 text-sm"
          >
            Write a post
          </Link>
        </div>

        <nav
          className="mt-8 flex flex-wrap gap-2"
          aria-label="Blog sections"
        >
          {BLOG_INDEX_TABS.map((item) => {
            const isActive = item.id === tab.id;
            return (
              <Link
                key={item.id}
                href={appPath(item.href)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#1E3A6E] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#E8501A]/40 hover:text-[#1E3A6E]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {filter === "buy" ? (
          <section className="mt-10" aria-labelledby="featured-buy-guides">
            <h2
              id="featured-buy-guides"
              className="text-sm font-semibold uppercase tracking-wider text-slate-500"
            >
              Featured investment guides
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {FEATURED_BUY_GUIDE_LINKS.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={appPath(guide.href)}
                    className="block rounded-2xl border border-[color-mix(in_srgb,var(--sale-gold)_30%,white)] bg-[color-mix(in_srgb,var(--sale-gold)_8%,white)] p-5 no-underline transition hover:shadow-md"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sale-gold)]">
                      Buy guide
                    </span>
                    <p className="mt-2 font-serif text-lg font-bold text-[var(--brand-navy)]">
                      {guide.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{guide.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {visible.length === 0 ? (
          <p className="mt-12 text-slate-500">{copy.empty}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </MarketingShell>
  );
}
