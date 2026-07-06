import { NextResponse } from "next/server";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import { canManageBuilder } from "@/lib/builders/builder-auth";
import {
  createProject,
  listProjects,
} from "@/lib/builders/builders-server";
import type { CreateProjectInput } from "@/lib/types/builder-microsite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") === "true";
  const builderId = searchParams.get("builderId") || undefined;

  try {
    let projects = await listProjects(publishedOnly);
    if (builderId) {
      projects = projects.filter((p) => p.builderId === builderId);
    }
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("GET /api/builder-projects", err);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const role = await getUserRole(decoded.uid);
  const isStaff = isAdminRole(role) || role === "superadmin";

  let body: CreateProjectInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.name?.trim() || !body.slug?.trim() || !body.builderId || !body.citySlug) {
    return NextResponse.json(
      { error: "Name, slug, builderId, and citySlug are required." },
      { status: 400 }
    );
  }

  if (!isStaff) {
    const allowed = await canManageBuilder(decoded.uid, body.builderId);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  }

  try {
    const id = await createProject(
      body,
      decoded.uid,
      isStaff ? undefined : { ownerUserId: decoded.uid, leadRouting: "platform" }
    );
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/builder-projects", err);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
