import Link from "next/link";
import { appPath } from "@/lib/config";

interface Props {
  authorName: string;
  category: string;
  readTime?: string;
}

export default function BlogAuthorBox({
  authorName,
  category,
  readTime,
}: Props) {
  return (
    <aside className="mt-12 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        About the author
      </p>
      <p className="mt-3 font-serif text-xl font-bold text-[#1E3A6E]">{authorName}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Writes practical rental guides for RentalPins — covering {category.toLowerCase()}{" "}
        topics across India with owner-direct listings and no broker bias.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-[#1E3A6E]/10 px-3 py-1 font-semibold text-[#1E3A6E]">
          {category}
        </span>
        {readTime ? <span>{readTime}</span> : null}
      </div>
      <Link
        href={appPath("/blog")}
        className="mt-5 inline-flex text-sm font-semibold text-[#E8501A] hover:underline"
      >
        More articles on RentalPins
      </Link>
    </aside>
  );
}
