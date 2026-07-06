import { NextResponse } from "next/server";
import { persistConversationLead } from "@/lib/agent/persist-conversation-lead";
import { normalizeIndianPhone } from "@/lib/agent/contact-extraction";

export const maxDuration = 30;

/** Direct lead capture from chat UI form — does not rely on the LLM calling tools. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      name?: string;
      phone?: string;
      email?: string;
      budgetRange?: string;
      projectId?: string;
      citySlug?: string;
      projectSlug?: string;
      projectName?: string;
      interestedProjectName?: string;
      message?: string;
    };

    const sessionId = String(body.sessionId ?? "").trim();
    const phone = normalizeIndianPhone(body.phone ?? "");
    const name = body.name?.trim();
    const budgetRange = body.budgetRange?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Valid 10-digit mobile required." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!budgetRange) {
      return NextResponse.json({ error: "Budget is required." }, { status: 400 });
    }

    const result = await persistConversationLead({
      sessionId,
      projectId: body.projectId ?? null,
      citySlug: body.citySlug ?? null,
      projectSlug: body.projectSlug ?? null,
      projectName: body.projectName ?? null,
      interestedProjectName: body.interestedProjectName ?? body.projectName ?? null,
      messages: [],
      contact: {
        name,
        phone,
        email: body.email?.trim() || undefined,
        budgetRange,
      },
      note: body.message?.trim() || "Registered via chat callback form.",
      source: "project_agent",
    });

    if (!result.created) {
      if (result.reason === "already_converted" && result.leadId) {
        return NextResponse.json({
          success: true,
          leadId: result.leadId,
          message: "Your enquiry is already registered. Our team will call you shortly.",
        });
      }
      return NextResponse.json(
        { success: false, error: result.reason ?? "Could not save lead.", leadId: result.leadId },
        { status: result.reason === "already_converted" ? 200 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: result.leadId,
      message: "Lead saved. Our team at +91 9915061640 will call you shortly.",
    });
  } catch (error) {
    console.error("[agent/capture-lead]", error);
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
  }
}
