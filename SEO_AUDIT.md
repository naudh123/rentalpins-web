# SEO Audit — RentalPins (Next.js App Router)

Date: 2026-06-01

## Scope scanned

- All App Router page routes under `app/**/page.tsx`
- Global metadata in layout
- Robots and sitemap routes
- Structured data usage on homepage, rentals, listing detail, and blog pages

## Key findings (before implementation)

1. Missing/noindex metadata coverage for private app surfaces:
   - `/profile`, `/chat`, `/post` were client pages without explicit route-level metadata.
2. Programmatic SEO coverage gaps:
   - No category-route system for city/category and area/category combinations.
3. Sitemap architecture:
   - Single `app/sitemap.ts`; no dedicated city/locality/listing/blog XML endpoints.
4. Robots directives:
   - Only `/api/` was disallowed; private app surfaces were still crawlable.
5. Homepage SEO:
   - Metadata did not match requested title/description.
   - Internal link blocks for no-broker and app-download hubs were limited.
6. Schema:
   - Good baseline existed (Organization, Website, FAQ, Breadcrumb, LocalBusiness), but no reusable `components/seo/*` system and limited programmatic schema on new landing templates.
7. Thin-content and indexability risks:
   - Auth/profile/chat/post/saved pages are transactional and should stay out of index.
8. Twitter/OpenGraph consistency:
   - Present on major pages, but not standardized via single metadata builder.

## Implemented fixes summary

- Added reusable metadata builder and SEO component surface.
- Added noindex metadata layouts for `/post`, `/profile`, `/chat`.
- Added category programmatic SEO routes (city/category and area/category).
- Added dedicated daily-revalidated sitemap XML endpoints:
  - `/sitemap-cities.xml`
  - `/sitemap-localities.xml`
  - `/sitemap-listings.xml`
  - `/sitemap-blog.xml`
- Updated robots to disallow private/app routes and reference all sitemap endpoints.
- Updated homepage title/description and strengthened internal linking blocks.
- Added marketing landing pages (without-broker, app-download, competitor).

## Remaining recommendations

1. Add route-level metadata for `/saved-listings` and `/saved-searches` via layout-level `noindex`.
2. Expand long-form city/locality editorial content toward full 1500–2500 words where business wants it.
3. Add explicit RealEstateListing schema injection on listing detail page (currently strong Product schema is in use there).
4. Add static content QA checks (minimum-word threshold + duplicate-title guard) in CI.

