# Saved listings (favourites) — Firestore setup

Web writes `saved_listings/{listingId}_{userId}`.

Merge these rules into `rentit_clean/firestore.rules` before production cutover.

## Security rules

```
match /saved_listings/{docId} {
  allow read: if signedIn() && resource.data.userId == request.auth.uid;

  allow create: if signedIn()
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.listingId is string
    && request.resource.data.listingId.size() > 0
    && request.resource.data.source == 'web';

  allow update: if signedIn()
    && resource.data.userId == request.auth.uid
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.listingId == resource.data.listingId
    && request.resource.data.source == 'web';

  allow delete: if signedIn()
    && resource.data.userId == request.auth.uid;
}
```

Notes:
- We use `setDoc(..., { merge: true })` for save and `deleteDoc` for unsave.
- With `allow update: if false`, `setDoc` overwrite/merge must be treated as create/update by Firestore rules.
  If your rules engine rejects the merge, switch `allow update` to the same condition as create.

## Document fields

| Field | Type |
|-------|------|
| `userId` | string |
| `listingId` | string |
| `savedAt` | timestamp |
| `source` | string (`web`) |

## Optional index (recommended)

Collection: `saved_listings`

| Field | Order |
|-------|-------|
| `userId` | Ascending |

