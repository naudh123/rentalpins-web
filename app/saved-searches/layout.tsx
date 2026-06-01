import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved searches",
  description: "Your saved search alerts on RentalPins.",
  path: "/saved-searches",
  noIndex: true,
});

export default function SavedSearchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
