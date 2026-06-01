import type { Metadata } from "next";
import NearMeLandingClient from "@/components/seo/NearMeLandingClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Shops Near Me | RentalPins",
  description: "Find nearby shops and showroom spaces with map-first rental search.",
  path: "/shops-near-me",
});

export default function ShopsNearMePage() {
  return (
    <NearMeLandingClient
      title="Shops near me"
      intro="Open nearby retail listings and compare local commercial opportunities instantly."
      category="Property"
    />
  );
}
