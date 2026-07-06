import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import {
  getBuilderById,
  updateBuilder,
} from "@/lib/builders/builders-server";
import { canManageBuilder } from "@/lib/builders/builder-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const builder = await getBuilderById(id);
    if (!builder) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ builder });
  } catch (err) {
    console.error("GET /api/builders/[id]", err);
    return NextResponse.json({ error: "Failed to fetch builder." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;
  const allowed = await canManageBuilder(decoded.uid, id);
  const role = await getUserRole(decoded.uid);
  if (!allowed && !isAdminRole(role) && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let patch: Record<string, unknown>;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    await updateBuilder(id, patch);
    const builder = await getBuilderById(id);
    return NextResponse.json({ builder });
  } catch (err) {
    console.error("PUT /api/builders/[id]", err);
    return NextResponse.json({ error: "Failed to update builder." }, { status: 500 });
  }
}
