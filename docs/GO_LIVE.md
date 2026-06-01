# Go live — RentalPins Next.js web

Use this when moving **www.rentalpins.com** to the Next.js app.

**Repos**

| Role | Path |
|------|------|
| Dev / source | `C:\RentIt_Dev\apps\RentalPins_Full_web` |
| Vercel production | `C:\Users\naudh\rentalpins-web` |
| Firebase | `C:\RentIt_Dev\apps\rentit_clean` → project `rent-it-dev-6bcfd` |

---

## Before you start (local)

```powershell
cd C:\RentIt_Dev\apps\RentalPins_Full_web
npm test -- --run
npm run check:env
npm run check:firestore-sync
npm run build
```

All must pass. `check:env:prod` is run against **Vercel** env vars (see §3).

---

## Step 1 — Firebase backend (same project as apps)

```powershell
cd C:\RentIt_Dev\apps\rentit_clean
firebase use rent-it-dev-6bcfd
```

Deploy what changed this sprint:

```powershell
# Rules (post permissions, isBlocked)
firebase deploy --only firestore:rules

# improveListingText auth + AI (already deployed if you saw "Successful update operation")
firebase deploy --only functions:improveListingText
```

Optional (only if `firestore.indexes.json` gained new composites):

```powershell
firebase deploy --only firestore:indexes
```

Wait for new indexes to show **Enabled** in Firebase Console.

**Android smoke** (same Firebase project): map search, post, pay, chat — quick check.

---

## Step 2 — Sync code to Vercel repo

Do **not** copy `node_modules`, `.next`, `.env.local`. Keep `rentalpins-web`’s `.git` and `.vercel`.

```powershell
# Backup
Copy-Item -Recurse C:\Users\naudh\rentalpins-web C:\Users\naudh\rentalpins-web-backup-$(Get-Date -Format yyyyMMdd)

$src = "C:\RentIt_Dev\apps\RentalPins_Full_web"
$dst = "C:\Users\naudh\rentalpins-web"
robocopy $src $dst /E /XD node_modules .next .git .vercel /XF .env.local

cd C:\Users\naudh\rentalpins-web
npm ci
npm test -- --run
npm run build
```

Commit and push (you run git — not automated here):

```powershell
git add .
git status
git commit -m "Production cutover: post AI, activate hardening, unified callables."
git push origin main
```

Vercel deploys from `rentalpins-web` → **www.rentalpins.com**.

---

## Step 3 — Vercel environment (Production)

In Vercel → Project → Settings → Environment Variables → **Production**:

| Variable | Production value |
|----------|------------------|
| `NEXT_PUBLIC_DEPLOY_ENV` | `production` |
| `NEXT_PUBLIC_BASE_PATH` | **unset** (empty) |
| `NEXT_PUBLIC_SHOW_STAGING_BANNER` | **unset** or `false` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.rentalpins.com` |
| `NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION` | `true` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | production key (referrer: `www.rentalpins.com`) |
| Firebase client vars | same as dev project |
| `FIREBASE_PROJECT_ID` | `rent-it-dev-6bcfd` |
| `FIREBASE_CLIENT_EMAIL` | service account |
| `FIREBASE_PRIVATE_KEY` | service account key |
| `CRON_SECRET` | strong random secret (saved-search cron) |

**Vercel Hobby:** `vercel.json` cron is **once per day** (`0 0 * * *`). Hourly (`0 * * * *`) requires Pro. Use an external cron (e.g. cron-job.org) hitting `/api/cron/saved-search-alerts` hourly if needed on Hobby.

**Maps:** enable **Maps JavaScript API** + **Places API**; restrict key to production domain.

**Auth:** Firebase Console → Authentication → Authorized domains → add `www.rentalpins.com` (and `rentalpins.com` if used).

After deploy, verify:

- `https://www.rentalpins.com/api/health` → `{ "ok": true }`
- `/search` loads map
- `/post` → sign in → location → AI improve → save draft → activate

---

## Step 4 — Staging first (recommended)

If you use **staging** on the same Vercel project:

- Preview env: `NEXT_PUBLIC_BASE_PATH=/staging`, `NEXT_PUBLIC_DEPLOY_ENV=staging`, banner on.
- Run checklist §4 in `docs/PRE_CUTOVER_CHECKLIST.md` on staging URL.
- Then promote production env (Step 3) and deploy `main`.

---

## Step 5 — Cutover day

- [ ] DNS/hosting points to Vercel production (no base path).
- [ ] Production env vars set (Step 3).
- [ ] Firebase rules + `improveListingText` deployed (Step 1).
- [ ] `npm run build` passed in `rentalpins-web`.
- [ ] Smoke: map, listing detail, login (phone + Google), post + activate payment.
- [ ] GA4 DebugView on production (optional).
- [ ] Monitor Search Console 2–4 weeks.

---

## Rollback

- Vercel: redeploy previous production deployment from dashboard.
- DNS: point back to old host if you changed DNS.
- Firebase rules: redeploy previous `firestore.rules` from git history in `rentit_clean` (only if rules caused issues).

---

## New features in this release (QA focus)

- Post listing: AI improve with landmarks, location-first form, blocked-account handling.
- Activate: unified payment callables, clearer errors, error boundary.
- Auth: `isBlocked` gate, profile load errors surfaced.

See `docs/PRE_CUTOVER_CHECKLIST.md` for full QA matrix.
