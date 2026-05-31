import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdBreadcrumb } from "@/components/JsonLd";
import ListingDetailNav from "@/components/listings/ListingDetailNav";
import ListingDetailJumpLinks from "@/components/listings/ListingDetailJumpLinks";
import ListingHashFocusRestorer from "@/components/listings/ListingHashFocusRestorer";
import ListingRailImpressionTracker from "@/components/listings/ListingRailImpressionTracker";
import ListingEngagement from "@/components/listings/ListingEngagement";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingMapSnippet from "@/components/listings/ListingMapSnippet";
import ListingOwnerTrust from "@/components/listings/ListingOwnerTrust";
import ListingOwnerProfileLink from "@/components/listings/ListingOwnerProfileLink";
import ReportListingButton from "@/components/listings/ReportListingButton";
import ListingReviews from "@/components/listings/ListingReviews";
import ListingSaveButton from "@/components/listings/ListingSaveButton";
import ListingStickyBar, {
  ListingDetailScrollSentinel,
} from "@/components/listings/ListingStickyBar";
import ListingRelatedListingCard from "@/components/listings/ListingRelatedListingCard";
import RecentlyViewedRecorder from "@/components/listings/RecentlyViewedRecorder";
import ListingDetailViewTracker from "@/components/listings/ListingDetailViewTracker";
import ListingMapLink from "@/components/listings/ListingMapLink";
import RecentlyViewedRail from "@/components/listings/RecentlyViewedRail";
import {
  fetchListingById,
  fetchMoreFromOwner,
  fetchSimilarListingsNearby,
} from "@/lib/listings";
import { fetchListingReviewSummary } from "@/lib/listing-review-summary";
import { fetchOwnerTrust } from "@/lib/owner-trust";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { appPath, siteUrl } from "@/lib/config";
import { mapSearchUrl } from "@/lib/map-search-url";
import { formatPrice } from "@/lib/format";
import { listingWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import ListingActions from "./ListingActions";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(id);
  if (!listing) return { title: "Listing not found" };

  const canonical = `${siteUrl}${appPath(`/listings/${id}`)}`;
  const description =
    listing.description.slice(0, 160) ||
    `${listing.title} — browse rentals on RentalPins.`;
  const title = `${listing.title} | RentalPins`;
  const ogImage = listing.imageUrls[0] || listing.imageUrl || "/og-image.png";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "RentalPins",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  if (!listing) notFound();

  const [ownerTrust, similarListings, ownerListings, reviewSummary] =
    await Promise.all([
      listing.ownerUid ? fetchOwnerTrust(listing.ownerUid) : Promise.resolve(null),
      fetchSimilarListingsNearby(listing, 4),
      listing.ownerUid
        ? fetchMoreFromOwner(listing.ownerUid, id, 4)
        : Promise.resolve([]),
      fetchListingReviewSummary(id),
    ]);

  const photoCount =
    listing.imageUrls.length > 0
      ? listing.imageUrls.length
      : listing.imageUrl
        ? 1
        : 0;

  const listingUrl = `${siteUrl}${appPath(`/listings/${id}`)}`;
  const whatsAppHref = listing.ownerPhone
    ? whatsappUrl(listing.ownerPhone, listingWhatsAppMessage(listing.title, listingUrl))
    : "";
  const priceLabel = formatPrice(
    listing.price,
    listing.priceUnit,
    listing.homeIso
  );

  const productImages = listing.imageUrls.length
    ? listing.imageUrls
    : listing.imageUrl
      ? [listing.imageUrl]
      : undefined;

  const hasGeo =
    Number.isFinite(listing.lat) &&
    Number.isFinite(listing.lng) &&
    Math.abs(listing.lat) <= 90 &&
    Math.abs(listing.lng) <= 180;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description.slice(0, 500),
    image: productImages,
    url: listingUrl,
    sku: id,
    category: listing.category,
    ...(hasGeo
      ? {
          contentLocation: {
            "@type": "Place",
            ...(listing.locationName ? { name: listing.locationName } : {}),
            geo: {
              "@type": "GeoCoordinates",
              latitude: listing.lat,
              longitude: listing.lng,
            },
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: listing.price > 0 ? listing.price : undefined,
      priceCurrency: listing.homeIso === "IN" ? "INR" : "USD",
      availability: "https://schema.org/InStock",
      url: listingUrl,
    },
    ...(reviewSummary
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Math.round(reviewSummary.avgRating * 10) / 10,
            reviewCount: reviewSummary.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  const breadcrumbItems = [
    { name: "Home", url: `${siteUrl}${appPath("/")}` },
    { name: "Search map", url: `${siteUrl}${appPath("/search")}` },
    { name: listing.title, url: listingUrl },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:py-8 sm:pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <ListingHashFocusRestorer />
      <RecentlyViewedRecorder listingId={id} />
      <ListingDetailViewTracker
        listingId={id}
        category={listing.category}
        subCategory={listing.subCategory}
        isPromoted={listing.isPromoted}
        hasOwnerPhone={Boolean(listing.ownerPhone)}
        hasOwnerUid={Boolean(listing.ownerUid)}
        photoCount={photoCount}
        hasDescription={Boolean(listing.description?.trim())}
        reviewCount={reviewSummary?.count ?? 0}
      />
      <Breadcrumbs
        className="mb-3"
        items={[
          { label: "Home", href: appPath("/") },
          { label: "Map", href: appPath("/search") },
          {
            label:
              listing.title.length > 52
                ? `${listing.title.slice(0, 52)}…`
                : listing.title,
          },
        ]}
      />
      <ListingDetailNav listingId={id} title={listing.title} listingUrl={listingUrl} />
      <ListingStickyBar
        listingId={id}
        title={listing.title}
        priceLabel={priceLabel}
        whatsAppHref={whatsAppHref}
        telHref={
          listing.ownerPhone
            ? `tel:${listing.ownerPhone.replace(/\s/g, "")}`
            : undefined
        }
      />

      <div className="mt-4 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]">
        <ListingGallery
          images={listing.imageUrls}
          title={listing.title}
          listingId={id}
        />
      </div>

      <div className="rp-card mt-6 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--brand-navy)]">{listing.category}</span>
          {listing.subCategory && (
            <span className="text-sm text-[var(--muted)]">· {listing.subCategory}</span>
          )}
          {listing.isPromoted && <span className="rp-badge">Featured</span>}
        </div>
        {(() => {
          const a = listing.attributes;
          if (!a) return null;
          const specs: string[] = [];
          if (a.bhk) specs.push(a.bhk);
          if (a.furnishing) specs.push(a.furnishing);
          if (a.bathrooms) specs.push(`${a.bathrooms} Bath`);
          if (a.areaSqft) specs.push(`${a.areaSqft} sq ft`);
          if (a.tenantPreference) specs.push(`Tenants: ${a.tenantPreference}`);
          if (!specs.length) return null;
          return (
            <div className="mt-3 flex flex-wrap gap-2">
              {specs.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-medium text-[var(--brand-navy)]"
                >
                  {s}
                </span>
              ))}
            </div>
          );
        })()}
        <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight">{listing.title}</h1>
        <ListingDetailJumpLinks
          listingId={id}
          hasGeo={hasGeo}
          hasDescription={Boolean(listing.description?.trim())}
          hasContact={Boolean(listing.ownerPhone || listing.ownerUid)}
          hasOwnerRail={ownerListings.length > 0}
          hasSimilarRail={similarListings.length > 0}
          excludeListingId={id}
        />
        {listing.locationName && (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>📍</span> {listing.locationName}
            </span>
            <ListingMapLink
              href={appPath(mapSearchUrl(listing.lat, listing.lng, 14, id))}
              listingId={id}
              linkSource="location_header"
              className="text-xs font-semibold text-[var(--brand-orange)] hover:underline"
            >
              View on map
            </ListingMapLink>
          </p>
        )}
        <div className="mt-4 flex items-start justify-between gap-3">
          <p className="font-serif text-2xl text-[var(--brand-orange)]">
            {priceLabel}
          </p>
          <ListingSaveButton listingId={id} size="md" />
        </div>
        <ListingEngagement
          listingId={id}
          listedAt={listing.createdAt}
          initialViews={listing.viewsCount}
          inquiryCount={listing.inquiryCount}
        />
        <ListingOwnerTrust
          listingId={id}
          ownerTrust={ownerTrust}
          ownerPhone={listing.ownerPhone}
          ownerUid={listing.ownerUid}
        />
        <div className="mt-4 flex justify-end border-t border-[var(--border-subtle)] pt-3">
          <ReportListingButton
            listingId={id}
            listingTitle={listing.title}
            ownerUid={listing.ownerUid}
          />
        </div>
      </div>
      <ListingDetailScrollSentinel />

      {listing.description && (
        <section id="listing-description" className="rp-card mt-4 scroll-mt-24 p-5">
          <h2 className="rp-label mb-0 uppercase tracking-wider">Description</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--text)]/90">
            {listing.description}
          </p>
        </section>
      )}

      <ListingReviews
        listingId={id}
        ownerUid={listing.ownerUid}
        initialReviewCount={reviewSummary?.count ?? 0}
        initialAvgRating={reviewSummary?.avgRating ?? 0}
      />

      <ListingMapSnippet
        listingId={id}
        lat={listing.lat}
        lng={listing.lng}
        locationName={listing.locationName}
      />

      <RecentlyViewedRail excludeId={id} className="mt-6" />

      {ownerListings.length > 0 && (
        <section
          id="listing-owner-rail"
          className="mt-6 scroll-mt-24"
          aria-labelledby="listing-owner-rail-heading"
        >
          <ListingRailImpressionTracker
            listingId={id}
            rail="owner"
            listingCount={ownerListings.length}
          />
          <div className="mb-3 flex items-center justify-between">
            <h2 id="listing-owner-rail-heading" className="font-serif text-xl">
              More from this lister
              {ownerTrust?.displayName ? (
                <span className="text-base font-normal text-[var(--muted)]">
                  {" "}
                  · {ownerTrust.displayName}
                </span>
              ) : null}
            </h2>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-[var(--muted)]">
                {ownerListings.length} shown
              </span>
              {listing.ownerUid && (
                <ListingOwnerProfileLink
                  ownerUid={listing.ownerUid}
                  displayName={ownerTrust?.displayName ?? "Lister"}
                  listingId={id}
                  linkSource="owner_rail"
                  className="text-xs font-semibold text-[var(--brand-orange)] hover:underline"
                >
                  View all listings →
                </ListingOwnerProfileLink>
              )}
            </div>
          </div>
          <div className="grid gap-3">
            {ownerListings.map((item) => (
              <ListingRelatedListingCard
                key={item.id}
                listing={item}
                section="owner"
                sourceListingId={id}
              />
            ))}
          </div>
        </section>
      )}

      {similarListings.length > 0 && (
        <section
          id="listing-similar-rail"
          className="mt-6 scroll-mt-24"
          aria-labelledby="listing-similar-rail-heading"
        >
          <ListingRailImpressionTracker
            listingId={id}
            rail="similar"
            listingCount={similarListings.length}
          />
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="listing-similar-rail-heading" className="font-serif text-xl">
              Similar listings nearby
            </h2>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-[var(--muted)]">
                Based on distance and category
              </span>
              <ListingMapLink
                href={appPath(
                  mapSearchUrl(listing.lat, listing.lng, 13, undefined, listing.category)
                )}
                listingId={id}
                linkSource="similar_rail"
                className="text-xs font-semibold text-[var(--brand-orange)] hover:underline"
              >
                View similar on map →
              </ListingMapLink>
            </div>
          </div>
          <div className="grid gap-3">
            {similarListings.map((item) => (
              <ListingRelatedListingCard
                key={item.id}
                listing={item}
                section="similar"
                sourceListingId={id}
              />
            ))}
          </div>
        </section>
      )}

      <ListingActions
        listingId={id}
        title={listing.title}
        ownerPhone={listing.ownerPhone}
        ownerUid={listing.ownerUid}
        listingImage={listing.imageUrl}
        listingUrl={listingUrl}
      />
    </article>
  );
}
