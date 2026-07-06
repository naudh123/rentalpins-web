import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/firebase-auth-server";
import { updateLead } from "@/lib/builders/builders-server";
import { canManageLeads } from "@/lib/builders/builder-auth";
import { adminDb } from "@/lib/firebase-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;
  const snap = await adminDb.collection("project_leads").doc(id).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!(await canManageLeads(decoded.uid))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let patch: Record<string, unknown>;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    await updateLead(id, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/project-leads/[id]", err);
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
  }
}
