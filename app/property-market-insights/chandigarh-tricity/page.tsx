import { geoPageExports } from "@/lib/seo/geo-page-factory";

const { generateMetadata, default: Page } = geoPageExports(
  "/property-market-insights/chandigarh-tricity"
);

export { generateMetadata };
export default Page;
