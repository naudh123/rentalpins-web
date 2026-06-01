import type { Metadata } from "next";
import NearMeLandingClient from "@/components/seo/NearMeLandingClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "PG Near Me | RentalPins",
  description: "Find nearby PG and hostel listings with location-aware map search.",
  path: "/pg-near-me",
});

export default function PgNearMePage() {
  return (
    <NearMeLandingClient
      title="PG near me"
      intro="Find nearby PG and hostel options around your current location and compare quickly."
      category="Property"
    />
  );
}
