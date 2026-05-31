// ─── components/JsonLd.tsx ────────────────────────────────────────────────────
// Reusable JSON-LD structured data components for SEO rich results.
// Usage:
//   import { JsonLdOrganization, JsonLdWebsite, JsonLdLocalBusiness, ... } from "@/components/JsonLd";
//   <JsonLdOrganization />              ← in layout.tsx (global)
//   <JsonLdWebsite />                   ← in layout.tsx (global)
//   <JsonLdLocalBusiness city={...} />  ← in city pages
//   <JsonLdBreadcrumb items={[...]} />  ← in city pages
//   <JsonLdSoftwareApplication />     ← in layout.tsx (global; app subdomain)

import React from "react";
import { appPath, siteUrl } from "@/lib/config";

function abs(path: string): string {
  return `${siteUrl}${appPath(path)}`;
}

// ── Helper ────────────────────────────────────────────────────────────────────
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Organization (global — who is RentalPins) ─────────────────────────────────
export function JsonLdOrganization() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "RentalPins",
        alternateName: ["Rental Pins", "rentalpins.com"],
        url: abs("/"),
        logo: abs("/logo/logo.png"),
        slogan: "Rent Anything, Anywhere",
        description:
          "RentalPins is a global-oriented, map-first rental marketplace: rooms, PG, flats, vehicles, electronics, furniture and equipment. Strong presence in India (Chandigarh Tricity, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai and more) plus London, Nairobi and Lagos. List for free; browse on a map; contact owners directly — similar consumer jobs to property portals and classifieds, with discovery built around location.",
        knowsAbout: [
          "Rental marketplace India",
          "Room and PG for rent",
          "Flat and apartment rentals",
          "Vehicle rental",
          "Classified-style rentals",
          "Long-stay housing discovery",
          "Chandigarh Mohali Panchkula rentals",
          "Ludhiana rentals",
          "Delhi NCR rentals",
          "Jaipur rentals",
          "Lucknow rentals",
          "Mumbai rentals",
          "London rentals",
          "Nairobi rentals",
          "Lagos rentals",
        ],
        foundingDate: "2024",
        sameAs: [
          "https://www.facebook.com/rentalpins",
          "https://www.instagram.com/rentalpins/",
          "https://x.com/rentalpins",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9915209240",
          email: "support@rentalpins.com",
          contactType: "customer service",
          availableLanguage: ["English", "Hindi", "Punjabi"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ludhiana",
          addressRegion: "Punjab",
          addressCountry: "IN",
        },
      }}
    />
  );
}

// ── WebSite (global — enables sitelinks search box in Google) ─────────────────
export function JsonLdWebsite() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RentalPins",
        url: abs("/"),
        description:
          "Map-based rental marketplace. Find rooms, flats, PGs, vehicles and equipment for rent across India and listed international cities. Browse by city and area; contact owners directly.",
        inLanguage: ["en-IN", "en-GB", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${abs("/search")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

/** Web app (interactive map, listings, auth) — complements www marketing site. */
export function JsonLdSoftwareApplication() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "RentalPins — Live map & listings",
        url: abs("/search"),
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android",
        browserRequirements:
          "Requires JavaScript. Modern evergreen browser recommended.",
        description:
          "Interactive map and listing experience for RentalPins — search rentals, post ads, and contact owners at www.rentalpins.com.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Free to browse; listing fees subject to in-app terms.",
        },
        provider: {
          "@type": "Organization",
          name: "RentalPins",
          url: abs("/"),
        },
      }}
    />
  );
}

// ── LocalBusiness (per-city — used on city pages) ─────────────────────────────
interface CityInfo {
  name: string; // e.g. "RentalPins Chandigarh"
  description: string;
  url: string; // e.g. "https://www.rentalpins.com/rentals/chandigarh"
  areaServed: string[]; // e.g. ["Chandigarh", "Mohali", "Panchkula", ...]
  geo: { lat: number; lng: number };
}

export function JsonLdLocalBusiness({ city }: { city: CityInfo }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": city.url,
        name: city.name,
        description: city.description,
        url: city.url,
        image: abs("/logo/logo.png"),
        telephone: "+91-9915209240",
        email: "support@rentalpins.com",
        priceRange: "Free – ₹999",
        geo: {
          "@type": "GeoCoordinates",
          latitude: city.geo.lat,
          longitude: city.geo.lng,
        },
        areaServed: city.areaServed.map((area) => ({
          "@type": "City",
          name: area,
        })),
        parentOrganization: {
          "@type": "Organization",
          name: "RentalPins",
          url: abs("/"),
        },
      }}
    />
  );
}

// ── BreadcrumbList (per-page — helps Google show breadcrumbs in search) ───────
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function JsonLdBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

// ── FAQPage (any page with FAQ — triggers "People Also Ask" in Google) ────────
interface FAQItem {
  question: string;
  answer: string;
}

export function JsonLdFAQ({ faqs }: { faqs: FAQItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

// ── BlogPosting (blog article pages) ──────────────────────────────────────────
interface BlogPostingInfo {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  image?: string;
}

export function JsonLdBlogPosting({ post }: { post: BlogPostingInfo }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: post.url,
        datePublished: post.datePublished,
        dateModified: post.dateModified ?? post.datePublished,
        author: {
          "@type": "Person",
          name: post.authorName,
        },
        publisher: {
          "@type": "Organization",
          name: "RentalPins",
          url: abs("/"),
          logo: {
            "@type": "ImageObject",
            url: abs("/logo/logo.png"),
          },
        },
        image: post.image
          ? [post.image.startsWith("http") ? post.image : abs(post.image)]
          : [abs("/og-image.png")],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": post.url,
        },
      }}
    />
  );
}
