import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("jaipur", "c-scheme");
export const metadata = meta;
export default Page;
