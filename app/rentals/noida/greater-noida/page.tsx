import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("noida", "greater-noida");
export const metadata = meta;
export default Page;
