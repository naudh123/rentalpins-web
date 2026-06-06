"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";

function isAdminRole(role: string | undefined): boolean {
  return role === "admin" || role === "superadmin";
}

export default function BlogPostAuthorActions({
  slug,
  authorId,
}: {
  slug: string;
  authorId?: string;
}) {
  const { user, profile, loading } = useAuth();
  if (loading || !user || !authorId) return null;
  if (user.uid !== authorId && !isAdminRole(profile?.role)) return null;

  return (
    <Link
      href={appPath(`/blog/${slug}/edit`)}
      className="font-semibold text-[#E8501A] hover:underline"
    >
      Edit post
    </Link>
  );
}
