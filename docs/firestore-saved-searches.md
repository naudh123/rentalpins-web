# Saved searches — Firestore setup

Web v1 writes to `saved_searches/{id}`. Merge into `rentit_clean/firestore.rules` and deploy indexes before production.

Index JSON to merge: `firestore.indexes.web-additions.json` (repo root).

## Security rules (add before DEFAULT DENY)

```
    match /saved_searches/{searchId} {
      allow read: if signedIn()
        && resource.data.userId == request.auth.uid;

      allow create: if signedIn()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.source == 'web'
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 120;

      allow update: if signedIn()
        && resource.data.userId == request.auth.uid
        && request.resource.data.userId == resource.data.userId;

      allow delete: if signedIn()
        && resource.data.userId == request.auth.uid;
    }
```

## Composite index

Collection: `saved_searches`

| Field | Order |
|-------|-------|
| `userId` | Ascending |
| `updatedAt` | Descending |

## Document shape (add-only — safe for mobile)

| Field | Type | Notes |
|-------|------|-------|
| `userId` | string | Owner uid |
| `name` | string | Display label |
| `category` | string | `All` or main category |
| `priceMin` | number \| null | |
| `priceMax` | number \| null | |
| `sort` | string | `recommended`, `newest`, etc. |
| `bounds` | map \| null | `north`, `south`, `east`, `west` |
| `centerLat` | number \| null | |
| `centerLng` | number \| null | |
| `zoom` | number \| null | |
| `area` | string (optional) | Drawn area filter — `r:n,s,e,w` (rect) or `p:lat,lng_...` (polygon). Absent when no custom area. |
| `alertsEnabled` | bool | Enables hourly match cron → `search_alerts` |
| `lastAlertedAt` | timestamp | Watermark for new-listing detection |
| `source` | string | `web` |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

In-app alerts: see `docs/firestore-search-alerts.md` and `GET /api/cron/saved-search-alerts`. FCM push can hook the same `search_alerts` writes later.
