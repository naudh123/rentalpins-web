# Firestore queries used by the web app

Deploy rules/indexes in **`rentit_clean`** (read-only reference for mobile). Web repo only documents what to merge.

## Client reads (Firebase SDK)

| Feature | Collection | Query | Index / rules |
|---------|--------------|-------|----------------|
| Saved searches | `saved_searches` | `userId == uid` + `orderBy updatedAt desc` | **New** composite index + **new** rules — see `firestore-saved-searches.md` |
| My listings | `listings` | `ownerUid == uid` | Existing `ownerUid` rules; single-field query (sort client-side) |
| Chat inbox | `chat_rooms` | `buyerUid == uid` or `sellerUid == uid` | Existing chat rules |
| Chat messages | `chat_rooms/{id}/messages` | `orderBy createdAtMs asc` | Subcollection rules |
| Listing (chat bootstrap) | `listings/{id}` | `get` | Owner/public rules |
| Plans | `listing_plans` | `isActive == true` + `targetIso == homeIso` | Single-field indexes usually sufficient |

## Client writes

| Feature | Collection | Notes |
|---------|--------------|-------|
| Post listing | `listings` | `isActive: false`, `ownerUid`, geohash — same shape as app |
| User profile | `users/{uid}` | merge displayName, phone, etc. |
| Chat room + messages | `chat_rooms`, `messages` | Same as app |
| Saved searches | `saved_searches` | `source: 'web'` only |

## Server reads (Firebase Admin)

| Route | Query |
|-------|--------|
| `GET /api/listings` | `listings` geohash prefix × N (no `orderBy`); category/price/sort applied server-side after bounds fetch |
| Listing detail SSR | `listings/{id}` where `isActive == true` |
| SEO hub pages | bounds / city helpers via Admin |

Admin uses service account — not gated by client rules.

## Deploy snippet

Merge `firestore.indexes.web-additions.json` into `rentit_clean/firestore.indexes.json`, then:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```
