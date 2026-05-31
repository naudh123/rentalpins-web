# Search alerts — Firestore setup

Web cron writes `search_alerts/{savedSearchId}_{listingId}` when new listings match a saved search with `alertsEnabled: true`.

Merge rules + index into `rentit_clean`, then deploy.

## Security rules

```
    match /search_alerts/{alertId} {
      allow read: if signedIn()
        && resource.data.userId == request.auth.uid;

      allow update: if signedIn()
        && resource.data.userId == request.auth.uid
        && request.resource.data.userId == resource.data.userId
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);

      allow delete: if signedIn()
        && resource.data.userId == request.auth.uid;

      allow create: if false;
    }
```

## Composite index

Collection: `search_alerts`

| Field | Order |
|-------|-------|
| `userId` | Ascending |
| `createdAt` | Descending |

## Saved search field (add-only)

| Field | Type | Notes |
|-------|------|-------|
| `lastAlertedAt` | timestamp | Set on save / enable alerts; advanced by cron |

## Cron

Set `CRON_SECRET` in hosting env. Schedule `GET /api/cron/saved-search-alerts` with header:

`Authorization: Bearer <CRON_SECRET>`

Vercel: see `vercel.json` (hourly). Local test:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/saved-search-alerts
```

Push notifications (FCM) can subscribe to the same `search_alerts` writes later — not required for web v1.
