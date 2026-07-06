import { geoPageExports } from "@/lib/seo/geo-page-factory";

const { generateMetadata, default: Page } = geoPageExports("/buy/kharar-investment-guide");

export { generateMetadata };
export default Page;
