/** Firestore listing fields used by web (aligned with Android app — read-only contract). */

export interface ListingGeoPoint {
  latitude: number;
  longitude: number;
}

export interface ListingPosition {
  geopoint?: ListingGeoPoint;
  geohash?: string;
}

/** Structured, category-specific attributes (currently Property/residential). */
export interface ListingAttributes {
  bhk?: string;
  furnishing?: string;
  tenantPreference?: string;
  areaSqft?: number;
  bathrooms?: number;
}

export interface ListingDocument {
  id: string;
  title?: string;
  description?: string;
  price?: number | string;
  priceUnit?: string;
  category?: string;
  subCategory?: string;
  categoryId?: string;
  categoryName?: string;
  locationName?: string;
  imageUrls?: string[];
  imageIcons?: string[];
  imageThumbnails?: string[];
  imagesFull?: string[];
  videoUrl?: string;
  ownerUid?: string;
  ownerPhone?: string;
  /** False when contact mobile was typed on web without OTP; true after verified link. */
  ownerPhoneVerified?: boolean;
  iso?: string;
  homeIso?: string;
  billingCurrency?: string;
  isActive?: boolean;
  isPromoted?: boolean;
  viewsCount?: number;
  inquiryCount?: number;
  createdAt?: string;
  updatedAt?: string;
  position?: ListingPosition;
  attributes?: ListingAttributes;
  currentPlanName?: string;
  listingExpiresAt?: string;
  /** SEO path segment set on activation (includes listing id suffix). */
  urlSlug?: string;
  searchableTitle?: string;
}

export interface ListingCard {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  category: string;
  subCategory: string;
  locationName: string;
  imageUrl: string;
  lat: number;
  lng: number;
  isPromoted: boolean;
  viewsCount: number;
  inquiryCount: number;
  ownerPhone: string;
  ownerPhoneVerified?: boolean;
  homeIso?: string;
  createdAt: string;
  updatedAt: string;
  attributes?: ListingAttributes;
  urlSlug?: string;
}

export interface ListingDetail extends ListingCard {
  imageUrls: string[];
  ownerUid: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
