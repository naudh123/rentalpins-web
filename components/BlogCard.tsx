import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog-types";
import { verticalBadgeClass, verticalLabel } from "@/lib/blog-vertical";
import { appPath } from "@/lib/config";

interface Props {
  post: BlogPostSummary;
}

export default function BlogCard({ post }: Props) {
  return (
    <Link
      href={appPath(`/blog/${post.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#E8501A]/35 hover:shadow-lg"
    >
      {post.coverImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${verticalBadgeClass(post.vertical)}`}
          >
            {verticalLabel(post.vertical)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E8501A]">
            {post.category}
          </span>
        </div>
        <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-slate-900 transition group-hover:text-[#1E3A6E]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>
            {new Date(post.date).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })}
          </span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
