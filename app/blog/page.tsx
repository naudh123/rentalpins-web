import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import MarketingShell from "@/components/MarketingShell";
import type { Metadata } from "next";
import { appPath } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog — rental tips, city guides & more",
  description:
    "Rental tips, city guides and housing advice for Chandigarh, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai and renters across India.",
  keywords: [
    "RentalPins blog",
    "PG tips India",
    "flat rent guide",
    "Chandigarh rentals blog",
  ],
  alternates: {
    canonical: canonicalUrl("/blog"),
  },
  openGraph: {
    title: "RentalPins Blog",
    description:
      "Rental tips, city guides, and housing advice across India.",
    url: canonicalUrl("/blog"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalPins Blog",
    description:
      "Rental tips, city guides, and housing advice across India.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <MarketingShell>
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 -top-20 h-52 rounded-full bg-gradient-to-br from-[#1E3A6E]/[0.07] via-transparent to-[#E8501A]/[0.05] blur-3xl"
          aria-hidden
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1E3A6E] sm:text-4xl">
              RentalPins blog
            </h1>
            <p className="mt-3 max-w-xl text-lg text-slate-600">
              Rental tips, city guides, and housing advice across India.
            </p>
          </div>
          <Link
            href={appPath("/blog/write")}
            className="rp-btn rp-btn-primary shrink-0 px-5 py-2.5 text-sm"
          >
            Write a post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-slate-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </MarketingShell>
  );
}
