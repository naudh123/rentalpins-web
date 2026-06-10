import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("delhi", "mukherjee-nagar");
export const metadata = meta;
export default Page;
