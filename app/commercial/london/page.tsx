import type { Metadata } from "next";
import CommercialLandingPage from "@/components/seo/commercial/CommercialLandingPage";
import {
  COMMERCIAL_LONDON_HUB,
  COMMERCIAL_LONDON_NOINDEX,
  commercialLondonHubPath,
} from "@/lib/commercial-london-config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: COMMERCIAL_LONDON_HUB.title,
  description: COMMERCIAL_LONDON_HUB.metaDescription,
  path: commercialLondonHubPath(),
  keywords: [
    "commercial property to rent London",
    "office to rent London",
    "warehouse to rent London",
    "shop to let London",
    "commercial property UK",
    "RentalPins",
  ],
  locale: "en_GB",
  // No live UK inventory yet — keep crawlable for links, out of the index (GSC: 10k impressions, 2 clicks).
  noIndex: COMMERCIAL_LONDON_NOINDEX,
});

export default function CommercialLondonHubPage() {
  return <CommercialLandingPage config={COMMERCIAL_LONDON_HUB} />;
}
