import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("mohali", "sector-70");
export const metadata = meta;
export default Page;
