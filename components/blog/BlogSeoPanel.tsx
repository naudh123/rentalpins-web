"use client";

import { memo } from "react";
import { BLOG_LIMITS } from "@/lib/blog-config";
import type { BlogSeoCheck } from "@/lib/blog-validation";
import { appPath, siteUrl } from "@/lib/config";

const fieldClass = "rp-input mt-1 text-sm";

export const MetaTitleField = memo(function MetaTitleField({
  value,
  onChange,
  fallbackTitle,
}: {
  value: string;
  onChange: (value: string) => void;
  fallbackTitle: string;
}) {
  const preview = value.trim() || fallbackTitle.trim();
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">SEO title (optional)</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        maxLength={BLOG_LIMITS.metaTitleMax}
        placeholder={fallbackTitle || "Custom title for Google results"}
        autoComplete="off"
      />
      <span className="mt-1 block text-xs text-slate-500">
        Preview: {preview.slice(0, BLOG_LIMITS.metaTitleMax)} · {preview.length}/
        {BLOG_LIMITS.metaTitleMax}
      </span>
    </label>
  );
});

export const MetaDescriptionField = memo(function MetaDescriptionField({
  value,
  onChange,
  fallbackExcerpt,
}: {
  value: string;
  onChange: (value: string) => void;
  fallbackExcerpt: string;
}) {
  const preview = value.trim() || fallbackExcerpt.trim();
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        Meta description (optional)
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={BLOG_LIMITS.metaDescriptionMax}
        className={`${fieldClass} min-h-[5rem] resize-y leading-relaxed`}
        placeholder="120–160 characters for search snippets. Defaults to excerpt."
        autoComplete="off"
      />
      <span className="mt-1 block text-xs text-slate-500">
        {preview.length}/{BLOG_LIMITS.metaDescriptionMax} characters
      </span>
    </label>
  );
});

export const TagsField = memo(function TagsField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">Tags</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        placeholder="PG, Chandigarh, student housing"
        autoComplete="off"
      />
      <span className="mt-1 block text-xs text-slate-500">
        Comma-separated · up to {BLOG_LIMITS.tagsMax} tags
      </span>
    </label>
  );
});

function SearchPreview({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  const url = `${siteUrl}${appPath(`/blog/${slug || "your-post-slug"}`)}`;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Google preview
      </p>
      <p className="mt-2 truncate text-sm text-[#1a0dab]">{title || "Post title"}</p>
      <p className="truncate text-xs text-[#006621]">{url}</p>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
        {description || "Your meta description or excerpt appears here in search results."}
      </p>
    </div>
  );
}

function SeoChecklist({ checks }: { checks: BlogSeoCheck[] }) {
  const passed = checks.filter((c) => c.pass).length;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">SEO checklist</p>
        <span className="rounded-full bg-[#1E3A6E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1E3A6E]">
          {passed}/{checks.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                check.pass
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-800"
              }`}
              aria-hidden
            >
              {check.pass ? "✓" : "!"}
            </span>
            <span className="text-slate-700">
              {check.label}
              {check.hint ? (
                <span className="block text-xs text-slate-500">{check.hint}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(function BlogSeoPanel({
  metaTitle,
  metaDescription,
  tagsInput,
  title,
  excerpt,
  slug,
  checks,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onTagsChange,
}: {
  metaTitle: string;
  metaDescription: string;
  tagsInput: string;
  title: string;
  excerpt: string;
  slug: string;
  checks: BlogSeoCheck[];
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}) {
  const previewTitle = (metaTitle.trim() || title.trim()).slice(0, BLOG_LIMITS.metaTitleMax);
  const previewDescription = (metaDescription.trim() || excerpt.trim()).slice(
    0,
    BLOG_LIMITS.metaDescriptionMax
  );

  return (
    <section className="space-y-5 rounded-2xl border border-[#1E3A6E]/15 bg-[#1E3A6E]/[0.03] p-5">
      <div>
        <h2 className="font-serif text-lg font-bold text-[#1E3A6E]">SEO settings</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tune how this post appears in Google, social previews, and structured data.
        </p>
      </div>

      <SearchPreview
        title={previewTitle}
        description={previewDescription}
        slug={slug}
      />

      <MetaTitleField
        value={metaTitle}
        onChange={onMetaTitleChange}
        fallbackTitle={title}
      />
      <MetaDescriptionField
        value={metaDescription}
        onChange={onMetaDescriptionChange}
        fallbackExcerpt={excerpt}
      />
      <TagsField value={tagsInput} onChange={onTagsChange} />
      <SeoChecklist checks={checks} />
    </section>
  );
});
