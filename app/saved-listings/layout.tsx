import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved listings",
  description: "Your saved listings on RentalPins.",
  path: "/saved-listings",
  noIndex: true,
});

export default function SavedListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
