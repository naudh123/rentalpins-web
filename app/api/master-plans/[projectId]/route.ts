import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import {
  getMasterPlan,
  getProjectById,
  saveMasterPlan,
} from "@/lib/builders/builders-server";
import { canManageBuilder } from "@/lib/builders/builder-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  try {
    const plan = await getMasterPlan(projectId);
    return NextResponse.json({ masterPlan: plan });
  } catch (err) {
    console.error("GET /api/master-plans/[projectId]", err);
    return NextResponse.json({ error: "Failed to fetch master plan." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const allowed = await canManageBuilder(decoded.uid, project.builderId);
  const role = await getUserRole(decoded.uid);
  if (!allowed && !isAdminRole(role) && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    await saveMasterPlan(projectId, project.builderId, {
      defaultImageUrl: (body.defaultImageUrl as string) || null,
      angles: Array.isArray(body.angles) ? body.angles : [],
    });

    if (body.defaultImageUrl) {
      const { updateProject } = await import("@/lib/builders/builders-server");
      await updateProject(projectId, {
        masterPlanImageUrl: body.defaultImageUrl,
      });
    }

    const masterPlan = await getMasterPlan(projectId);
    return NextResponse.json({ masterPlan });
  } catch (err) {
    console.error("PUT /api/master-plans/[projectId]", err);
    return NextResponse.json({ error: "Failed to save master plan." }, { status: 500 });
  }
}
