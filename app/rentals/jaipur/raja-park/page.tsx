import { indiaRentalPageExports } from "@/lib/seo/india-rental-page-factory";

const { metadata: meta, Page } = indiaRentalPageExports("jaipur", "raja-park");
export const metadata = meta;
export default Page;
