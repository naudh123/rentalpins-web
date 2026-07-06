import { formatListingPrice } from "@/lib/listing-price";
import { listingCanonicalUrl } from "@/lib/listing-share";
import { normalizeListingSeo } from "@/lib/seo/listing-seo";
import type { ListingDetail } from "@/lib/types/listing";

export interface ListingSharePayload {
  url: string;
  title: string;
  priceLabel: string;
  location: string;
  modeLabel: string;
  brandLabel: string;
  /** Primary line for WhatsApp / clipboard — URL on its own line for link preview. */
  whatsAppText: string;
  /** Richer body for native share sheet (iOS/Android). */
  nativeShareText: string;
  nativeShareTitle: string;
}

function specLine(listing: ListingDetail): string {
  const parts: string[] = [];
  const bhk = listing.attributes?.bhk?.trim();
  if (bhk) parts.push(bhk);
  const furnish = listing.attributes?.furnishing?.trim();
  if (furnish) parts.push(furnish);
  if (listing.subCategory?.trim()) parts.push(listing.subCategory.trim());
  else if (listing.category?.trim()) parts.push(listing.category.trim());
  return parts.slice(0, 3).join(" · ");
}

/** Premium, click-optimised share copy — rent & buy aware. */
export function buildListingSharePayload(listing: ListingDetail): ListingSharePayload {
  const seo = normalizeListingSeo(listing);
  const url = listingCanonicalUrl(listing);
  const isSale = listing.transactionType === "sale";
  const priceLabel = formatListingPrice({
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    subCategory: listing.subCategory,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso,
  });
  const location = listing.locationName?.trim() || seo.normalizedLocationLabel;
  const specs = specLine(listing);
  const modeLabel = isSale ? "For sale" : "For rent";
  const brandLabel = isSale ? "RentalPins Buy" : "RentalPins";

  const headline = specs
    ? `${listing.title} — ${specs}`
    : listing.title;

  const hook = isSale
    ? `🏡 ${headline}\n${priceLabel}${location ? ` · ${location}` : ""}`
    : `🏠 ${headline}\n${priceLabel}${location ? ` · ${location}` : ""}`;

  const trust = isSale
    ? "Owner-direct listing on RentalPins Buy — photos, map pin & contact on one tap."
    : "Owner-direct on RentalPins — view photos, map location & contact the owner.";

  const cta = isSale ? "View listing & enquire →" : "View listing & contact owner →";

  const whatsAppText = [hook, trust, cta, url].join("\n\n");

  const nativeShareText = [
    hook,
    trust,
    cta,
    url,
  ].join("\n");

  return {
    url,
    title: listing.title,
    priceLabel,
    location,
    modeLabel,
    brandLabel,
    whatsAppText,
    nativeShareText,
    nativeShareTitle: `${modeLabel}: ${listing.title} | ${brandLabel}`,
  };
}
