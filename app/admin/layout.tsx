import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin",
  description: "RentalPins internal administration.",
  path: "/admin",
  robots: { index: false, follow: false },
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
