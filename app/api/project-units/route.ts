import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import {
  createUnit,
  getProjectById,
  listUnitsForProject,
} from "@/lib/builders/builders-server";
import { canManageBuilder } from "@/lib/builders/builder-auth";
import type { CreateUnitInput } from "@/lib/types/builder-microsite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required." }, { status: 400 });
  }
  try {
    const units = await listUnitsForProject(projectId);
    return NextResponse.json({ units });
  } catch (err) {
    console.error("GET /api/project-units", err);
    return NextResponse.json({ error: "Failed to fetch units." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: CreateUnitInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.projectId) {
    return NextResponse.json({ error: "projectId required." }, { status: 400 });
  }

  const project = await getProjectById(body.projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const allowed = await canManageBuilder(decoded.uid, project.builderId);
  const role = await getUserRole(decoded.uid);
  if (!allowed && !isAdminRole(role) && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const id = await createUnit(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/project-units", err);
    return NextResponse.json({ error: "Failed to create unit." }, { status: 500 });
  }
}
