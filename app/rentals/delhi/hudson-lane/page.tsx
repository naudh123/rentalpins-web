import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("delhi", "hudson-lane");
export const metadata = meta;
export default Page;
