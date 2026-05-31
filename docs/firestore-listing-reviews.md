# Listing reviews - Firestore setup

Web reviews write to `listing_reviews/{listingId}_{reviewerUid}`.

Merge these rules/indexes into `rentit_clean` before production.

## Security rules

```
    match /listing_reviews/{reviewId} {
      allow read: if true;

      allow create, update: if signedIn()
        && request.resource.data.reviewerUid == request.auth.uid
        && request.resource.data.listingId is string
        && request.resource.data.listingId.size() > 0
        && request.resource.data.reviewerName is string
        && request.resource.data.reviewerName.size() <= 60
        && request.resource.data.rating is number
        && request.resource.data.rating >= 1
        && request.resource.data.rating <= 5
        && request.resource.data.comment is string
        && request.resource.data.comment.size() <= 300
        && request.resource.data.source == 'web';

      allow delete: if false;
    }
```

## Composite index

Collection: `listing_reviews`

| Field | Order |
|-------|-------|
| `listingId` | Ascending |
| `updatedAt` | Descending |

## Document shape

| Field | Type |
|-------|------|
| `listingId` | string |
| `reviewerUid` | string |
| `reviewerName` | string |
| `rating` | number (1-5) |
| `comment` | string (max 300) |
| `source` | string (`web`) |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |
