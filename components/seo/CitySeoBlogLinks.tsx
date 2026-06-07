import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog-types";
import { appPath } from "@/lib/config";

export default function CitySeoBlogLinks({
  placeName,
  posts,
}: {
  placeName: string;
  posts: BlogPostSummary[];
}) {
  if (!posts.length) return null;

  return (
    <div className="mt-10 border-t border-slate-200 pt-10">
      <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
        Rental guides for {placeName}
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Deeper tips on PG, flats, and no-broker search — with links back to live
        map inventory.
      </p>
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={appPath(`/blog/${post.slug}`)}
              className="group block rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-[#E8501A]/30 hover:bg-white"
            >
              <span className="font-semibold text-[#1E3A6E] group-hover:text-[#E8501A] group-hover:underline">
                {post.title}
              </span>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link
          href={appPath("/blog")}
          className="font-medium text-[#E8501A] hover:underline"
        >
          Browse all RentalPins guides →
        </Link>
      </p>
    </div>
  );
}
