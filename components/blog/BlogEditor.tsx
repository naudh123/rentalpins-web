"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import MarketingShell from "@/components/MarketingShell";
import { appPath } from "@/lib/config";
import { slugify } from "@/lib/seo";

interface Props {
  editSlug?: string;
  initial?: {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    coverImage?: string;
    published?: boolean;
  };
}

export default function BlogEditor({ editSlug, initial }: Props) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [slug, setSlug] = useState(editSlug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editSlug && title && !slug) {
      setSlug(slugify(title));
    }
  }, [title, editSlug, slug]);

  async function getToken() {
    if (!user) return null;
    return user.getIdToken();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Please sign in to publish.");
        return;
      }
      const payload = {
        title,
        excerpt,
        content,
        category,
        coverImage,
        published,
        slug: slug || slugify(title),
        authorName: profile?.displayName || user?.displayName || undefined,
      };
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
      router.push(appPath(`/blog/${data.slug}`));
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
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
          <p className="mt-3 text-slate-600">Sign in to share rental tips, city guides, and housing advice.</p>
          <Link href={appPath("/auth/login")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Sign in
          </Link>
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <h1 className="font-serif text-3xl font-bold text-[#1E3A6E]">
          {editSlug ? "Edit post" : "Write a blog post"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Share rental tips and city guides. Use Markdown for headings, links, and lists.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              maxLength={120}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">URL slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm"
              placeholder="my-rental-guide"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Excerpt</span>
            <textarea
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={300}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Cover image URL (optional)</span>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                placeholder="https://..."
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Content (Markdown)</span>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm leading-relaxed"
              placeholder="## Your heading&#10;&#10;Write your article here..."
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Publish immediately (visible on blog and search engines)
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rp-btn rp-btn-primary px-6 py-2.5 disabled:opacity-60"
          >
            {saving ? "Saving…" : editSlug ? "Update post" : "Publish post"}
          </button>
          <Link href={appPath("/blog")} className="rp-btn rp-btn-secondary px-6 py-2.5">
            Cancel
          </Link>
        </div>
      </form>
    </MarketingShell>
  );
}
