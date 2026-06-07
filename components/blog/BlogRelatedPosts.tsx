import BlogCard from "@/components/BlogCard";
import type { BlogPostSummary } from "@/lib/blog-types";

export default function BlogRelatedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-16 border-t border-slate-200 pt-12"
    >
      <h2
        id="related-posts-heading"
        className="font-serif text-2xl font-bold text-[#1E3A6E]"
      >
        Related articles
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
