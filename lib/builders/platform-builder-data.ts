import { PLATFORM_BUY_BUILDER_SLUG } from "@/lib/builders/buy-project-bridge";
import { PLATFORM_SALES_PHONE } from "@/lib/builders/project-contact";

/** Firestore builder profile for RentalPins platform-handled buy project leads. */
export const PLATFORM_BUILDER = {
  name: "RentalPins Sales Desk",
  slug: PLATFORM_BUY_BUILDER_SLUG,
  description:
    "RentalPins concierge desk — coordinates site visits, brochures, and builder callbacks for Tricity new-launch and buy-side project enquiries.",
  phone: PLATFORM_SALES_PHONE,
  whatsapp: PLATFORM_SALES_PHONE,
  email: "admin@rentalpins.com",
  website: "https://www.rentalpins.com",
  address: "Chandigarh Tricity",
  city: "Mohali",
  state: "Punjab",
  status: "published" as const,
  leadRouting: "platform" as const,
};
