import type { Metadata } from "next";
import NearMeLandingClient from "@/components/seo/NearMeLandingClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Flats Near Me | RentalPins",
  description: "Find flats and apartments near your current location on RentalPins.",
  path: "/flats-near-me",
});

export default function FlatsNearMePage() {
  return (
    <NearMeLandingClient
      title="Flats near me"
      intro="Use geolocation to open nearby flats and apartment listings with direct owner contact."
      category="Property"
    />
  );
}
