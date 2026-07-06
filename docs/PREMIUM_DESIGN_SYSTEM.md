# RentalPins Premium Design System

Living design reference extracted from production code — **no Figma required**. Use this to keep web, Flutter, and builder microsites visually aligned as the SaaS grows.

---

## 1. Design principles

| Principle | What it means |
|-----------|----------------|
| **Lane clarity** | Rent, Buy, and Invest each have a distinct accent — users always know which mode they’re in |
| **Restraint** | One primary CTA per viewport; gold/orange is for action, navy is for trust |
| **Real assets** | Photography and map pins beat decoration — luxury comes from real listings and project imagery |
| **Concierge tone** | “Arrange site visit”, “Owner direct”, “Private consultation” — not “Submit” or “Click here” |
| **Glass, not gloss** | Soft ivory surfaces, subtle borders, gentle shadows — never heavy gradients on utility UI |
| **Motion with purpose** | 200–550ms ease-out; parallax and fade-up on marketing sections only |

---

## 2. Product lanes

### Rent (marketplace)

- **Accent:** Orange `#E8501A`
- **Primary:** Navy `#1E3A6E`
- **Feel:** Fast, map-first, friendly, owner-direct
- **Web:** `.rent-theme`, `[data-transaction="rent"]`
- **Flutter:** `PremiumUi.brandRent` / `brandPrimary`

### Buy (sale + projects)

- **Accent:** Gold `#C9A227`
- **Primary:** Navy `#1E3A6E`
- **Surface:** Ivory `#FAF8F5`
- **Feel:** Considered, investment-grade, brochure-quality
- **Web:** `.sale-theme`, `.builder-luxury`, `[data-transaction="sale"]`
- **Flutter:** `PremiumUi.brandBuy` / `PremiumUi.gold`

### Invest (future)

- **Accent:** Emerald `#0D6B5C`
- **Feel:** Growth, intelligence, long horizon
- **Web tokens:** `--invest-emerald`, `--invest-platinum`
- **Flutter:** `PremiumUi.emerald`

### Builder microsites (white-label SaaS)

- Per-builder themes from `lib/builders/brand-themes.ts`
- Wrapper: `BuilderLuxuryShell` + `.builder-luxury`
- Default fallback: RentalPins Luxury (navy + gold)

---

## 3. Color tokens

### Core (web `:root`)

```css
--brand-navy:       #1e3a6e;
--brand-navy-dark:  #0f2554;
--brand-orange:     #e8501a;
--brand-orange-hover: #d34415;

--bg:               #ffffff;
--bg-elevated:      #f8fafc;
--surface:          #ffffff;
--border:           #dde3f0;
--text:             #0f1c35;
--muted:            #6b7a99;
```

### Buy / luxury

```css
--sale-gold:        #c9a227;
--sale-gold-hover:  #b8922a;
--sale-gold-muted:  #e8dcc0;
--sale-ivory:       #faf8f5;
--sale-ivory-elevated: #f5f2ec;
--sale-muted:       #7a6f5c;
```

### Luxury runtime (`.builder-luxury`)

```css
--lux-primary:      var(--brand-navy);
--lux-primary-deep: #0a1628;
--lux-accent:       var(--sale-gold);
--lux-surface:      var(--sale-ivory);
--lux-glass:        rgba(255, 254, 251, 0.92);
--lux-shadow:       0 24px 48px -12px rgba(15, 28, 53, 0.1);
--lux-shadow-gold:  0 20px 44px -12px rgba(201, 162, 39, 0.28);
```

### Flutter (`PremiumUi`)

| Token | Value | Use |
|-------|-------|-----|
| `brandPrimary` | `#3F51B5` | Rent / general (align toward navy on refactor) |
| `brandBuy` | `#C9A227` | Buy lane |
| `gold` | `#C9A227` | Buy accents |
| `emerald` | `#0D7C4A` | Invest lane |

> **Parity note:** Flutter rent primary is indigo today; long-term align to web navy `#1E3A6E` for brand consistency.

### Semantic colors

| Meaning | Web | Use |
|---------|-----|-----|
| Success | `#16a34a` | Form success, available units |
| Danger | `#dc2626` | Errors, sold-out |
| WhatsApp | `#25D366` | Share-to-friend only — not primary CTA on luxury pages |

---

## 4. Typography

### Fonts

| Role | Web | Flutter |
|------|-----|---------|
| **UI / body** | DM Sans (`--font-sans`) | System / default theme |
| **Headlines / price** | Playfair Display (`font-serif`) | `FontWeight.w800`, tight letter-spacing |

### Scale (web)

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Hero H1 | `text-3xl` → `text-5xl` | serif bold | Project microsite heroes |
| Page H1 | `text-3xl` | serif | Listing / buy project titles |
| Section H2 | `text-xl` → `text-2xl` | serif | Inventory, amenities |
| Eyebrow | `text-xs` | semibold, `tracking-[0.2em]` uppercase | `.lux-eyebrow` |
| Body | `text-sm` → `text-base` | normal | `leading-relaxed` on long copy |
| Price | `text-lg` → `text-2xl` | serif or `font-serif` | Orange (rent) or gold (buy) |
| Micro label | `text-[10px]`–`text-xs` | `font-semibold` uppercase | Chips, badges |

### Rules

- **Serif for emotion** (headlines, price, success states)
- **Sans for function** (forms, nav, metadata)
- Max **2 lines** for titles on cards; truncate with ellipsis
- Never use more than **3 font sizes** on a single card

---

## 5. Spacing & radius

### Radius (web)

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 8px | Chips, small buttons |
| `--radius-md` | 12px | Inputs, inner cards |
| `--radius-lg` | 16px | Gallery thumbs |
| `--radius-xl` | 20px | Main cards, map previews, modals |

### Radius (Flutter)

| Token | Value |
|-------|-------|
| `PremiumUi.radiusSm` | 12 |
| `PremiumUi.radiusMd` | 16 |
| `PremiumUi.radiusLg` | 20 |

### Spacing rhythm

- Section gap: `mt-8` / `mt-10` (32–40px)
- Card padding: `p-5` mobile → `p-6` desktop
- Sticky bars: `bottom-0`, safe-area aware on mobile
- Content max-width: `max-w-3xl` (article) · `max-w-5xl` (microsite) · `max-w-sm` (map preview)

---

## 6. Shadows & glass

### Web

| Class / token | Use |
|---------------|-----|
| `--shadow-card` | Default elevated cards |
| `--shadow-glow` | Primary CTA hover (orange rent / gold buy) |
| `.lux-glass` / `.lux-card` | Ivory glass panels on buy/project pages |
| `.rp-glass` | Map preview floating sheets |

### Flutter

| Component | Use |
|-----------|-----|
| `PremiumGlassPanel` | Detail summaries, invest/buy placeholders |
| `PremiumUi.softShadow()` | Cards, nav tiles |
| Map popup | Layered ambient + contact shadow (see `map_popup_overlay.dart`) |

### Glass recipe

- Background: white/ivory at **92–95% opacity**
- Border: `color-mix(accent 18–25%, border)`
- Shadow: soft, **no hard drop shadows** on luxury pages

---

## 7. Components

### Buttons

| Variant | Web class | When |
|---------|-----------|------|
| Primary rent | `.rp-btn-primary` | Search, contact owner |
| Primary buy | `.lux-btn-gold` | Site visit, enquire |
| Secondary | `.lux-btn-outline` / `.rp-btn-secondary` | Compare, browse map |
| WhatsApp (luxury) | `.lux-btn-whatsapp` | Sticky bar on projects |
| WhatsApp (share) | Green `#25D366` pill | Share listing to friend |
| Icon share | Round 36px border button | Sticky bar, map preview |

**Rules:** One filled primary per section. Gold buttons use **navy text** (`--lux-accent-text`).

### Form inputs

| Web | Flutter |
|-----|---------|
| `.lux-input` | Rounded 12px, border `#dde3f0`, focus ring gold 18% |
| Labels: uppercase micro `text-xs tracking-wider` | Match weight hierarchy |

### Cards

| Component | Web | Flutter |
|-----------|-----|---------|
| Listing card | `.rp-card` | `UnifiedListingGridCard` |
| Luxury list card | `.lux-list-card` | — |
| Featured project | `.lux-featured-card` | — |
| Map preview | `.rp-glass` + `MapListingPreview` | `MapPopupOverlay` |
| Glass panel | `LuxuryGlassPanel` | `PremiumGlassPanel` |

### Chips & badges

| Type | Style |
|------|-------|
| BHK / spec | `.lux-chip` — ivory bg, gold border 20% |
| Status (selling/upcoming) | `.lux-subpage-badge` |
| Promoted | Orange/gold pill, ★ prefix |
| Owner direct | Small trust row — avoid loud colors |

### Section headers

Web: `LuxurySectionHeader` — eyebrow + serif title + optional description  
Flutter: `PremiumSectionHeader`

Pattern:
```
EYEBROW (gold, uppercase, tracked)
Serif Title
Muted description (one line preferred)
```

### Sticky bars

| Surface | Contents |
|---------|----------|
| Listing detail (web) | Title · price · save · share · call/WhatsApp (desktop) |
| Project microsite | Call · WhatsApp · Enquire |
| Mobile listing | Fixed bottom `ListingActions` for contact |

---

## 8. Motion

| Context | Duration | Easing |
|---------|----------|--------|
| Map preview enter | 280ms | `[0.22, 1, 0.36, 1]` |
| Flutter map popup | 450ms slide | `Curves.easeOutCubic` |
| Luxury fade-up | 550ms | `[0.22, 1, 0.36, 1]`, `viewport once` |
| Hover scale (CTA) | 150ms | `ease-out`, max 1.02 scale |
| Image fade-in | 300ms | opacity only |

**Don’t:** Bounce, spin, or animate every element. Respect `prefers-reduced-motion` (web: `useReducedMotion`).

---

## 9. Voice & copy

### Headlines

- ✅ `3 BHK in Sector 82 — Mohali`
- ✅ `Arrange your private site visit`
- ❌ `Property Details`
- ❌ `Submit Form`

### Share copy pattern

```
🏠 {title} — {specs}
{price} · {location}

Owner-direct on RentalPins — view photos, map & contact.

View listing & contact owner →
{url}
```

### Trust lines

- Owner direct · Verified phone · On map
- Concierge desk · Free site visit · No obligation

---

## 10. Do’s and don’ts

### Do

- Wrap buy/project pages in `.builder-luxury` or `.sale-theme`
- Use real cover photos in OG cards and share payloads
- Keep map previews compact (`max-w-sm`) with one primary action
- Use gold **only** in buy/project/invest contexts
- Align Flutter map popup with `PremiumGlassPanel` over time

### Don’t

- Mix orange rent CTAs on gold buy pages
- Use more than two button styles in one row
- Place raw `#25D366` WhatsApp as the hero CTA on luxury project pages (use `.lux-btn-whatsapp`)
- Show empty gray boxes — use `.lux-empty-state` or photo placeholder with icon
- Use generic stock gradients without photography on project heroes

---

## 11. Screen checklist

Use this when shipping or reviewing a screen:

- [ ] Correct lane theme (rent orange / buy gold / invest emerald)
- [ ] Serif headline + sans body
- [ ] One clear primary CTA
- [ ] Cover image or map context visible above fold
- [ ] Trust signal (owner direct, RERA, platform desk)
- [ ] Mobile sticky contact or bottom bar
- [ ] Share produces rich preview (OG / image + caption)
- [ ] Spacing matches `radius-xl` cards and `p-5`/`p-6` padding
- [ ] Flutter screen uses `PremiumUi` tokens where applicable

---

## 12. File reference

### Web

| Area | Path |
|------|------|
| Global tokens | `app/globals.css` |
| Luxury components | `components/builders/luxury/LuxuryUI.tsx` |
| Builder themes | `lib/builders/brand-themes.ts` |
| Project microsite | `components/builders/ProjectMicrositeClient.tsx` |
| Buy project page | `components/builders/BuyProjectDetailClient.tsx` |
| Listing OG card | `lib/listing-og-card.tsx` |
| Map preview | `components/map/MapListingPreview.tsx` |

### Flutter

| Area | Path |
|------|------|
| Design tokens | `lib/widgets/premium_ui.dart` |
| Map popup | `lib/widgets/map_popup_overlay.dart` |
| Listing detail | `lib/screens/listing_detail_screen.dart` |

---

## 13. Roadmap (design debt)

| Item | Priority |
|------|----------|
| Align Flutter `brandPrimary` to web navy `#1E3A6E` | Medium |
| Wrap `MapPopupOverlay` in `PremiumGlassPanel` | Low |
| Storybook for web luxury components | Medium |
| Figma library mirroring these tokens (when hiring design) | Later |
| Invest lane full theme pass | When `/invest` launches |

---

*Last updated from codebase: Jul 2026. Treat this doc as the source of truth until a Figma library is created — then keep both in sync.*
