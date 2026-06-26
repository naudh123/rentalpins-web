import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import { fetchAgentMetrics } from "@/lib/agent/metrics";

export async function GET(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const role = await getUserRole(decoded.uid);
  if (!isAdminRole(role)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const url = new URL(request.url);
  const daysRaw = url.searchParams.get("days");
  const days = daysRaw ? Math.min(30, Math.max(1, Number(daysRaw) || 7)) : 7;

  try {
    const metrics = await fetchAgentMetrics(days);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("[agent/metrics]", error);
    return NextResponse.json({ error: "Failed to load agent metrics." }, { status: 500 });
  }
}
