# Next startup handoff — RentalPins web

**Saved:** 2026-05-30 (user shutdown)  
**Pick up here first.**

---

## Architecture (3 places)

| Role | Path | Deploy target |
|------|------|---------------|
| **Web app (dev)** | `C:\RentIt_Dev\apps\RentalPins_Full_web` | Local / CI |
| **Web app (production Vercel)** | `C:\Users\naudh\rentalpins-web` | www.rentalpins.com |
| **Firebase backend** | `C:\RentIt_Dev\apps\rentit_clean` | `rent-it-dev-6bcfd` |

- Firebase **functions**, **rules**, **indexes** live only in `rentit_clean` — never copy to `rentalpins-web`.
- `firestore.indexes.json` is **not** a full index inventory; many indexes were created via Console links. Deploy is **additive** (won't delete Console indexes). See `PRE_CUTOVER_CHECKLIST.md` §2.

---

## Verified at shutdown

```powershell
cd C:\RentIt_Dev\apps\RentalPins_Full_web
npm ci          # if EPERM on Windows: delete node_modules first, stop npm run dev
npm test -- --run    # 120/120 pass
npm run build        # pass
npm run check:env    # pass
npm run check:firestore-sync   # pass
```

**Not yet done:** Firestore rules deploy for post fix (see blocker below). Production Vercel sync/cutover.

---

## ⚠️ Blocker on resume — post listing permissions

**Symptom:** `/post` → Save draft → `Missing or insufficient permissions`

**Cause:** Firestore `listings` create requires `isNotBlocked()` → `users/{uid}.isBlocked == false`. Android sets this on signup; web did not.

**Fixed in code (needs deploy):**

1. `rentit_clean/firestore.rules` — `isNotBlocked()` treats missing `isBlocked` as not blocked
2. `RentalPins_Full_web/components/providers/AuthProvider.tsx` — new users get `isBlocked: false`

**Deploy on startup:**

```powershell
cd C:\RentIt_Dev\apps\rentit_clean
firebase use rent-it-dev-6bcfd
firebase deploy --only firestore:rules
```

Then restart dev server and retry `/post`.

---

## Quick verify on resume

```powershell
cd C:\RentIt_Dev\apps\RentalPins_Full_web
npm run dev
```

**Phone OTP on local dev:** Firebase blocks `localhost`. Dev server binds to **127.0.0.1** — use http://127.0.0.1:3000 and add `127.0.0.1` in Firebase → Authentication → Authorized domains. Or use Google sign-in / [test phone numbers](https://firebase.google.com/docs/auth/web/phone-auth#test-with-fictional-phone-numbers).

| URL | Expect |
|-----|--------|
| `http://localhost:3000/` | Marketing homepage — **no map** (normal) |
| `http://localhost:3000/search` | Map + listing panel |
| `http://localhost:3000/post` | Post form (after rules deploy + sign in) |

**Map tips:**

- Homepage has no map — use `/search` or **Open map**.
- If stuck on `Loading map…` or dev **Rendering…**: restart dev server; try `npx next dev` (no Turbopack); check Maps API key allows `localhost` and **Maps JavaScript API** + **Places API** enabled.
- `SearchMap.tsx` shows **Map failed to load** if Google Maps script errors (referrer/API).

**Windows npm ci EPERM:** Stop all `npm run dev`, delete `node_modules`, run `npm ci` again.

---

## Production cutover — next steps (in order)

### 1. Firebase (`rentit_clean`)

```powershell
firebase firestore:indexes --pretty   # optional: see live indexes in Console
firebase deploy --only firestore:rules
# firebase deploy --only firestore:indexes   # only if file has NEW indexes
# firebase deploy --only functions         # only if functions/index.js changed
```

Android smoke: map search, post/pay, chat.

### 2. Sync dev → Vercel repo

```powershell
Copy-Item -Recurse C:\Users\naudh\rentalpins-web C:\Users\naudh\rentalpins-web-backup-$(Get-Date -Format yyyyMMdd)

$src = "C:\RentIt_Dev\apps\RentalPins_Full_web"
$dst = "C:\Users\naudh\rentalpins-web"
robocopy $src $dst /E /XD node_modules .next .git .vercel /XF .env.local

cd C:\Users\naudh\rentalpins-web
npm ci
npm run build
git add . ; git commit -m "..." ; git push origin main
```

Keep `.git`, `.vercel`, `.env.local` in `rentalpins-web`.

### 3. Vercel env (`rentalpins-web` project)

**Production:** `NEXT_PUBLIC_DEPLOY_ENV=production`, no `BASE_PATH`, no staging banner, `REQUIRE_PHONE_VERIFICATION=true`, Firebase Admin, Maps key, `CRON_SECRET`.

**Preview/staging:** `BASE_PATH=/staging`, `DEPLOY_ENV=staging`, staging banner, phone verification off.

Run `npm run check:env:prod` with production values before cutover.

### 4. Staging QA → production

Full checklist: `docs/PRE_CUTOVER_CHECKLIST.md` §3–§8.

---

## Session fixes (2026-05-30 — don’t redo)

| Fix | Files |
|-----|--------|
| List blink / 2-col grid | `useStableMapCountInfo`, `MapResultsList`, `SearchFilters`, panel width 520px |
| Production CI + API hardening | `.github/workflows/rentalpins-web-ci.yml`, `lib/api-rate-limit.ts`, `lib/listings-api-bounds.ts` |
| Route error boundaries | `components/RouteError.tsx`, `app/*/error.tsx` |
| Firestore sync script | `scripts/verify-firestore-web-sync.mjs`, `npm run check:firestore-sync` |
| Map load error UI | `SearchMap.tsx` — `loadError` message + retry |
| SSR listings timeout | `app/search/page.tsx` — 8s timeout so `/search` won't hang |
| Post permissions | `firestore.rules` + `AuthProvider.tsx` — `isBlocked` (deploy rules!) |

---

## Production readiness (code complete)

| Item | Where |
|------|--------|
| GitHub Actions CI | `.github/workflows/rentalpins-web-ci.yml` |
| Listings API rate limit | 120/min per IP, `app/api/listings/route.ts` |
| Security headers | `next.config.ts` (HSTS when production) |
| Env template | `.env.example` |

**Still manual:** Vercel env, rules deploy, staging QA, DNS cutover.

---

## Key files

| Area | Path |
|------|------|
| Map UI | `components/map/SearchMap.tsx`, `MapCanvas.tsx`, `MapResultsPanel.tsx` |
| Post flow | `components/post/PostListingForm.tsx`, `app/post/activate/page.tsx` |
| Auth / user doc | `components/providers/AuthProvider.tsx` |
| Listings API | `app/api/listings/route.ts`, `lib/listings.ts` |
| Firebase rules (source of truth) | `../rentit_clean/firestore.rules` |
| Firebase functions | `../rentit_clean/functions/index.js` |
| Cutover checklist | `docs/PRE_CUTOVER_CHECKLIST.md` |

---

## Known constraints

- Do **not** pass controlled `mapZoom` / `mapCenter` to `GoogleMap` — use refs + imperative pan/zoom
- Single maps loader id: `rentalpins-maps-v2`, libraries `["places", "drawing"]` only
- **No git commit** unless user explicitly asks
- PowerShell: use `;` not `&&`

---

## Tests

**120** unit tests — `npm test -- --run`

---

## Optional backlog (not blocking cutover)

- Hub map SSR embed
- WebGL / AdvancedMarker at 1k+ pins (profile first)
- E2E tests, CSP header
- Export Console indexes into `firestore.indexes.json` for documentation

See `docs/AUTONOMOUS_PROGRESS_LOG.md` for older session history.
