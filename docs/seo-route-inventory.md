# SEO Route Inventory (Phase 1 Audit)

> Internal document — safe extension reference for programmatic SEO work.
> Generated: 2026-07-02. Do not change behavior of protected routes listed in `lib/seo/protectedRoutes.ts`.

## Summary

| Category | Pattern | Dynamic | Metadata source | Sitemap |
|----------|---------|---------|-----------------|---------|
| Home | `/` | Static | `app/layout.tsx` + `app/page.tsx` | `app/sitemap.ts` |
| Marketing landings | `/{slug}` | Static | `lib/seo/marketing-pages.ts` via factory | `getCoreMarketingSitemapSlugs()` |
| Blog index | `/blog` | Static | page export | `app/sitemap.ts` + `sitemap-blog.xml` |
| Blog posts | `/blog/[slug]` | Dynamic | MDX frontmatter | `sitemap-blog.xml` |
| Legacy rentals (308) | `/rentals/{city}` | Redirect | middleware → `/rentals/in/{city}` | N/A (redirect) |
| Country rentals | `/rentals/[country]/[city]` | Dynamic | `lib/cities-config` + city SEO | `sitemap-cities.xml` |
| Area rentals | `/rentals/[country]/[city]/[area]` | Dynamic | area config + programmatic metadata | `sitemap-localities.xml` |
| Category rentals | `/rentals/.../[category]` | Dynamic | `programmatic-metadata.ts` | filtered by indexability |
| GSC hub rentals | `/rentals/mohali`, `/rentals/kharar`, etc. | Static wrappers | `lib/rental-area-config.ts` | `getIndianGscSitemapPaths()` |
| Listing detail | `/listings/[id]`, `/[listingId]` | Dynamic | listing data | `sitemap-listings.xml` |
| Property slug | `/rentals/property/[slug]` | Dynamic | listing | listings sitemap |
| Buy / projects | `/buy/*`, `/projects/*` | Mixed | buy configs | `app/sitemap.ts` |
| New programmatic SEO | `/universities/*`, `/cities/*`, etc. | Dynamic | `lib/seo/seoData.ts` | `getProgrammaticSeoSitemapPaths()` |

## Protected / High-Value Routes

These must keep working with unchanged canonical intent:

| Route | File | Type | Canonical | In sitemap | Notes |
|-------|------|------|-----------|------------|-------|
| `/` | `app/page.tsx` | Static | self | Yes | Home |
| `/pg-near-chandigarh-university` | `app/pg-near-chandigarh-university/page.tsx` | Static | self | Yes (marketing) | Extend below fold only |
| `/blog/kharar-pg-guide-chandigarh-university` | `app/blog/[slug]/page.tsx` + MDX | Dynamic | self | Yes (blog) | Do not redirect |
| `/rentals/in/chandigarh` | `app/rentals/[country]/[city]/page.tsx` | Dynamic | self | Yes (cities) | Legacy `/rentals/chandigarh` → 308 |
| `/rentals/in/chandigarh/mohali` | city/area dynamic | Dynamic | self | Yes | Also `/rentals/mohali` hub |
| `/rentals/in/chandigarh/panchkula` | city/area dynamic | Dynamic | self | Yes | |
| `/rentals/in/chandigarh/zirakpur` | city/area dynamic | Dynamic | self | Yes | Also `/rentals/zirakpur` |
| `/rentals/in/chandigarh/kharar` | city/area dynamic | Dynamic | self | Yes | Also `/rentals/kharar` |
| `/rentals/in/chandigarh/landran` | city/area dynamic | Dynamic | self | Yes | |
| `/rentals/in/chandigarh/banur` | city/area dynamic | Dynamic | self | Yes | |
| `/rentals/in/ludhiana` | city dynamic | Dynamic | self | Yes | Legacy `/rentals/ludhiana` → 308 |
| `/rentals/in/ludhiana/sarabha-nagar` | area dynamic | Dynamic | self | Yes | |
| `/rentals/in/ludhiana/model-town` | area dynamic | Dynamic | self | Yes | |
| `/rentals/in/ludhiana/pakhowal-road` | area dynamic | Dynamic | self | Yes | |
| `/rentals/in/ludhiana/brs-nagar` | area dynamic | Dynamic | self | Yes | |
| `/rentals/in/ludhiana/focal-point` | area dynamic | Dynamic | self | Yes | |
| `/rentals/in/delhi` | city dynamic | Dynamic | self | Yes | Legacy `/rentals/delhi` → 308 |
| `/rentals/in/delhi/dwarka` | area + GSC page | Mixed | self | Yes | Also `/rentals/delhi/dwarka` |
| `/rentals/in/delhi/mukherjee-nagar` | area + GSC page | Mixed | self | Yes | |

## Marketing Student PG Landings

| Route | File | Sitemap |
|-------|------|---------|
| `/pg-near-chandigarh-university` | `app/pg-near-chandigarh-university/page.tsx` | Yes |
| `/pg-near-cgc-landran` | `app/pg-near-cgc-landran/page.tsx` | Yes |
| `/pg-near-pec` | `app/pg-near-pec/page.tsx` | Yes |
| `/pg-near-pau` | `app/pg-near-pau/page.tsx` | Yes |
| `/pg-near-gndec` | `app/pg-near-gndec/page.tsx` | Yes |
| `/pg-near-lpu` | `app/pg-near-lpu/page.tsx` | Yes |
| `/flats-near-cgc-landran` | `app/flats-near-cgc-landran/page.tsx` | Yes |
| `/hostel-near-cgc-landran` | `app/hostel-near-cgc-landran/page.tsx` | Yes |
| `/student-accommodation-near-cgc-landran` | `app/student-accommodation-near-cgc-landran/page.tsx` | Yes |

## GSC Indian Rental Hubs (short URLs)

| Route | File |
|-------|------|
| `/rentals/mohali` | `app/rentals/mohali/page.tsx` |
| `/rentals/mohali/phase-7` | `app/rentals/mohali/phase-7/page.tsx` |
| `/rentals/mohali/sector-70` | `app/rentals/mohali/sector-70/page.tsx` |
| `/rentals/kharar` | `app/rentals/kharar/page.tsx` |
| `/rentals/kharar/chandigarh-university` | `app/rentals/kharar/chandigarh-university/page.tsx` |
| `/rentals/chandigarh-university` | `app/rentals/chandigarh-university/page.tsx` |
| `/rentals/zirakpur` | `app/rentals/zirakpur/page.tsx` |
| `/rentals/delhi` | `app/rentals/delhi/page.tsx` |
| `/rentals/delhi/dwarka` | `app/rentals/delhi/dwarka/page.tsx` |
| `/rentals/delhi/mukherjee-nagar` | `app/rentals/delhi/mukherjee-nagar/page.tsx` |

## Core Config Files

| File | Role |
|------|------|
| `app/sitemap.ts` | Core marketing + hub URLs |
| `app/sitemap-cities.xml/route.ts` | City rental hubs |
| `app/sitemap-localities.xml/route.ts` | Locality pages (indexability filtered) |
| `app/sitemap-listings.xml/route.ts` | Active listings |
| `app/sitemap-blog.xml/route.ts` | Blog posts |
| `app/robots.ts` | Staging noindex; production allow |
| `middleware.ts` | Legacy rentals 308, blog slug canonicalization |
| `lib/seo.ts` | `canonicalUrl`, `slugify` |
| `lib/seo/metadata.ts` | `buildPageMetadata` |
| `lib/seo/programmatic-indexability.ts` | Thin page noindex rules |
| `lib/seo/schema-helpers.ts` | JSON-LD builders |

## New Programmatic SEO Routes (additive)

| Public URL | App path | Entity type |
|------------|----------|-------------|
| `/universities/[slug]` | `app/(seo)/universities/[universitySlug]/page.tsx` | university |
| `/universities/[slug]/pg` | `.../pg/page.tsx` | university_pg |
| `/universities/[slug]/hostel` | `.../hostel/page.tsx` | university_hostel |
| `/universities/[slug]/flats` | `.../flats/page.tsx` | university_flat |
| `/cities/[citySlug]` | `app/(seo)/cities/[citySlug]/page.tsx` | city |
| `/cities/[citySlug]/[localitySlug]` | `.../[localitySlug]/page.tsx` | locality |
| `/landmarks/[slug]` | `app/(seo)/landmarks/[landmarkSlug]/page.tsx` | landmark |
| `/roads/[slug]` | `app/(seo)/roads/[roadSlug]/page.tsx` | road |
| `/societies/[slug]` | `app/(seo)/societies/[societySlug]/page.tsx` | society |
| `/buildings/[slug]` | `app/(seo)/buildings/[buildingSlug]/page.tsx` | building |
| `/builders/[slug]` | `app/(seo)/builders/[builderSlug]/page.tsx` | builder |
| `/compare/[slug]` | `app/(seo)/compare/[slug]/page.tsx` | comparison |
| `/guides/[slug]` | `app/(seo)/guides/[slug]/page.tsx` | guide |
| `/tools/[slug]` | `app/(seo)/tools/[slug]/page.tsx` | calculator |

## Safe Extension Rules

1. Never remove or replace existing page components — append sections below fold.
2. Use `isProtectedRoute()` before any redirect/canonical override.
3. New SEO pages use `shouldIndexSeoPage()` — empty inventory → noindex unless guide/calculator/comparison.
4. Canonical always via `buildPageMetadata` / `canonicalUrl` on the page's own path.
5. Sitemap: append only; never remove `getCoreMarketingSitemapSlugs()` or GSC paths.
