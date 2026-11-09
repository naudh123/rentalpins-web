# RentalPins — SEO research: getting listings onto Google page 1

**Date:** 2026-11-09 · **Scope:** live crawl of www.rentalpins.com as Googlebot, every sitemap, sample listing, city, locality and category pages, code review of the listing route, and a check of who ranks for the target searches.

---

## 0. Search Console data (Web search, 2026-08-08 → 2026-11-07)

Source: GSC Performance export (`Performance-on-Search-2026-11-09.xlsx`). It contains the top 1,000 queries and the top 1,000 pages.

### Headline numbers

| Metric | Value |
|---|---|
| Clicks / impressions (92 days) | **1,955 / 108,368**, CTR 1.8% |
| India | 1,744 clicks, 70.8k impressions, average position 10.2 |
| United Kingdom | **24 clicks from 26.4k impressions**, average position 33 |
| Mobile vs desktop | Mobile gives 83% of clicks (position 11.6). Desktop sits at position 24.7, mostly from UK impressions. |
| Brand ("rental pins", "rentalpins") | About 390 clicks, position 1.0, CTR 70–76% ✅ |

### 🔴 Traffic has fallen by half since late August

| Week of | Clicks | Impressions | Average position |
|---|---|---|---|
| Aug 8 | 247 | 12.6k | 11.7 |
| Aug 15 | 260 | 13.1k | 12.2 |
| Sep 5 | 141 | 8.3k | 12.6 |
| Sep 26 | **73** | 5.3k | 18.8 |
| Oct 17 | 146 | 7.3k | 21.7 |
| Oct 31 | 79 | 6.7k | 28.6 |

- No commit on any branch of this repo falls between 2026-08-20 and 2026-10-10, so a code change here does not explain the drop. Check GSC for these other causes:
  - a Google core or spam update in that window (see the Google Search Status Dashboard)
  - a deploy made from another repo, such as the Flutter app or Firebase
  - the Pages report, for a jump in "Crawled – currently not indexed"
- Part of the rise in average position (11.7 → 28.6) is dilution: the London pages earn many impressions at position 35–70. Clicks also fell from about 250 to about 100 a week, so the drop is real and not only dilution.

### Which page types earn clicks

| Page type | Pages | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|---|
| `/universities/*` | 27 | **563** | 18.7k | 3.0% | 7.1 |
| Home | 1 | 431 | 1.2k | 36% | 4.1 |
| Blog | 38 | 193 | 14.7k | 1.3% | 9.4 |
| Locality / category hubs | 203 | 185 | 19.2k | 1.0% | 13.1 |
| Projects | 82 | 138 | 9.1k | 1.5% | 9.9 |
| International `/rentals/{uk,ke}/…` and `/commercial/london` | 237 | 138 | **40k** | 0.3% | 30+ |
| Student landings (`/pg-near-*`) | 12 | 78 | 3.7k | 2.1% | 7.9 |
| **Listings** | **247** | **66** | 3.7k | 1.8% | 8.4 |
| City hubs | 6 | 54 | 3.1k | 1.8% | 14.2 |

**What this shows:**
1. **Listings bring only about 3% of clicks.** Only 42 listings got even one click. When a listing does rank, it ranks well (position 8.4), but very few listings get impressions at all. This confirms C3 (orphan listings) and H1/H2 (thin listing pages).
2. **The pages that actually win are the student pages** (`/universities/*`, `/pg-near-*`, student blogs), at position 5–8. That is your topic authority. Pull listings into those pages and link out to them: "12 live PGs near Chandigarh University" with a card for each listing.
3. **The UK and London pages are a quality drain.** 62 URLs drew 27.5k impressions and 22 clicks, at position 20–70. `/commercial/london` alone had 10.2k impressions and 2 clicks, and it is `index, follow` with almost no inventory. Set `noindex` on international hubs until each one has at least N live listings. Thin pages at scale pull down site-wide quality, which is a likely factor in the decline.

### Proof of the duplicate-URL bug (C1)

- **55 `/listings/…` URLs** and **50 `?from=` URLs** are getting impressions in Google.
- **31 listing IDs appear in GSC under 2–3 different URLs.** For example, listing `T4MNNO0snZmjnapOa5it` shows up as:
  - `/rentals/property/2-bhk-furnished-sector-76-…-T4MNNO0snZmjnapOa5it`
  - `/listings/spacious-2bhk-fully-furnished-flat-in-dr-ambedka-in-mohali-T4MNNO0snZmjnapOa5it`
  - `/listings/spacious-2-bhk-…-T4MNNO0snZmjnapOa5it?from=/listings/2bhk-…`
- **How `?from=` gets created:** [ListingBackLink.tsx:38](../components/listings/ListingBackLink.tsx:38) reads a `from` query parameter that listing-to-listing links append. Pass the return path through sessionStorage instead (`readListingReturnPath()` already exists), so crawlable links stay clean.
- `/listings/*` should return a real 308 (see C1). Right now it returns 200 with a meta refresh, and Google indexes it.

### Easy wins: ranking 5–10 with low CTR

Each of these already ranks, so a better title and a sharper meta description (with a price and a live count) can double clicks without any move in position.

| Query | Impressions | Clicks | Position | Ranking page |
|---|---|---|---|---|
| pg near chandigarh university | 1,169 | 21 | 7.8 | `/universities/chandigarh-university/pg` (5.3k impressions, 1.8% CTR) |
| pg near chitkara university | 344 | 7 | 6.8 | `/universities/chitkara-university/pg` |
| pg near chandigarh university for girls / girls pg near cu | 626 | 10 | 7.0 | `/blog/pg-near-chandigarh-university-for-girls` (1.7k impressions, 1.6%) |
| pg near panjab university chandigarh | 263 | 9 | 6.5 | `/universities/panjab-university/pg` |
| flats near chandigarh university | 263 | 5 | 7.5 | `/universities/chandigarh-university/flats` |
| rent agreement format | 262+98 | 7 | 8.3 | `/blog/house-rent-agreement-format-india` (1.9k impressions, position 17) |
| medallion nova | 382 | 2 | 10.6 | `/projects/mohali/medallion-nova` |
| sbp industrial park dadiana | 335 | 1 | 4.3 | `/projects/banur/sbp-industrial-park-tepla` |
| flats for rent in mohali / flat / apartment | 80 | 1 | 12–13 | `/rentals/in/chandigarh/mohali` |
| *(Lucknow)* | 4,984 | 11 | 8.4 | `/rentals/in/lucknow/flats`: **0.22% CTR**, so the snippet is not working |
| *(Delhi)* | 2,834 | 13 | 12.1 | `/rentals/in/delhi/flats` |
| *(Ludhiana)* | 646 + 606 | **0** | 10–12 | `/rentals/in/ludhiana/flats`, `/rentals/in/ludhiana` |

**Rewrite the titles in this pattern:**
`PG near Chandigarh University (Gharuan) — 40+ Verified PGs from ₹5,500 | Girls & Boys`.
Put the current listing count and the lowest price in the title or meta description, and refresh them daily.
The CU cluster alone (87 queries, 5.3k impressions, position 7.7) would go from about 105 to about 300 clicks per quarter if it moves to position 3–4.

Generic terms like "apartment rental listings" (5.7k impressions) and "where to find apartments" (3.1k), both around position 8.5 with 0 clicks, are probably non-India traffic and not worth chasing.

---

## 1. Executive summary

Most of the technical groundwork is already done. The host redirects to `www`, canonicals point to one URL per listing, robots.txt is clean, there are 7 sitemaps covering about 2,600 URLs, city pages carry 3,000+ words, and pages already output Breadcrumb, Offer and Residence structured data.

So listings are not held back by missing SEO tags. Five things are holding them back:

1. **Wrong status codes on `/listings/{id}`.** Redirects and not-found pages are served as **HTTP 200**, so Google sees duplicate pages and soft 404s.
2. **Listings are orphans.** Each city or locality hub links to only about 20 listings and has no pagination. Roughly **1,400 of 1,500 listings can only be found through the sitemap**, and Google gives those pages little ranking weight.
3. **Listing titles leave out the location.** Google matches searches like "2 BHK for rent in Sector 70 Mohali" mainly on the title. Today titles look like *"Charming 2BHK House for Rent in Prime Location"*.
4. **Listing pages are thin and similar to each other.** About 400 words, mostly boilerplate. Some junk listings are also indexed, for example *"Stage for rent in Location set · ₹10 per day"*.
5. **The site has little authority outside student searches.** Search Console shows RentalPins at #1 for its brand name and at positions 5–8 for student-PG searches (see section 0). For generic searches like "flats for rent in Mohali", it sits at position 12–13, and Housing.com, HexaHome, PropertyScroll and RealEstateIndia hold page 1.

Fix 1–4 in code, which is about 1–2 sprints of work. Then spend 3–6 months on item 5: links, Google Business Profile, and more fresh listings.

> Note on keyword placement: for a small portal, the **locality + category hub pages** (`/rentals/in/chandigarh/mohali/pg`) are what can realistically reach page 1. Individual listings rank for long-tail searches like "1 RK near Chandigarh University ₹6000". Design for both, but expect the hubs to bring most of the traffic.

---

## 2. What is already good

| Area | Status |
|---|---|
| `rentalpins.com` → `www` | 301 ✅ |
| robots.txt | Private routes blocked, AI bots allowed, all sitemaps declared ✅ |
| Canonical on listings | `/rentals/property/{slug}-{id}` ✅ |
| Legacy `/{id}` | 308 to the canonical URL ✅ |
| `/rentals/property/{bad}` | Real 404 ✅ |
| City and locality hubs | 2,900–3,400 words, H2 structure, FAQ, LocalBusiness and City schema ✅ |
| Programmatic pages | 298 locality×category URLs in the sitemap ✅ |
| Listing schema | Offer, Residence/Product, Geo, BreadcrumbList ✅ |
| Server-rendered HTML | Description, price and H1 appear in the raw HTML ✅ |
| Sitemap lastmod | Real dates, recent ✅ |

---

## 3. Critical issues (fix first)

### C1. `/listings/[id]` returns 200 for both redirects and 404s 🔴

Evidence from a live check with a Googlebot user agent:

```
/listings/Vf8D1t5jDRoBMWrIhNUV  -> HTTP 200, 42 words, <meta http-equiv="refresh" ...>  (should be 308)
/listings/doesnotexist123       -> HTTP 200, noindex, "Listing not found"            (should be 404/410)
/rentals/property/fake-xxx      -> HTTP 404  (correct: this route has no loading.tsx)
```

**Cause:** [app/listings/[id]/loading.tsx](../app/listings/[id]/loading.tsx) makes the route stream its response. By the time `permanentRedirect()` or `notFound()` runs inside [ListingDetailRoute.tsx](../components/listings/ListingDetailRoute.tsx), the 200 header has already been sent. Next.js then falls back to a meta refresh or an in-page 404.

**Effect:** Google gets one thin 200 page per old link, logs soft 404s for expired listings, and splits ranking signals between two URLs. This is very likely behind the *"Duplicate, Google chose different canonical"* reports.

**Fix:**
- Delete `app/listings/[id]/loading.tsx`, or move the lookup that decides on a redirect or 404 into `middleware.ts`, which already holds the legacy-redirect logic.
- Remove the 16 `/listings/...` URLs from `sitemap-listings.xml` and list only canonical URLs.
- Expired or removed listings should **410**, or 301 to their locality hub when the area is known.

### C2. Two listing sitemaps 🔴

`/listing-sitemap.xml` (1,526 URLs) and `/sitemap-listings.xml` (1,503 URLs) both exist and differ slightly. robots.txt declares only the second. Delete the first, or 301 it to the second, and remove it from Search Console if it was submitted there.

### C3. No pagination on hubs, so listings are orphans 🔴

City and locality pages each link to about 20 listings. `?page=2` returns the same page with a canonical back to page 1. Google mostly crawls and ranks what it can reach by following links, so listings that appear only in a sitemap get low priority and are often left as *"Discovered – currently not indexed"*.

**Fix:**
- Add crawlable pagination on every city, locality and category hub, for example `/rentals/in/chandigarh/mohali/page/2` or `?page=2`. Each page should canonical to **itself**, carry a unique title such as "… – Page 2", and use plain `<a href>` links.
- Give the listing page a breadcrumb of **City › Locality › Category › Listing**, where every level is a link. Today a listing outside a configured city shows only `Home › Rentals › title`. [lib/listing-breadcrumbs.ts](../lib/listing-breadcrumbs.ts) should fall back to the nearest live city by coordinates.
- Add "Similar in {locality}" and "More {category} in {city}" blocks with 6–12 links each. The 4 similar-listing links that exist today are a start.

### C4. Listing `<title>` and H1 omit the location 🔴

`generateMetadata` uses `listingShareMetadata()`, which builds the title from the owner's text. The SEO title builder in [lib/seo/listing-seo.ts](../lib/seo/listing-seo.ts) (`seoTitle`, which includes locality and city) is computed but not used for `<title>`.

| Live title | Recommended |
|---|---|
| Charming 2BHK House for Rent in Prime Location · ₹12,000 per month | 2 BHK House for Rent in Sector 14, Udaipur · ₹12,000/month |
| 1BHK Semi-furnished House for rent · ₹13,000 · Bengaluru Metro, Bengaluru Metro | 1 BHK Semi-Furnished House for Rent in {Locality}, Bengaluru · ₹13,000 |
| Stage for rent in Location set · ₹10 per day | *(noindex: fails quality gate)* |

**Title formula:** `{BHK} {Furnishing} {Type} for Rent in {Locality}, {City} · ₹{rent}/month` (keep it under about 60 characters before `| RentalPins`).
Keep the owner's title as the H1 or as a subtitle, but make the H1 contain the type and locality too. Remove repeated place names ("Bengaluru Metro, Bengaluru Metro").

**URL slugs:** 176 listing slugs have no location, for example `shop-JNwQ…`, `plot-qm22…`, `office-space-…`. When the locality can be resolved, build the slug as `{type}-{locality}-{city}-{id}`. The current code 308s old slugs to the canonical one, so this change is safe.

---

## 4. High-impact improvements

### H1. Listing quality gate (index only listings worth indexing)

Set `noindex,follow` and leave a listing out of the sitemap when **any** of these is true:
- description is under 40 words, or the location is a placeholder ("Location set", blank)
- price is ₹0 or an obvious test value (₹10/day for a stage)
- no photo
- older than N days with no owner activity, or marked rented

This stops low-quality pages from pulling down the site-wide quality score, which is the main reason new portals stall.

### H2. Make each listing page unique (aim for 600+ useful words)

Add data-driven blocks that change per listing:
- **Key facts table:** rent, deposit, maintenance, BHK, area in sq ft, furnishing, floor, available from, preferred tenants, parking. These also feed schema.
- **"About {Locality}"** paragraph pulled from the locality hub, plus a link to it.
- **Nearby places with distances** (metro, colleges, hospitals). Some owners already write these, for example "0.1 km from The Santa Kidz School". Generate them automatically from coordinates.
- **Rent comparison:** "This 2 BHK is ₹2,000 below the median 2 BHK in Mohali (₹14,000)". No competitor offers this, and it is your own data.
- **Alt text** on every photo, not only photo 1: `"{title} — {room} photo {n}, {locality}"`.
- Move the review form below the fold or into a client island. "Sign in to rate… 0/300 Post review" is boilerplate text Google reads as page content.

### H3. Structured data upgrades

- Add `"@type": ["Residence","Apartment"]` or `SingleFamilyResidence` with `numberOfRooms`, `floorSize` and `amenityFeature`, and wrap it in a **`RealEstateListing`** with `datePosted` and `offers.priceSpecification` (`UnitPriceSpecification`, `unitText: "MONTH"`).
- On hub pages, use an `ItemList` of listings (Mohali already has this; extend it to all cities).
- Since 2023 FAQPage markup no longer produces rich results for non-government and non-health sites. It does no harm, but don't expect a SERP feature from it.
- Validate with the Rich Results Test after deploying.

### H4. Hub-page fixes

- The city meta descriptions are two sentences joined together and repeat themselves, for example Bengaluru's has *"Contact owners directly on RentalPins. Contact owners directly on RentalPins."* The Chandigarh description is about 300 characters. Rewrite them to 140–155 characters with a live count: *"312 verified flats, PG & houses for rent in Mohali from owners. Map search, no brokerage. Updated today."*
- Put the **live listing count and the latest price** in the title or H1. Freshness drives clicks.
- Build out the combinations competitors rank for. HexaHome ranks with pages like `2-bhk-flats-for-rent-in-mohali`, `flats-for-rent-under-15000-in-sector-80-mohali`, `furnished`, `for-bachelors` and `for-girls`. You have locality×category pages; add **BHK**, **budget band**, **furnishing** and **tenant type** facets. Index a facet page only when it has at least 3 live listings; noindex it below that.

### H5. Performance and crawl

- Listing and hub HTML is served with `Cache-Control: private, no-store`, so every Googlebot hit renders on the server. Use ISR or a revalidate of about 5–15 minutes on listing and hub pages. TTFB is fine today (about 0.4 s), but this will matter as the crawl rate grows.
- Pages weigh 110–215 KB of HTML. Defer the map ("Loading map…") and the review widget.
- Measure Core Web Vitals in Search Console under **Core Web Vitals**, or in PageSpeed Insights. The PageSpeed API quota was exhausted while I ran this check, so the score is not included here.

### H6. `app.rentalpins.com/robots.txt` returns 404

The `Disallow: /` template in [docs/hosting/app.rentalpins.com-robots.txt](hosting/app.rentalpins.com-robots.txt) was never deployed, so the Flutter embed URLs can still be crawled. Deploy it on Firebase Hosting.

---

## 5. Competitive landscape

Searches I checked: "flats for rent in Mohali no broker", "PG near Chandigarh University Kharar", "rentalpins.com rentals". The search tool is US-based, so use Search Console data from India as the source of truth.

| Query | Who holds page 1 | Why they win |
|---|---|---|
| flats for rent in Mohali no broker | Housing.com (sector-level pages and individual listings), HexaHome (BHK, budget and furnishing facet pages) | Huge domain authority, plus a facet page for every combination |
| PG near Chandigarh University Kharar | Housing.com PG listings, RealEstateIndia, PropertyScroll | Title matches the query word for word ("PG for girls in Kharar, Mohali"), plus a price in the snippet |
| rentalpins (brand) | RentalPins is #1 in Google (GSC: 72–76% CTR). The US-based search tool I used did not show it. | Brand ranks fine in India. What's missing is non-brand authority. |

**Where RentalPins can win:** hyper-local student and PG searches in Tricity and Ludhiana (CU, CGC Landran, LPU, PAU, GNDEC), commercial and industrial rentals in Ludhiana (warehouse, factory shed, godown), and non-property rentals (vehicles, equipment), where the big portals are weak. Put content and links here before going after Bengaluru or Gurugram head terms, where Housing, NoBroker, MagicBricks and 99acres dominate.

---

## 6. Authority and off-page plan (months 1–6)

1. **Google Business Profile** for RentalPins (Chandigarh/Mohali office), with the website link and listings posted weekly.
2. **Brand entity:** consistent NAP, `sameAs` in the Organization schema pointing to LinkedIn, Instagram, Facebook, YouTube and the Play Store/App Store pages, plus a Crunchbase entry.
3. **Local links:** college student groups and placement cells (CU, CGC, LPU PG guides), local news (Tribune Chandigarh, Babushahi, Dainik Bhaskar Punjab), real-estate forums, Ludhiana industrial associations.
4. **Linkable data assets:** a quarterly *"Tricity Rent Report"* (median rent by sector and BHK, from your own listings). Journalists link to data, and this works well for local press.
5. **Owner-side sharing:** each listing's WhatsApp share already brings visits. Add a "Share your listing" link on Facebook groups, which are a big rental channel in Punjab.
6. **Fix the indexing basics first** (section 3). Links to a site with soft 404s and orphan pages are partly wasted.

---

## 7. Search Console checklist (manual)

- [ ] Submit only `sitemap.xml`, `sitemap-cities.xml`, `sitemap-localities.xml`, `sitemap-listings.xml`, `sitemap-projects.xml`, `sitemap-blog.xml`, `category-sitemap.xml`. Remove `listing-sitemap.xml`.
- [ ] Pages report: export *"Crawled – currently not indexed"* and *"Discovered – currently not indexed"*, then check how many are `/rentals/property/*`. That is the baseline for C3 and H1.
- [ ] URL-inspect 5 listings and 5 locality hubs after the C1–C4 deploy, and request indexing.
- [ ] Performance report: filter queries containing `pg`, `bhk`, `rent`, `flat` by page type, and track weekly.
- [ ] Set up a Bing Webmaster Tools import and IndexNow for listings (instant pings on create and delete).

---

## 8. Prioritized roadmap

| # | Task | Effort | Impact | Where |
|---|---|---|---|---|
| 0 | Find the cause of the click decline since Aug 20 (GSC Pages report, Google updates, deploys from other repos) | S | 🔴 Very high | GSC |
| 0b | Noindex thin international hubs (`/commercial/london/*`, `/rentals/uk/*`, `/rentals/ke/*`) until they have real inventory | S | 🔴 High | international routes |
| 0c | Rewrite titles/metas on `/universities/*/pg`, Lucknow/Delhi/Ludhiana flats hubs with live count + price | S | High | `lib/seo/seoData.ts`, city configs |
| 0d | Drop `?from=` from crawlable listing links | XS | Medium | `components/listings/*` |
| 1 | Real 308/404/410 on `/listings/[id]` (remove `loading.tsx` or move to middleware) | S | 🔴 Very high | `app/listings/[id]/`, `middleware.ts` |
| 2 | Drop duplicate `listing-sitemap.xml`; canonical-only URLs in listing sitemap | S | High | `app/listing-sitemap.xml`, `app/sitemap-listings.xml` |
| 3 | Location-first listing `<title>` / meta / slug | S | 🔴 Very high | `lib/listing-share-meta-copy.ts`, `lib/seo/listing-seo.ts` |
| 4 | Listing quality gate (noindex + sitemap exclusion) | M | High | `lib/seo/programmatic-indexability.ts`, sitemap routes |
| 5 | Paginated hubs + full breadcrumb + more internal links | M | 🔴 Very high | `app/rentals/[country]/[city]/**`, `lib/listing-breadcrumbs.ts` |
| 6 | Unique listing content blocks (facts table, nearby, rent comparison, alts) | M | High | `components/listings/` |
| 7 | RealEstateListing schema + ItemList on every hub | S | Medium | `lib/seo/listing-schema.ts` |
| 8 | Hub meta description cleanup + live counts in titles | S | Medium | `lib/seo/*city*`, cities config |
| 9 | BHK / budget / furnishing / tenant facet pages (gated by ≥3 listings) | L | High | programmatic routes |
| 10 | ISR on listing and hub pages | S | Medium | route segment config |
| 11 | Deploy app-host robots.txt | XS | Medium | Firebase Hosting |
| 12 | GBP, brand entity, rent-report PR, local links | Ongoing | 🔴 Very high (long term) | Marketing |

**Expected timeline:** after items 1–5 ship, indexed listing count should rise over 2–6 weeks. Locality hubs in Tricity and Ludhiana can realistically reach page 1 for long-tail and student searches in 2–4 months. Competitive head terms ("flats for rent in Mohali") need the authority work and usually take 6–12 months.
