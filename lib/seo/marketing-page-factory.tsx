import MarketingLandingPage from "@/components/seo/MarketingLandingPage";
import {
  APP_DOWNLOAD_PAGES,
  CATEGORY_LANDING_PAGES,
  COMPETITOR_PAGES,
  INDUSTRIAL_PAGES,
  marketingMetadata,
  NEAR_ME_PAGES,
  STUDENT_RENTAL_PAGES,
  WITHOUT_BROKER_PAGES,
  type MarketingPageConfig,
} from "@/lib/seo/marketing-pages";

const ALL: Record<string, MarketingPageConfig> = {
  ...WITHOUT_BROKER_PAGES,
  ...APP_DOWNLOAD_PAGES,
  ...CATEGORY_LANDING_PAGES,
  ...INDUSTRIAL_PAGES,
  ...STUDENT_RENTAL_PAGES,
  ...NEAR_ME_PAGES,
};

function getConfig(slug: string): MarketingPageConfig | null {
  if (ALL[slug]) return ALL[slug]!;
  const comp = COMPETITOR_PAGES[slug];
  return comp ?? null;
}

export function marketingPageExports(slug: string) {
  const config = getConfig(slug);
  if (!config) {
    throw new Error(`Unknown marketing page slug: ${slug}`);
  }
  const resolvedConfig: MarketingPageConfig = config;
  const competitor = COMPETITOR_PAGES[slug];
  const metadata = marketingMetadata(resolvedConfig);
  function Page() {
    return (
      <MarketingLandingPage
        config={resolvedConfig}
        showAppCta={Boolean(APP_DOWNLOAD_PAGES[slug])}
        comparisonRows={competitor?.rows}
        competitorName={competitor?.competitor}
      />
    );
  }
  return { metadata, Page };
}
