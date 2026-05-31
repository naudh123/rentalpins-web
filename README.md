# RentalPins Full Web (working ground)

Next.js replacement for `www.rentalpins.com`. Production repos are read-only references.

## Quick start

```bash
cd C:\RentIt_Dev\apps\RentalPins_Full_web
cp .env.example .env.local
# Fill Firebase + Google Maps keys
npm install
npm run dev
```

- **Local dev:** http://localhost:3000 (do not set `NEXT_PUBLIC_BASE_PATH`)
- **Hosted staging:** set `NEXT_PUBLIC_BASE_PATH=/staging` → https://www.rentalpins.com/staging

## v1 scope

Map search · listing detail · post listing · payments (Razorpay via Cloud Functions) · chat · Firebase phone OTP + Google

## Pre-cutover

- Checklist: [`docs/PRE_CUTOVER_CHECKLIST.md`](docs/PRE_CUTOVER_CHECKLIST.md)
- Firestore web queries + deploy: [`docs/firestore-web-queries.md`](docs/firestore-web-queries.md)
- Env validation: `npm run check:env` (production: `npm run check:env:prod`)
- Health endpoint after deploy: `GET /api/health`

## References (read-only)

- `C:\Users\naudh\rentalpins-web`
- `C:\RentIt_Dev\apps\rentit_clean`

See `RENTALPINS_WEB_ROADMAP.md` for full product decisions.
