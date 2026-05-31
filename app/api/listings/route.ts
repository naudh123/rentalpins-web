import { NextResponse } from "next/server";
import {
  checkRateLimit,
  clientIpFromRequest,
  LISTINGS_API_RATE_LIMIT,
} from "@/lib/api-rate-limit";
import { parseListingFiltersFromParams } from "@/lib/listing-filters";
import { validateListingsBoundsQuery } from "@/lib/listings-api-bounds";
import { fetchListingsInBounds } from "@/lib/listings";

function rateLimitHeaders(result: ReturnType<typeof checkRateLimit>): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

export async function GET(request: Request) {
  const ip = clientIpFromRequest(request);
  const rate = checkRateLimit(
    `listings:${ip}`,
    LISTINGS_API_RATE_LIMIT.limit,
    LISTINGS_API_RATE_LIMIT.windowMs
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests — slow down and try again." },
      { status: 429, headers: rateLimitHeaders(rate) }
    );
  }

  const { searchParams } = new URL(request.url);
  const validated = validateListingsBoundsQuery(
    searchParams.get("north"),
    searchParams.get("south"),
    searchParams.get("east"),
    searchParams.get("west")
  );
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: validated.status, headers: rateLimitHeaders(rate) }
    );
  }

  const filters = parseListingFiltersFromParams(searchParams);
  const zoomRaw = searchParams.get("zoom");
  const zoom = zoomRaw != null && zoomRaw !== "" ? Number(zoomRaw) : null;
  const mapZoom = zoom != null && Number.isFinite(zoom) ? zoom : null;

  try {
    const { listings, totalInBounds, filteredCount, resultsMayBeIncomplete, prefixCapActive } =
      await fetchListingsInBounds(validated.bounds, filters, { zoom: mapZoom });
    return NextResponse.json(
      {
        listings,
        totalInBounds,
        filteredCount,
        resultsMayBeIncomplete,
        prefixCapActive,
      },
      { headers: rateLimitHeaders(rate) }
    );
  } catch (err) {
    console.error("GET /api/listings error:", err);
    const needsAdmin =
      !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;
    return NextResponse.json(
      {
        error: "Failed to load listings",
        listings: [],
        hint:
          needsAdmin && process.env.NODE_ENV !== "production"
            ? "Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local"
            : undefined,
      },
      { status: 503, headers: rateLimitHeaders(rate) }
    );
  }
}
