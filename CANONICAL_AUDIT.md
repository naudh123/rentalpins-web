# RentalPins canonical & indexing audit

**Property:** `www.rentalpins.com` (Next.js) · **Project:** `rent-it-dev-6bcfd`  
**Audit date:** 2026-06-01  
**GSC symptom:** *Crawled – currently not indexed* · *Duplicate, Google chose different canonical than user*

---

## 1. Executive summary

| Issue | Root cause | Fix status |
|-------|------------|------------|
| `app.rentalpins.com` deep links in GSC | Legacy Flutter web embed URLs duplicate `www` listing pages | **Deploy** `docs/hosting/app.rentalpins.com-robots.txt` on app host; **301** on Vercel if app DNS points here |
| `/rentals/in/ncr` rejected | Coming-soon hub overlaps Delhi; thin + duplicate intent | **noindex,nofollow** + canonical → `/rentals/in/delhi`; **removed from sitemaps** |
| `/rentals/delhi/jasola` rejected | Competes with city hub / category URLs; consolidation | **Canonical OK**; locality content already strong in `AreaClient`; sitemap retained |
| Facebook ad `/search?lat=…` | Parameterized map URLs | **noindex,follow** when viewport query present; canonical stays `/search` |

**Chosen canonical host:** `https://www.rentalpins.com` (never bare `rentalpins.com`, never `app.rentalpins.com`).

---

## 2. Canonical generation map

| Mechanism | Location | Output |
|-----------|----------|--------|
| `siteUrl` + `canonicalUrl(path)` | `lib/config.ts`, `lib/seo.ts` | Absolute `https://www.rentalpins.com{path}`; localhost blocked in production builds |
| `buildPageMetadata()` | `lib/seo/metadata.ts` | `alternates.canonical` + robots |
| `listingCanonicalUrl()` | `lib/listing-share.ts` | `/listings/{id}` |
| `canonicalForCity()` | `lib/seo/indexing-policy.ts` | NCR → Delhi canonical |
| `metadataBase` | `app/layout.tsx` | Site-wide base URL |
| Per-route `generateMetadata` | `app/**/page.tsx` | Page-level canonical |

### Verified canonical patterns (indexable)

| Page type | Canonical URL pattern |
|-----------|------------------------|
| Home | `/` |
| Map search (clean) | `/search` |
| Map search (ad deep link) | `/search` (page **noindex** when `lat`/`lng`/`bounds` present) |
| Rentals index | `/rentals` |
| City hub | `/rentals/{country}/{city}` |
| Locality | `/rentals/{country}/{city}/{area}` |
| City category hub | `/rentals/{country}/{city}/{category}` |
| Locality + category | `/rentals/{country}/{city}/{area}/{category}` |
| Listing (primary) | `/listings/{id}` |
| Legacy `/{listingId}` | **301** → `/listings/{id}` |
| Blog | `/blog/{slug}` |
| Marketing slugs | `/{slug}` via `buildPageMetadata` |

### Intentionally non-indexable (canonical still set)

| Page type | Robots | Canonical |
|-----------|--------|-----------|
| Coming-soon city (NCR) | `noindex,nofollow` | `/rentals/in/delhi` |
| Auth, post, chat, profile | `disallow` in `robots.ts` | N/A |
| Owner `/u/{uid}` | `noindex,follow` | `/u/{uid}` |
| Legacy listing metadata route | `noindex` on `/{id}` before redirect | `/listings/{id}` |

---

## 3. Duplicate route structures

### Resolved by 301 (middleware)

| Legacy URL | Canonical | Code |
|------------|-----------|------|
| `/rentals/{city}` | `/rentals/{country}/{city}` | `middleware.ts` |
| `/rentals/{city}/{area}` | `/rentals/{country}/{city}/{area}` | `middleware.ts` |
| `/privacy`, `/refunds`, `/terms-of-service` | Legal paths | `middleware.ts` |
| `/blog/{old-slug}` | `/blog/{canonical-slug}` | `middleware.ts` |
| `rentalpins.com/*` | `www.rentalpins.com/*` | `middleware.ts` (301) |
| `app.rentalpins.com/?listing={id}` | `www.rentalpins.com/listings/{id}` | `middleware.ts` (301, when app host hits Next) |

### Not duplicates (different intent)

| URL A | URL B | Notes |
|-------|-------|-------|
| `/rentals/in/delhi` | `/rentals/in/delhi/jasola` | City vs locality — both valid; Google may prefer city for broad queries |
| `/rentals/in/delhi/flats` | `/rentals/in/delhi/jasola/flats` | City-level vs area-level category hubs |
| `/search` | `/search?lat=…` | Same canonical `/search`; parameterized version **noindex** |

### True duplicates (external)

| URL | Canonical owner |
|-----|-----------------|
| `app.rentalpins.com/?web=1&listing=…&embed_parent=…` | `www.rentalpins.com/listings/{id}` |
| `/rentals/in/ncr` (coming soon) | `www.rentalpins.com/rentals/in/delhi` (user canonical + noindex) |

---

## 4. Sitemap generation

| Sitemap | Source | Indexable URLs |
|---------|--------|----------------|
| `sitemap.xml` | `app/sitemap.ts` | Core marketing + static pages |
| `city-sitemap.xml` | `app/sitemap-cities.xml/route.ts` | **`getLiveCities()` only** + city category hubs |
| `locality-sitemap.xml` | `app/sitemap-localities.xml/route.ts` | **`getIndexableAreas()` only** + area category hubs |
| `listing-sitemap.xml` | `lib/seo/fetch-sitemap-listings.ts` | Active listings → `/listings/{id}` |
| `blog-sitemap.xml` | Blog slugs | `/blog/{slug}` |
| `category-sitemap.xml` | Marketing category pages | Programmatic marketing URLs |

**Removed from sitemaps (this audit):** `coming-soon` cities (e.g. **NCR**).

**Never included:** `app.rentalpins.com`, `/auth/*`, `/post/*`, `/chat/*`, `/search?lat=…`.

---

## 5. Robots.txt (`app/robots.ts`)

- **Production:** Allow `/`, disallow `/api/`, `/chat/`, `/profile/`, `/auth/`, `/post/`, saved paths.
- **Staging:** Disallow all.
- Lists all sub-sitemaps under `www.rentalpins.com`.

**App subdomain:** Use `docs/hosting/app.rentalpins.com-robots.txt` (`Disallow: /`) on Flutter/Firebase Hosting.

---

## 6. Internal links vs app subdomain

| Component | Links to |
|-----------|----------|
| `ListingsGrid` | `/listings/{id}` ✓ |
| `AreaClient` | Own locality/city paths on www ✓ |
| `lib/site-links.ts` | Social + www only ✓ |
| No `app.rentalpins.com` in Next.js link hrefs | ✓ |

---

## 7. GSC examples explained

### `app.rentalpins.com/...listing=...`

- Flutter web embed; duplicates listing detail.
- **Fix:** App `robots.txt` disallow + 301 to www when possible.

### `/rentals/in/ncr`

- `status: "coming-soon"`, zero areas, overlaps Delhi copy.
- **Fix:** `noindex,nofollow`, canonical → Delhi, out of city sitemap.

### `/rentals/delhi/jasola`

- Valid locality; canonical self-references `/rentals/in/delhi/jasola`.
- Google may temporarily prefer `/rentals/in/delhi` until locality signals strengthen.
- **Content:** Long-form sections in `AreaClient` (overview, connectivity, landmarks, rent trends, nearby, FAQs).

---

## 8. Code changes in this audit

| File | Change |
|------|--------|
| `lib/cities-config.ts` | `getLiveCities()`, `getIndexableAreas()`, `isCityIndexable()` |
| `lib/seo/indexing-policy.ts` | Robots + NCR canonical helper |
| `app/sitemap-cities.xml/route.ts` | Live cities only |
| `app/sitemap-localities.xml/route.ts` | Indexable areas only |
| `app/rentals/.../page.tsx` | `robots` + canonical policy on city/area/category |
| `app/search/page.tsx` | `noindex` for parameterized map URLs |
| `middleware.ts` | www + app.rentalpins.com 301 rules |
| `lib/seo/content-templates.ts` | Expanded `buildAreaSeoSections()` |
| `docs/hosting/app.rentalpins.com-robots.txt` | App host robots template |

---

## 9. Deployment checklist

1. Deploy Next.js to Vercel (`rentalpins-web` → `main`).
2. Upload **app** `robots.txt` on Firebase Hosting for `app.rentalpins.com`.
3. GSC → URL inspection → **Validate fix** on sample URLs after 2–4 weeks.
4. Confirm `NEXT_PUBLIC_SITE_URL=https://www.rentalpins.com` on Vercel.
5. Request re-index for priority URLs: `/rentals/in/delhi/jasola`, live city hubs.

---

## 10. Canonical URL standard (official)

```
https://www.rentalpins.com/rentals/{country}/{city}/{area?}/{category?}
https://www.rentalpins.com/listings/{listingId}
https://www.rentalpins.com/search   (no query string in canonical)
```

Do not use: `app.rentalpins.com`, bare `rentalpins.com`, `/{listingId}` in sitemaps, or `/rentals/{city}` without country.
