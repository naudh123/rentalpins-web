import type { Metadata } from "next";
import NearMeLandingClient from "@/components/seo/NearMeLandingClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Offices Near Me | RentalPins",
  description: "Find nearby office and co-working spaces with location-aware map search.",
  path: "/offices-near-me",
});

export default function OfficesNearMePage() {
  return (
    <NearMeLandingClient
      title="Offices near me"
      intro="Discover office and co-working listings around your location with direct owner/operator contact."
      category="Property"
    />
  );
}
