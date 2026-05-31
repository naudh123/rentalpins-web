import type { Metadata } from "next";
import BlogEditor from "@/components/blog/BlogEditor";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Write a blog post",
  description:
    "Share rental tips, city guides, and housing advice on the RentalPins blog.",
  alternates: { canonical: canonicalUrl("/blog/write") },
  robots: { index: false, follow: true },
};

export default function BlogWritePage() {
  return <BlogEditor />;
}
