import { geoPageExports } from "@/lib/seo/geo-page-factory";

const { generateMetadata, default: Page } = geoPageExports("/rental-market-insights/mohali");

export { generateMetadata };
export default Page;
