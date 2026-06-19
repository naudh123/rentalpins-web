import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("noida", "sector-15");
export const metadata = meta;
export default Page;
