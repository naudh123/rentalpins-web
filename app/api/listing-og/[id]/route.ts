import { NextResponse } from "next/server";
import sharp from "sharp";
import { fetchListingById } from "@/lib/listings";
import { generateListingOgImageResponse } from "@/lib/listing-og-card";
import {
  defaultListingOgImageAbsoluteUrl,
  pickListingCoverImageUrl,
} from "@/lib/listing-og-image";
import { LISTING_OG_HEIGHT, LISTING_OG_WIDTH } from "@/lib/listing-share-constants";

export const runtime = "nodejs";

const WHATSAPP_SAFE_MAX_BYTES = 300_000;
const WHATSAPP_HARD_MAX_BYTES = 600_000;

async function compressCoverToOgJpeg(input: Buffer): Promise<Buffer> {
  let quality = 85;
  let output = await sharp(input)
    .rotate()
    .resize(LISTING_OG_WIDTH, LISTING_OG_HEIGHT, {
      fit: "cover",
      position: "centre",
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  while (output.length > WHATSAPP_SAFE_MAX_BYTES && quality > 45) {
    quality -= 10;
    output = await sharp(input)
      .rotate()
      .resize(LISTING_OG_WIDTH, LISTING_OG_HEIGHT, {
        fit: "cover",
        position: "centre",
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  if (output.length > WHATSAPP_HARD_MAX_BYTES) {
    output = await sharp(input)
      .rotate()
      .resize(LISTING_OG_WIDTH, LISTING_OG_HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality: 40, mozjpeg: true })
      .toBuffer();
  }

  return output;
}

async function proxyDefaultOgImage(): Promise<Response> {
  const res = await fetch(defaultListingOgImageAbsoluteUrl(), {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    return generateListingOgImageResponse(null);
  }
  const bytes = await res.arrayBuffer();
  return new Response(bytes, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

/** WhatsApp-safe 1200×630 JPEG from listing cover photo (<600KB). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  const cover = pickListingCoverImageUrl(listing);

  if (!cover) {
    return proxyDefaultOgImage();
  }

  try {
    const imageRes = await fetch(cover, { next: { revalidate: 86400 } });
    if (!imageRes.ok) {
      return proxyDefaultOgImage();
    }

    const input = Buffer.from(await imageRes.arrayBuffer());
    const output = await compressCoverToOgJpeg(input);

    return new Response(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    if (listing) {
      return generateListingOgImageResponse(listing);
    }
    return proxyDefaultOgImage();
  }
}
