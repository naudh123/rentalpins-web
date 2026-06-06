export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
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
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}
