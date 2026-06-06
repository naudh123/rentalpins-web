"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import MarketingShell from "@/components/MarketingShell";
import BlogSeoPanel from "@/components/blog/BlogSeoPanel";
import { BLOG_CATEGORIES, BLOG_DRAFT_STORAGE_KEY, BLOG_LIMITS } from "@/lib/blog-config";
import {
  analyzeBlogSeo,
  blogReadTimeLabel,
  countMarkdownHeadings,
  countWords,
  generateExcerptFromContent,
  normalizeBlogPostBody,
  parseBlogTags,
  resolveMetaDescription,
  resolveMetaTitle,
} from "@/lib/blog-validation";
import { appPath } from "@/lib/config";
import { slugify } from "@/lib/seo";

const fieldClass = "rp-input mt-1 text-sm";

interface BlogDraft {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  slug: string;
  tagsInput: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  savedAt: string;
}

interface EditorInitial {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  coverImage?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  published?: boolean;
}

interface Props {
  editSlug?: string;
  initial?: EditorInitial;
}

const TitleField = memo(function TitleField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">Title</span>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        maxLength={BLOG_LIMITS.titleMax}
        autoComplete="off"
      />
      <span className="mt-1 block text-xs text-slate-500">
        {value.length}/{BLOG_LIMITS.titleMax} characters
      </span>
    </label>
  );
});

const SlugField = memo(function SlugField({
  value,
  onChange,
  previewPath,
}: {
  value: string;
  onChange: (value: string) => void;
  previewPath: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">URL slug</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} font-mono`}
        placeholder="my-rental-guide"
        autoComplete="off"
        spellCheck={false}
      />
      <span className="mt-1 block truncate text-xs text-slate-500">{previewPath}</span>
    </label>
  );
});

const ExcerptField = memo(function ExcerptField({
  value,
  onChange,
  onGenerate,
}: {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}) {
  return (
    <label className="block">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">Excerpt</span>
        <button
          type="button"
          onClick={onGenerate}
          className="text-xs font-semibold text-[#E8501A] hover:underline"
        >
          Generate from content
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={BLOG_LIMITS.excerptMax}
        className={`${fieldClass} min-h-[5.5rem] resize-y leading-relaxed`}
        autoComplete="off"
        placeholder="Short summary shown on the blog index and social cards."
      />
      <span className="mt-1 block text-xs text-slate-500">
        {value.length}/{BLOG_LIMITS.excerptMax} characters · minimum{" "}
        {BLOG_LIMITS.excerptMin} to publish
      </span>
    </label>
  );
});

const CategoryField = memo(function CategoryField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const options =
    BLOG_CATEGORIES.includes(value as (typeof BLOG_CATEGORIES)[number])
      ? BLOG_CATEGORIES
      : ([value, ...BLOG_CATEGORIES] as readonly string[]);

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">Category</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      >
        {options.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
});

const CoverImageField = memo(function CoverImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">Cover image URL (optional)</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        placeholder="https://... or /images/blog/cover.jpg"
        autoComplete="off"
      />
      {value ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            className="max-h-48 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : null}
    </label>
  );
});

const ContentField = memo(function ContentField({
  value,
  onChange,
  wordCount,
  headingCount,
  readTime,
}: {
  value: string;
  onChange: (value: string) => void;
  wordCount: number;
  headingCount: number;
  readTime: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">Content (Markdown)</span>
      <textarea
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        className={`${fieldClass} min-h-[20rem] resize-y font-mono leading-relaxed`}
        placeholder={"## Your heading\n\nWrite your article here..."}
        autoComplete="off"
        spellCheck={true}
      />
      <span className="mt-1 block text-xs text-slate-500">
        {wordCount} words · {headingCount} heading(s) · {readTime}
      </span>
    </label>
  );
});

function readStoredDraft(): BlogDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BlogDraft;
  } catch {
    return null;
  }
}

export default function BlogEditor({ editSlug, initial }: Props) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [slug, setSlug] = useState(editSlug ?? "");
  const [saving, setSaving] = useState(false);
  const [loadingPost, setLoadingPost] = useState(Boolean(editSlug && !initial));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [dirty, setDirty] = useState(false);
  const slugTouchedRef = useRef(Boolean(editSlug));
  const hydratedRef = useRef(false);

  const wordCount = useMemo(() => countWords(content), [content]);
  const headingCount = useMemo(() => countMarkdownHeadings(content), [content]);
  const readTime = useMemo(() => blogReadTimeLabel(content), [content]);

  const seoInput = useMemo(
    () => ({
      title,
      excerpt,
      content,
      category,
      coverImage,
      slug: slug || slugify(title),
      tags: parseBlogTags(tagsInput),
      metaTitle,
      metaDescription,
      published,
    }),
    [
      title,
      excerpt,
      content,
      category,
      coverImage,
      slug,
      tagsInput,
      metaTitle,
      metaDescription,
      published,
    ]
  );

  const seoChecks = useMemo(() => analyzeBlogSeo(seoInput), [seoInput]);
  const slugPreviewPath = appPath(`/blog/${slug || slugify(title) || "your-post-slug"}`);

  const markDirty = useCallback(() => setDirty(true), []);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      markDirty();
      if (!editSlug && !slugTouchedRef.current) {
        setSlug(slugify(value));
      }
    },
    [editSlug, markDirty]
  );

  const handleSlugChange = useCallback(
    (value: string) => {
      slugTouchedRef.current = true;
      setSlug(slugify(value));
      markDirty();
    },
    [markDirty]
  );

  const wrapSetter = useCallback(
    <T,>(setter: (value: T) => void) =>
      (value: T) => {
        setter(value);
        markDirty();
      },
    [markDirty]
  );

  useEffect(() => {
    if (editSlug || initial || hydratedRef.current || loading) return;
    hydratedRef.current = true;
    const draft = readStoredDraft();
    if (!draft) return;
    setTitle(draft.title);
    setExcerpt(draft.excerpt);
    setContent(draft.content);
    setCategory(draft.category);
    setCoverImage(draft.coverImage);
    setSlug(draft.slug);
    setTagsInput(draft.tagsInput);
    setMetaTitle(draft.metaTitle);
    setMetaDescription(draft.metaDescription);
    setPublished(draft.published);
    setDraftRestored(true);
    setDirty(false);
  }, [editSlug, initial, loading]);

  useEffect(() => {
    if (editSlug || !user || loading) return;
    if (!dirty) return;
    const timer = window.setTimeout(() => {
      const draft: BlogDraft = {
        title,
        excerpt,
        content,
        category,
        coverImage,
        slug,
        tagsInput,
        metaTitle,
        metaDescription,
        published,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, 800);
    return () => window.clearTimeout(timer);
  }, [
    editSlug,
    user,
    loading,
    dirty,
    title,
    excerpt,
    content,
    category,
    coverImage,
    slug,
    tagsInput,
    metaTitle,
    metaDescription,
    published,
  ]);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!editSlug || initial || !user) return;
    let cancelled = false;
    (async () => {
      setLoadingPost(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const res = await fetch(appPath(`/api/blog/${encodeURIComponent(editSlug)}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Could not load post.");
          return;
        }
        if (cancelled) return;
        setTitle(data.title ?? "");
        setExcerpt(data.excerpt ?? "");
        setContent(data.content ?? "");
        setCategory(data.category ?? "General");
        setCoverImage(data.coverImage ?? "");
        setTagsInput(Array.isArray(data.tags) ? data.tags.join(", ") : "");
        setMetaTitle(data.metaTitle ?? "");
        setMetaDescription(data.metaDescription ?? "");
        setPublished(data.published !== false);
        setSlug(data.slug ?? editSlug);
        setDirty(false);
      } catch {
        if (!cancelled) setError("Network error while loading post.");
      } finally {
        if (!cancelled) setLoadingPost(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editSlug, initial, user]);

  const handleGenerateExcerpt = useCallback(() => {
    const generated = generateExcerptFromContent(content, BLOG_LIMITS.excerptMax - 1);
    if (!generated) {
      setError("Add some content first to generate an excerpt.");
      return;
    }
    setExcerpt(generated);
    markDirty();
    setError(null);
  }, [content, markDirty]);

  async function savePost(publish: boolean) {
    setError(null);
    setNotice(null);
    setSaving(true);
    try {
      const token = await user?.getIdToken();
      if (!token) {
        setError("Please sign in to save.");
        return;
      }

      const payload = {
        title,
        excerpt,
        content,
        category,
        coverImage,
        published: publish,
        slug: slug || slugify(title),
        tags: tagsInput,
        metaTitle,
        metaDescription,
        authorName: profile?.displayName || user?.displayName || undefined,
      };

      const validated = normalizeBlogPostBody(payload);
      if (!validated.ok) {
        setError(validated.errors.join(" "));
        return;
      }

      const url = editSlug
        ? appPath(`/api/blog/${encodeURIComponent(editSlug)}`)
        : appPath("/api/blog");
      const res = await fetch(url, {
        method: editSlug ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save.");
        return;
      }

      if (!editSlug) {
        localStorage.removeItem(BLOG_DRAFT_STORAGE_KEY);
      }
      setDirty(false);

      if (data.published) {
        router.push(appPath(`/blog/${data.slug}`));
        return;
      }

      setNotice("Draft saved. It stays hidden until you publish.");
      if (!editSlug) {
        router.push(appPath(`/blog/${data.slug}/edit`));
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const loginNext = encodeURIComponent(appPath(editSlug ? `/blog/${editSlug}/edit` : "/blog/write"));

  if (loading || loadingPost) {
    return (
      <MarketingShell>
        <p className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">Loading…</p>
      </MarketingShell>
    );
  }

  if (!user) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#1E3A6E]">Write a blog post</h1>
          <p className="mt-3 text-slate-600">
            Sign in to share rental tips, city guides, and housing advice.
          </p>
          <Link
            href={`${appPath("/auth/login")}?next=${loginNext}`}
            className="rp-btn rp-btn-primary mt-6 inline-flex"
          >
            Sign in
          </Link>
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void savePost(published);
        }}
        className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <h1 className="font-serif text-3xl font-bold text-[#1E3A6E]">
          {editSlug ? "Edit post" : "Write a blog post"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use Markdown for headings, links, and lists. Aim for clear H2 sections and a strong
          excerpt for search visibility.
        </p>

        {draftRestored ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Restored your saved draft from this browser.
          </p>
        ) : null}

        {error ? (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {notice ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {notice}
          </p>
        ) : null}

        <div className="mt-8 space-y-5">
          <TitleField value={title} onChange={handleTitleChange} />
          <SlugField
            value={slug}
            onChange={handleSlugChange}
            previewPath={slugPreviewPath}
          />
          <ExcerptField
            value={excerpt}
            onChange={wrapSetter(setExcerpt)}
            onGenerate={handleGenerateExcerpt}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <CategoryField value={category} onChange={wrapSetter(setCategory)} />
            <CoverImageField value={coverImage} onChange={wrapSetter(setCoverImage)} />
          </div>

          <ContentField
            value={content}
            onChange={wrapSetter(setContent)}
            wordCount={wordCount}
            headingCount={headingCount}
            readTime={readTime}
          />

          <BlogSeoPanel
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            tagsInput={tagsInput}
            title={title}
            excerpt={excerpt}
            slug={slug || slugify(title)}
            checks={seoChecks}
            onMetaTitleChange={wrapSetter(setMetaTitle)}
            onMetaDescriptionChange={wrapSetter(setMetaDescription)}
            onTagsChange={wrapSetter(setTagsInput)}
          />

          <fieldset className="rounded-xl border border-slate-200 p-4">
            <legend className="px-1 text-sm font-semibold text-slate-700">Visibility</legend>
            <label className="mt-2 flex items-start gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="publish-mode"
                checked={published}
                onChange={() => {
                  setPublished(true);
                  markDirty();
                }}
                className="mt-1 h-4 w-4 border-slate-300"
              />
              <span>
                <span className="font-medium">Publish</span> — visible on the blog, sitemap, and
                search engines.
              </span>
            </label>
            <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="publish-mode"
                checked={!published}
                onChange={() => {
                  setPublished(false);
                  markDirty();
                }}
                className="mt-1 h-4 w-4 border-slate-300"
              />
              <span>
                <span className="font-medium">Save as draft</span> — only you can edit it until
                you publish.
              </span>
            </label>
          </fieldset>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void savePost(true)}
            className="rp-btn rp-btn-primary px-6 py-2.5 disabled:opacity-60"
          >
            {saving ? "Saving…" : editSlug && !published ? "Publish post" : "Publish post"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void savePost(false)}
            className="rp-btn rp-btn-secondary px-6 py-2.5 disabled:opacity-60"
          >
            Save draft
          </button>
          {editSlug && published ? (
            <Link
              href={appPath(`/blog/${slug || editSlug}`)}
              className="rp-btn rp-btn-ghost px-6 py-2.5"
            >
              View live
            </Link>
          ) : null}
          <Link href={appPath("/blog")} className="rp-btn rp-btn-ghost px-6 py-2.5">
            Cancel
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          SEO preview title:{" "}
          <span className="font-medium text-slate-700">
            {resolveMetaTitle(title, metaTitle)}
          </span>
          {" · "}
          Meta description:{" "}
          <span className="font-medium text-slate-700">
            {resolveMetaDescription(excerpt, metaDescription).slice(0, 80)}
            {resolveMetaDescription(excerpt, metaDescription).length > 80 ? "…" : ""}
          </span>
        </p>
      </form>
    </MarketingShell>
  );
}
