import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import { seedTricityCatalog } from "@/lib/builders/seed-tricity-data";

/** Dev-only: seed Tricity catalog without auth. Production/admin uses POST. */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only." }, { status: 403 });
  }
  try {
    const result = await seedTricityCatalog("dev-get-seed-tricity");
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/builders/seed-tricity", err);
    return NextResponse.json({ error: "Failed to seed Tricity catalog." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const role = await getUserRole(decoded.uid);
  if (!isAdminRole(role) && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_BUILDER_SEED !== "true") {
    return NextResponse.json({ error: "Seed disabled in production." }, { status: 403 });
  }

  try {
    const result = await seedTricityCatalog(decoded.uid);
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/builders/seed-tricity", err);
    return NextResponse.json({ error: "Failed to seed Tricity catalog." }, { status: 500 });
  }
}
