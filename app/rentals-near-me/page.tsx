import type { Metadata } from "next";
import NearMeLandingClient from "@/components/seo/NearMeLandingClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Rentals Near Me | RentalPins",
  description: "Find rentals near your current location with map-first search and direct owner contact.",
  path: "/rentals-near-me",
});

export default function RentalsNearMePage() {
  return (
    <NearMeLandingClient
      title="Rentals near me"
      intro="Allow location access to instantly discover nearby rental listings and contact owners directly."
    />
  );
}
