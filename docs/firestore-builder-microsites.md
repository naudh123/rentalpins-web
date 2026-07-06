# Builder microsites — Firestore & Storage setup

Merge into `rentit_clean` before production. Deployed with the builder module (July 2026).

## Collections

| Collection | Client read | Client write |
|------------|-------------|--------------|
| `builders` | Published profiles | Admin / builder team (via rules) |
| `builder_projects` | Published projects | Admin / builder team |
| `project_units` | All (inventory pages) | Admin / builder team |
| `project_leads` | Admin / builder team | Public create (validated) |
| `project_master_plans` | Published projects | Admin / builder team |
| `builder_users` | Own membership docs | Admin only |

> Web admin CRUD also uses Firebase **Admin SDK** in Next.js API routes. Client rules are defense-in-depth.

## Storage paths

| Asset | Path |
|-------|------|
| Builder logo | `builder-assets/{uid}/builders/{builderId}/logo.jpg` |
| Builder cover | `builder-assets/{uid}/builders/{builderId}/cover.jpg` |
| Builder gallery | `builder-assets/{uid}/builders/{builderId}/gallery/{ts}.jpg` |
| Project gallery | `builder-assets/{uid}/projects/{projectId}/gallery/{ts}.jpg` |
| Brochure PDF | `builder-assets/{uid}/projects/{projectId}/brochure.pdf` |
| Master plan | `builder-assets/{uid}/projects/{projectId}/master-plan/{angleId}.jpg` |

`{uid}` = authenticated uploader (admin uid). All paths are world-readable.

## Deploy

```powershell
cd C:\RentIt_Dev\apps\rentit_clean
firebase use rent-it-dev-6bcfd
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Verify sync from web repo:

```powershell
cd C:\RentIt_Dev\apps\RentalPins_Full_web
npm run check:firestore-sync
```
