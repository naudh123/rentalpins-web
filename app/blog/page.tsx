import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogInsightsIndex from "@/components/blog/BlogInsightsIndex";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rental guides — PG tips, city guides & housing advice",
  description:
    "Rental tips, city guides, and housing advice for Chandigarh, Ludhiana, Delhi, Jaipur, and renters across India.",
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
    title: "RentalPins Rental Guides",
    description:
      "PG tips, city guides, and housing advice for renters and landlords.",
    url: canonicalUrl("/blog"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalPins Rental Guides",
    description:
      "PG tips, city guides, and housing advice for renters and landlords.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const revalidate = 300;

export default async function BlogRentIndexPage() {
  const posts = await getAllPosts();
  return <BlogInsightsIndex posts={posts} filter="rent" />;
}
