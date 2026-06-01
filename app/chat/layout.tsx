import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Messages",
  description: "RentalPins in-app chat.",
  path: "/chat",
  noIndex: true,
});

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
