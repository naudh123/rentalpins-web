# SEO & social preview QA checklist

Use this before and after SEO releases on [rentalpins.com](https://www.rentalpins.com).

## Listing social previews

- [ ] Open any listing URL (e.g. `/rentals/property/...`) → **View Page Source**
- [ ] `<link rel="canonical"` points to the full SEO slug URL
- [ ] `<meta property="og:title"` includes listing title, price, and location
- [ ] `<meta property="og:description"` uses listing description or composed fallback
- [ ] `<meta property="og:image"` is `/api/listing-og/{id}` when a cover photo exists
- [ ] `<meta property="og:image"` is `/og-default.jpg` when no cover photo
- [ ] `<meta name="twitter:image"` matches `og:image`
- [ ] Facebook Sharing Debugger and WhatsApp show the cover image (cache-bust with `?v=` if needed)

## Category pages

- [ ] `/rentals/in/ludhiana/houses` shows **only** Property listings matching houses/villas
- [ ] No vehicles, furniture, appliances, or machinery on category hubs
- [ ] Empty category shows “No {category} listed in {city} yet” with map + post CTAs
- [ ] Low-supply notice appears when 1–2 listings match

## CTA density (city / area / category)

- [ ] City and area pages: one owner CTA near top and one near bottom (via `AreaClient`)
- [ ] Category pages: hero CTA + bottom CTA only (no duplicate inline block)
- [ ] No three identical “Own a property…” sections on the same page

## Projects index

- [ ] `/projects` city pills use Tricity slugs (Mohali, New Chandigarh, Zirakpur, etc.)
- [ ] No duplicate city filter rows (rental hub cities vs project cities)
- [ ] Featured projects are not duplicated in the “All projects” grid
- [ ] `/projects/new-chandigarh` groups New Chandigarh / Mullanpur launches

## Homepage

- [ ] Hero “Live cities” count matches `getLiveCities().length`
- [ ] “Live India cities” lists only Indian live hubs
- [ ] “Global hubs” lists London, Nairobi, Lagos (etc.) separately
- [ ] Top cities grid matches first 8 live India cities

## Index preservation

- [ ] No redirects or slug changes on existing indexed URLs
- [ ] `robots.txt` and sitemaps still list city, university, blog, project, and listing URLs
- [ ] `searchViewQueryString` still excludes only `selectedId` and `drawnArea` (not viewport)

## Sitemap smoke test

- [ ] `/sitemap.xml` resolves and includes recent listing, city, blog, university, and project URLs
- [ ] No 404s for URLs in the sitemap sample (spot-check 10 URLs)

## Quick commands

```bash
# Listing meta (replace URL)
curl -sL "https://www.rentalpins.com/rentals/property/SLUG" | findstr /i "og:image canonical twitter:image"

# Default OG image
curl -sI "https://www.rentalpins.com/og-default.jpg" | findstr /i "200 content-type"
```
