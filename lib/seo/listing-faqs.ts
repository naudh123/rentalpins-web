import type { ListingDetail } from "@/lib/types/listing";
import { formatListingPrice } from "@/lib/listing-price";
import { normalizeListingSeo } from "@/lib/seo/listing-seo";

export interface SeoFaq {
  question: string;
  answer: string;
}

/** AI/GEO-friendly FAQs for listing detail pages — crawlable, factual, no JS gating. */
export function buildListingFaqs(listing: ListingDetail): SeoFaq[] {
  const seo = normalizeListingSeo(listing);
  const price = formatListingPrice({
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    subCategory: listing.subCategory,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso,
  });
  const location = seo.normalizedLocationLabel || listing.locationName || "this area";
  const isSale = listing.transactionType === "sale";
  const action = isSale ? "buy" : "rent";
  const itemType = seo.normalizedCategoryLabel.toLowerCase();

  const faqs: SeoFaq[] = [
    {
      question: `What is the price of this ${itemType} in ${location}?`,
      answer:
        listing.price > 0
          ? `This listing is priced at ${price}${listing.priceUnit ? ` (${listing.priceUnit})` : ""} on RentalPins.`
          : `Contact the owner on RentalPins for the latest price for this ${itemType} in ${location}.`,
    },
    {
      question: `Where is this ${itemType} located?`,
      answer: listing.locationName
        ? `This listing is in ${listing.locationName}. View the map on this page for the exact pin location.`
        : `This listing is mapped on RentalPins. Use the location section on this page to see the area.`,
    },
    {
      question: `How can I contact the owner on RentalPins?`,
      answer:
        "Use the WhatsApp or call buttons on this listing page to reach the owner directly. RentalPins connects you without brokerage fees.",
    },
  ];

  if (!isSale) {
    faqs.push({
      question: `Can I ${action} this ${itemType} without a broker?`,
      answer: `Yes. RentalPins lists owner-direct ${itemType} rentals in ${location}. You can contact the lister directly from this page.`,
    });
  } else {
    faqs.push({
      question: `Is this property listed by the owner?`,
      answer:
        "RentalPins Buy focuses on owner-direct and verified sale listings. Contact the lister from this page to confirm details and schedule a visit.",
    });
  }

  if (listing.attributes?.bhk) {
    faqs.push({
      question: `What is the configuration of this property?`,
      answer: `This property is listed as ${listing.attributes.bhk}${listing.attributes.furnishing ? `, ${listing.attributes.furnishing}` : ""}${listing.attributes.areaSqft ? `, approximately ${listing.attributes.areaSqft} sq ft` : ""}.`,
    });
  }

  if (seo.categorySegment === "equipment") {
    faqs.push({
      question: `Where can I rent construction equipment in ${location}?`,
      answer: `RentalPins lists construction and scaffolding equipment for rent in ${location}. Browse this listing and similar equipment nearby on the map.`,
    });
  }

  return faqs;
}
