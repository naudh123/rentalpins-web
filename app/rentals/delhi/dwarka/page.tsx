import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("delhi", "dwarka");
export const metadata = meta;
export default Page;
