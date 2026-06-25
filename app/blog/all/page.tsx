import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogInsightsIndex from "@/components/blog/BlogInsightsIndex";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "RentalPins Insights — rental & buy/sell guides",
  description:
    "All RentalPins guides for renters, buyers, and property owners across India.",
  alternates: {
    canonical: canonicalUrl("/blog/all"),
  },
  robots: { index: true, follow: true },
};

export const revalidate = 300;

export default async function BlogAllIndexPage() {
  const posts = await getAllPosts();
  return <BlogInsightsIndex posts={posts} filter="all" />;
}
