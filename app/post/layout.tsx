import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Post for rent",
  description: "List your property for rent on the RentalPins rent map — PGs, flats, rooms, and commercial.",
  path: "/post",
  noIndex: true,
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
