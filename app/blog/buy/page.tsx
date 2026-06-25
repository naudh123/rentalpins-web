import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogInsightsIndex from "@/components/blog/BlogInsightsIndex";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Buy & sell guides — property sale tips for buyers and sellers",
  description:
    "Buyer checklists, seller tips, and Tricity investment context for owner-direct property sales on RentalPins Buy.",
  alternates: {
    canonical: canonicalUrl("/blog/buy"),
  },
  openGraph: {
    title: "RentalPins Buy & Sell Guides",
    description:
      "Practical guides for buyers and sellers on RentalPins Buy — Tricity first.",
    url: canonicalUrl("/blog/buy"),
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const revalidate = 300;

export default async function BlogBuyIndexPage() {
  const posts = await getAllPosts();
  return <BlogInsightsIndex posts={posts} filter="buy" />;
}
