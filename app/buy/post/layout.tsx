import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "List for sale",
  description: "List your property for sale on RentalPins Buy.",
  path: "/buy/post",
  noIndex: true,
});

export default function BuyPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
