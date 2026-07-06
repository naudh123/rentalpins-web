import { NextResponse } from "next/server";
import { isValidLeadEmail, isValidLeadPhone } from "@/lib/builders/tricity-cities";
import {
  createLead,
  getBuilderById,
  getProjectById,
  listLeads,
} from "@/lib/builders/builders-server";
import { sendProjectLeadEmail } from "@/lib/builders/project-lead-email";
import { verifyAuthToken, getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import type { CreateLeadInput } from "@/lib/types/builder-microsite";

export async function GET(request: Request) {
  const decoded = await verifyAuthToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const role = await getUserRole(decoded.uid);
  if (!isAdminRole(role) && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const builderId = searchParams.get("builderId") || undefined;

  try {
    const leads = await listLeads(builderId);
    return NextResponse.json({ leads });
  } catch (err) {
    console.error("GET /api/project-leads", err);
    return NextResponse.json({ error: "Failed to fetch leads." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateLeadInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.builderId || !body.name?.trim() || !body.phone?.trim() || !body.email?.trim()) {
    return NextResponse.json(
      { error: "Name, phone, and email are required." },
      { status: 400 }
    );
  }

  if (!isValidLeadPhone(body.phone)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  if (!isValidLeadEmail(body.email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const id = await createLead({
      ...body,
      email: body.email.trim(),
      source: body.source || "project_page",
    });

    const [project, builder] = await Promise.all([
      body.projectId ? getProjectById(body.projectId) : Promise.resolve(null),
      getBuilderById(body.builderId),
    ]);

    void sendProjectLeadEmail({
      leadId: id,
      input: { ...body, email: body.email.trim(), source: body.source || "project_page" },
      projectName: project?.name ?? null,
      builderName: builder?.name ?? project?.builderName ?? null,
      citySlug: project?.citySlug ?? null,
    }).catch((err) => console.error("[project-leads] email notify failed:", err));

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/project-leads", err);
    return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
  }
}
