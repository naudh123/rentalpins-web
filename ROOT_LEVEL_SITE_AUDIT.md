# ROOT LEVEL SITE AUDIT — RentalPins

Date: 2026-06-01

## 1) Every route discovered

### Core pages
- `/`
- `/search`
- `/rentals`
- `/rentals/[country]/[city]`
- `/rentals/[country]/[city]/[area]`
- `/rentals/[country]/[city]/[area]/[category]`
- `/listings/[id]`
- `/[listingId]`
- `/u/[uid]`

### Auth / user / app pages
- `/auth/login`
- `/post`
- `/post/activate`
- `/profile`
- `/chat`
- `/saved-listings`
- `/saved-searches`

### Marketing / trust / legal
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/refund-policy`
- `/delete-account`

### Blog
- `/blog`
- `/blog/[slug]`
- `/blog/write`

### SEO landing pages
- `/rent-without-broker`
- `/flats-without-broker`
- `/house-for-rent-without-broker`
- `/property-without-broker`
- `/property-without-broker-ludhiana`
- `/property-without-broker-chandigarh`
- `/property-without-broker-mohali`
- `/property-without-broker-delhi`
- `/houses-without-broker`
- `/no-broker-rental-india`
- `/download-app`
- `/property-owner-app`
- `/tenant-app`
- `/rental-app-india`
- `/rentalpins-vs-nobroker`
- `/rentalpins-vs-magicbricks`
- `/rentalpins-vs-99acres`
- `/rentalpins-vs-housing`
- `/flats-for-rent`
- `/houses-for-rent`
- `/pg-for-rent`
- `/shops-for-rent`
- `/offices-for-rent`
- `/warehouse-for-rent`
- `/factory-shed-for-rent`
- `/commercial-property-for-rent`
- `/vehicles-for-rent`
- `/equipment-for-rent`
- `/godown-for-rent`
- `/industrial-property-for-rent`
- `/warehouse-for-rent-ludhiana`
- `/factory-shed-for-rent-ludhiana`
- `/industrial-property-ludhiana`
- `/warehouse-chandigarh`
- `/warehouse-mohali`
- `/rentals-near-me`
- `/flats-near-me`
- `/pg-near-me`
- `/shops-near-me`
- `/offices-near-me`
- `/warehouses-near-me`
- `/pg-near-cgc-landran`
- `/pg-near-chandigarh-university`
- `/pg-near-lpu`
- `/pg-near-gndec`
- `/pg-near-pau`
- `/pg-near-pec`

### SEO feeds / bots
- `/sitemap.xml`
- `/sitemap-cities.xml`
- `/sitemap-localities.xml`
- `/sitemap-listings.xml`
- `/sitemap-blog.xml`
- `/city-sitemap.xml`
- `/locality-sitemap.xml`
- `/listing-sitemap.xml`
- `/blog-sitemap.xml`
- `/category-sitemap.xml`
- `/robots.txt`
- `/feed.xml`
- `/llms.txt`

### API routes
- `/api/health`
- `/api/listings`
- `/api/listings/[id]/view`
- `/api/blog`
- `/api/blog/[slug]`
- `/api/cron/saved-search-alerts`

## 2) SEO issues discovered

- Private surfaces needed explicit noindex handling (`/post`, `/profile`, `/chat`, `/saved-*`) — addressed via route layouts.
- Sitemap segmentation gaps for city/locality/listing/blog/category discovered — addressed with dedicated XML endpoints and aliases.
- Coverage gaps for high-intent terms (no-broker, industrial, near-me, student clusters) — addressed by new landing families.
- Metadata consistency previously fragmented — centralized via `buildPageMetadata`.

## 3) Missing page opportunities discovered

- Category landing pages (`flats-for-rent`, `offices-for-rent`, etc.) — implemented.
- Industrial sub-vertical pages (`godown`, `factory-shed`, city-industrial pages) — implemented.
- Student acquisition pages near major colleges — implemented.
- Near-me intent pages for map USP — implemented.

## 4) Internal linking gaps discovered

- Homepage previously under-linked to no-broker + category money pages.
- Landing pages needed stronger related link clusters.
- Cross-linking between city hubs, category hubs, and specialized intent pages required.

Status: improved via homepage links + reusable related links in `MarketingLandingPage` and category hub components.

## 5) Conversion bottlenecks discovered

- Limited trust visibility on landing pages (social proof absent).
- Sparse CTA consistency between pages.
- Missing direct app install module on many growth pages.

Status: trust stats and repeated CTA patterns added on homepage and marketing templates.

## 6) Content gaps discovered

- City/locality pages had strong structure but some markets still need expanded editorial depth to full enterprise target word counts.
- Category pages for long-tail intent were absent.
- Student + industrial content clusters were missing.

Status: structural templates and page families implemented; further city-by-city deep copy expansion remains ongoing growth work.

## 7) Technical SEO gaps discovered

- Need multiple sitemap feeds + alias naming compatibility.
- Robots should reference all feeds and disallow private app paths.
- Need scalable metadata + schema surface for future pages.

Status: implemented through `lib/seo/*`, `components/seo/*`, expanded sitemaps and robots.

