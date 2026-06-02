# Indexing recovery report — RentalPins

**Date:** 2026-06-01  
**Search Console property:** `rentalpins.com` / `www.rentalpins.com`  
**Primary symptom:** Pages *crawled – currently not indexed* with reason *Duplicate, Google chose different canonical than user*

---

## 1. Duplicate routes found

| Duplicate family | Example URLs | Canonical winner |
|------------------|--------------|------------------|
| **App embed (Flutter)** | `app.rentalpins.com/?web=1&listing=ID&embed_parent=www…` | `https://www.rentalpins.com/listings/ID` |
| **Legacy listing path** | `www.rentalpins.com/{listingId}` | `www.rentalpins.com/listings/{listingId}` (308 redirect) |
| **Legacy rentals path** | `/rentals/chandigarh` | `/rentals/in/chandigarh` (308) |
| **Coming-soon NCR hub** | `/rentals/in/ncr` | `/rentals/in/delhi` (canonical + noindex) |
| **Bare vs www host** | `https://rentalpins.com/...` | `https://www.rentalpins.com/...` (301) |
| **Map ad deep links** | `/search?lat=30.69&lng=76.72&north=…` | `/search` (canonical; URL noindex) |
| **City vs locality (soft)** | `/rentals/in/delhi` vs `…/jasola` | Both valid; Google may merge broad queries to city |

---

## 2. Canonical fixes applied

| Fix | Impact |
|-----|--------|
| `canonicalForCity()` — NCR → Delhi | Stops fighting Delhi hub for NCR intent |
| `robotsForCity()` — `noindex,nofollow` on coming-soon | NCR drops out of index queue |
| `robotsForSearchPage()` — noindex when map params present | Facebook ad URLs won’t pollute index |
| `listingCanonicalUrl()` always `www` + `/listings/{id}` | Single listing URL in metadata & OG |
| `resolveSiteUrl()` blocks localhost in production | Sitemap/canonical host safety |
| Middleware 301: `rentalpins.com` → `www` | Host consolidation |
| Middleware 301: `app.rentalpins.com?listing=` → `www/listings/` | Embed URL consolidation (if app DNS on Vercel) |

Every indexable route uses `alternates.canonical` via `generateMetadata` or `buildPageMetadata`.

---

## 3. App indexing fixes

### Problem

Google crawled **hundreds** of `app.rentalpins.com` embed URLs (query params: `web`, `skipSplash`, `listing`, `embed_parent`, `v`).

### Actions

| Action | Owner | Status |
|--------|-------|--------|
| `docs/hosting/app.rentalpins.com-robots.txt` — `Disallow: /` | Firebase Hosting (Flutter app) | **Template ready — deploy on app host** |
| Middleware 301 listing deep links → www | Next.js (if app points to Vercel) | **Implemented** |
| Internal links use `/listings/{id}` only | Next.js | **Verified** |
| Exclude app URLs from all www sitemaps | Next.js | **Never included** |

### After app robots deploy

- New `app.rentalpins.com` URLs should stop appearing in GSC.
- Existing rows may remain 90 days; use **Removals** only if urgent (usually unnecessary).

---

## 4. Sitemap fixes

| Before | After |
|--------|-------|
| All cities in `city-sitemap.xml` (including NCR) | **`getLiveCities()` only** |
| All areas via `getAllAreas()` | **`getIndexableAreas()`** (live cities only) |
| Listings at `/listings/{id}` | Unchanged ✓ |
| localhost URLs (historical) | Fixed via `lib/config.ts` (prior deploy) |

**Submit in GSC (www property):**

- `https://www.rentalpins.com/sitemap.xml`
- `https://www.rentalpins.com/city-sitemap.xml`
- `https://www.rentalpins.com/locality-sitemap.xml`
- `https://www.rentalpins.com/listing-sitemap.xml`

---

## 5. Page-level audits

### `/rentals/in/ncr` (rejected)

| Attribute | Value |
|-----------|--------|
| Status in CMS | `coming-soon`, no areas |
| User canonical (new) | `https://www.rentalpins.com/rentals/in/delhi` |
| Robots | `noindex,nofollow` |
| Sitemap | **Removed** |
| Recovery | Stop submitting; optional 301 to Delhi later when NCR launches |

### `/rentals/in/delhi/jasola` (rejected)

| Attribute | Value |
|-----------|--------|
| Status | Live locality under live Delhi |
| User canonical | `https://www.rentalpins.com/rentals/in/delhi/jasola` |
| Content | 6+ long-form blocks in `AreaClient` (guide, connectivity, landmarks, rent trends, nearby, FAQs) |
| Likely Google choice | `/rentals/in/delhi` for generic “Delhi rentals” queries |
| Recovery | Request indexing after deploy; build internal links from Delhi hub → Jasola |

### Facebook ad URL

`https://www.rentalpins.com/search?lat=…&north=…`

| Attribute | Value |
|-----------|--------|
| Purpose | Paid traffic — not SEO landing |
| Canonical | `/search` |
| Robots (with params) | `noindex,follow` |
| Recovery | No action needed in GSC for ad URLs |

---

## 6. Locality content template expansion

`lib/seo/content-templates.ts` — `buildAreaSeoSections()` now includes:

1. **Overview** — hero + hub context  
2. **Connectivity** — commute / sub-pockets  
3. **Landmarks** — facilities + bullets  
4. **Rent trends** — pricing behaviour  
5. **FAQs** — from area config  
6. **Nearby localities** — comparison workflow  
7. **Popular categories** — category bullets  

`AreaClient.tsx` already renders richer on-page copy for sub-areas (mirrors this structure).

---

## 7. Pages likely to recover indexing

**High confidence (after deploy + 2–6 weeks):**

- Live city hubs: `/rentals/in/chandigarh`, `/rentals/in/ludhiana`, `/rentals/in/delhi`, etc.
- Live localities with listings: Jasola, Mohali, Sarabha Nagar, etc.
- `/listings/{id}` for active listings in `listing-sitemap.xml`
- Marketing pages in main `sitemap.xml`

**Will not recover (by design):**

- `/rentals/in/ncr` until launched as live city with unique content  
- `app.rentalpins.com/*` after app robots.txt  
- `/search?lat=…` ad URLs  
- Auth/post/chat/profile routes  

**Needs manual GSC “Request indexing” after deploy:**

- `/rentals/in/delhi/jasola`  
- Top 10 locality URLs by business priority  
- `/rentals/in/delhi` (city hub)

---

## 8. Monitoring plan

| Week | Action |
|------|--------|
| 0 | Deploy Next.js + app `robots.txt` |
| 1 | GSC → Pages → “Duplicate, Google chose different canonical” — count should plateau |
| 2–4 | URL inspect 5 priority localities — confirm “User-declared canonical” = “Google-selected” |
| 4–8 | Indexed locality count should rise in Performance report |

**GA4 (optional):** Track organic landing on `/rentals/*` vs `/search`.

---

## 9. Tests

`lib/__tests__/indexing-policy.test.ts` — NCR exclusion, Delhi canonical, search noindex, Jasola in indexable areas.

Run: `npm test -- --run`

---

## 10. Summary

| Category | Result |
|----------|--------|
| Duplicate routes | Documented; 301 + noindex + app robots |
| Canonical fixes | Centralized in `indexing-policy.ts` + existing `canonicalUrl()` |
| App indexing | Robots template + middleware 301 |
| Sitemap | Live cities/areas only |
| NCR | noindex + canonical to Delhi |
| Jasola | Valid; await recrawl + internal links |
| Content | Area SEO sections expanded |

**Next human step:** Deploy `app.rentalpins.com` `robots.txt` on Firebase Hosting, then push `rentalpins-web` to production.
