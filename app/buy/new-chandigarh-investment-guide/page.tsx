import { geoPageExports } from "@/lib/seo/geo-page-factory";

const { generateMetadata, default: Page } = geoPageExports(
  "/buy/new-chandigarh-investment-guide"
);

export { generateMetadata };
export default Page;
