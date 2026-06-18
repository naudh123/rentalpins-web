import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("jaipur", "sitapura");
export const metadata = meta;
export default Page;
