import type { Metadata } from "next";
import NearMeLandingClient from "@/components/seo/NearMeLandingClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Warehouses Near Me | RentalPins",
  description: "Find nearby warehouses and storage spaces using geolocation-powered map search.",
  path: "/warehouses-near-me",
});

export default function WarehousesNearMePage() {
  return (
    <NearMeLandingClient
      title="Warehouses near me"
      intro="Locate nearby warehouse and storage inventory around logistics corridors near your current location."
      category="Property"
    />
  );
}
