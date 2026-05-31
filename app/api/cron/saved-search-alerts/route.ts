import { NextResponse } from "next/server";
import { runSavedSearchAlerts } from "@/lib/saved-search-alerts-process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/** POST/GET — invoke from Vercel Cron or manual: Authorization: Bearer $CRON_SECRET */
export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSavedSearchAlerts();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("saved-search-alerts cron failed:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
