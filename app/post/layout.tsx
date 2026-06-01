import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Post a listing",
  description: "Create or edit a rental listing on RentalPins.",
  path: "/post",
  noIndex: true,
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
