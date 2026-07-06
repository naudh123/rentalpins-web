import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/firebase-auth-server";
import { createSelfServiceProject, listProjectsForOwner } from "@/lib/builders/builders-server";
import { isTricityProjectCity } from "@/lib/builders/tricity-cities";
import type { CreateSelfServiceProjectInput } from "@/lib/types/builder-microsite";

export async function GET(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const projects = await listProjectsForOwner(decoded.uid);
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("GET /api/my-projects", err);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: CreateSelfServiceProjectInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.companyName?.trim() || !body.projectName?.trim() || !body.citySlug?.trim()) {
    return NextResponse.json(
      { error: "Company name, project name, and city are required." },
      { status: 400 }
    );
  }

  if (!isTricityProjectCity(body.citySlug)) {
    return NextResponse.json(
      { error: "Projects are currently accepted in Chandigarh Tricity only." },
      { status: 400 }
    );
  }

  try {
    const result = await createSelfServiceProject(body, decoded.uid);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/my-projects", err);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
