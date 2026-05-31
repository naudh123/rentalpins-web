# Listing reports — Firestore setup

Web writes `listing_reports/{listingId}_{reporterUid}` when a signed-in user reports a listing.

Merge into `rentit_clean/firestore.rules` before production.

## Security rules

```
    match /listing_reports/{reportId} {
      allow create: if signedIn()
        && request.resource.data.reporterUid == request.auth.uid
        && request.resource.data.listingId is string
        && request.resource.data.listingId.size() > 0
        && request.resource.data.listingTitle is string
        && request.resource.data.reason is string
        && request.resource.data.status == 'open'
        && request.resource.data.source == 'web'
        && request.resource.data.details is string
        && request.resource.data.details.size() <= 500;

      allow update, delete: if false;
      allow read: if false;
    }
```

Admin review via Firebase console or a future admin tool (service account).

## Document shape (add-only)

| Field | Type | Notes |
|-------|------|-------|
| `listingId` | string | |
| `listingTitle` | string | Snapshot at report time |
| `ownerUid` | string | |
| `reporterUid` | string | Reporter uid |
| `reason` | string | `scam`, `wrong_location`, `spam`, etc. |
| `details` | string | Optional, max 500 chars |
| `status` | string | `open` |
| `source` | string | `web` |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

Doc id `{listingId}_{reporterUid}` prevents duplicate reports from the same user.
