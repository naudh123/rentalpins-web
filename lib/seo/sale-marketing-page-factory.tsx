import SaleMarketingLandingPage from "@/components/sale/SaleMarketingLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { MarketingPageConfig } from "@/lib/seo/marketing-pages";
import { SALE_MARKETING_PAGES } from "@/lib/sale/sale-marketing-pages";
import type { SaleFunnelKind } from "@/lib/sale/sale-funnel-cities";

const FUNNEL_SLUGS: Record<string, SaleFunnelKind> = {
  "flats-for-sale": "flats",
  "property-for-sale": "property",
  "property-for-sale-chandigarh": "property",
  "property-for-sale-mohali": "property",
};

function getConfig(slug: string): MarketingPageConfig | null {
  return SALE_MARKETING_PAGES[slug] ?? null;
}

export function saleMarketingPageExports(slug: string) {
  const config = getConfig(slug);
  if (!config) {
    throw new Error(`Unknown sale marketing page slug: ${slug}`);
  }

  const resolvedConfig = config;

  const metadata = buildPageMetadata({
    title: resolvedConfig.title,
    description: resolvedConfig.description,
    path: `/${slug}`,
    keywords: [resolvedConfig.h1, "property for sale", "RentalPins Buy", "owner direct"],
    locale: "en_IN",
  });

  const funnelKind = FUNNEL_SLUGS[slug];

  function Page() {
    return <SaleMarketingLandingPage config={resolvedConfig} funnelKind={funnelKind} />;
  }

  return { metadata, Page };
}
