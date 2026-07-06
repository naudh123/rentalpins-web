import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import {
  createBuilder,
  listBuilders,
} from "@/lib/builders/builders-server";
import type { CreateBuilderInput } from "@/lib/types/builder-microsite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") === "true";
  try {
    const builders = await listBuilders(publishedOnly);
    return NextResponse.json({ builders });
  } catch (err) {
    console.error("GET /api/builders", err);
    return NextResponse.json({ error: "Failed to fetch builders." }, { status: 500 });
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

  let body: CreateBuilderInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.name?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: "Name and slug are required." }, { status: 400 });
  }

  try {
    const id = await createBuilder(body, decoded.uid);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/builders", err);
    return NextResponse.json({ error: "Failed to create builder." }, { status: 500 });
  }
}
