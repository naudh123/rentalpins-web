import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("noida", "noida-extension");
export const metadata = meta;
export default Page;
