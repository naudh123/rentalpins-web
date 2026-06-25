import type { Metadata } from "next";
import PostRequirementClient from "@/components/buy/PostRequirementClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Post buy requirement | RentalPins Buy",
  description:
    "Post your property buy requirement — budget, locality, and property type. Sellers respond through RentalPins.",
  path: "/buy/requirements/post",
  robots: { index: false, follow: true },
});

export default function PostRequirementPage() {
  return <PostRequirementClient />;
}
