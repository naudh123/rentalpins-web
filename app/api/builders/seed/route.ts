import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import { seedBuilderSampleData } from "@/lib/builders/seed-sample-data";

/** Dev-only: seed without auth. Production/admin uses POST. */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only." }, { status: 403 });
  }
  try {
    const result = await seedBuilderSampleData("dev-get-seed");
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/builders/seed", err);
    return NextResponse.json({ error: "Failed to seed sample data." }, { status: 500 });
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
    const result = await seedBuilderSampleData(decoded.uid);
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/builders/seed", err);
    return NextResponse.json({ error: "Failed to seed sample data." }, { status: 500 });
  }
}
