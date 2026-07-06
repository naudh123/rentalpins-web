import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import {
  getUnitById,
  updateUnit,
  deleteUnit,
} from "@/lib/builders/builders-server";
import { canManageBuilder } from "@/lib/builders/builder-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;
  const unit = await getUnitById(id);
  if (!unit) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const allowed = await canManageBuilder(decoded.uid, unit.builderId);
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
    await updateUnit(id, patch);
    const updated = await getUnitById(id);
    return NextResponse.json({ unit: updated });
  } catch (err) {
    console.error("PATCH /api/project-units/[id]", err);
    return NextResponse.json({ error: "Failed to update unit." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyAuthToken(_request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;
  const unit = await getUnitById(id);
  if (!unit) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const allowed = await canManageBuilder(decoded.uid, unit.builderId);
  const role = await getUserRole(decoded.uid);
  if (!allowed && !isAdminRole(role) && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    await deleteUnit(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/project-units/[id]", err);
    return NextResponse.json({ error: "Failed to delete unit." }, { status: 500 });
  }
}
