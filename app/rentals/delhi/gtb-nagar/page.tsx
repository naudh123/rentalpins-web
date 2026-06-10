import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("delhi", "gtb-nagar");
export const metadata = meta;
export default Page;
