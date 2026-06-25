import type { BlogVertical } from "@/lib/blog-config";

export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  vertical: BlogVertical;
  category: string;
  coverImage?: string;
  author?: string;
  readTime?: string;
  source?: "mdx" | "firestore";
  authorId?: string;
  published?: boolean;
  updatedAt?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  faqs?: BlogFaqItem[];
}

export interface BlogFaqItem {
  q: string;
  a: string;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}
