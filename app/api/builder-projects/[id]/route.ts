import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import {
  getProjectById,
  publishBuilderWhenProjectPublished,
  updateProject,
} from "@/lib/builders/builders-server";
import { canManageProject } from "@/lib/builders/builder-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err) {
    console.error("GET /api/builder-projects/[id]", err);
    return NextResponse.json({ error: "Failed to fetch project." }, { status: 500 });
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
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const allowed = await canManageProject(decoded.uid, project);
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

  const isStaff = isAdminRole(role) || role === "superadmin";
  if (!isStaff) {
    delete patch.isFeatured;
    delete patch.featuredUntil;
  }

  try {
    await updateProject(id, patch);
    if (patch.isPublished === true) {
      await publishBuilderWhenProjectPublished(project.builderId);
    }
    const updated = await getProjectById(id);
    return NextResponse.json({ project: updated });
  } catch (err) {
    console.error("PUT /api/builder-projects/[id]", err);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}
