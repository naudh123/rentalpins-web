import { NextResponse } from "next/server";
import { buildLlmsFullTxt } from "@/lib/llms-txt";

export async function GET() {
  return new NextResponse(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
