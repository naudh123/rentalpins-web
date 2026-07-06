import { NextResponse } from "next/server";
import { buildAiTxt } from "@/lib/ai-txt";

export async function GET() {
  return new NextResponse(buildAiTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
