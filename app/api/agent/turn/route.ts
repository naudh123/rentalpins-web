import { type UIMessage } from "ai";
import { NextResponse } from "next/server";
import {
  hashIpForAgent,
  saveAgentConversation,
} from "@/lib/agent/conversations";
import { isAgentConfigured } from "@/lib/agent/env";
import { extractMapPathFromMessages } from "@/lib/agent/lead-scoring";
import {
  loadProjectAgentBundle,
  loadProjectAgentBundleBySlug,
  loadProjectCatalogForAgent,
} from "@/lib/agent/project-agent-context";
import { formatProjectsIndexContext } from "@/lib/agent/project-agent-knowledge";
import { checkAgentRateLimit, getAgentClientKey } from "@/lib/agent/rate-limit";
import { resolveAgentAuthContext } from "@/lib/agent/resolve-request-context";
import { runAgentTurn } from "@/lib/agent/run-agent";
import type { AgentChatRequestBody, AgentSurface } from "@/lib/agent/types";

export const maxDuration = 60;

function parseSurface(value: unknown): AgentSurface {
  if (value === "map" || value === "showcase" || value === "advisor" || value === "project") {
    return value;
  }
  return "advisor";
}

function parseTransactionType(value: unknown): "rent" | "sale" {
  return value === "sale" ? "sale" : "rent";
}

/** Non-streaming agent turn — used by Flutter mobile app. */
export async function POST(request: Request) {
  if (!isAgentConfigured) {
    return NextResponse.json(
      { error: "Property agent is not configured. Set OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const clientKey = getAgentClientKey(request);
  const rateLimit = checkAgentRateLimit(clientKey);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Daily agent message limit reached." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as AgentChatRequestBody;
    const messages = (body.messages ?? []) as UIMessage[];
    const surface = parseSurface(body.surface);
    const transactionType = parseTransactionType(body.transactionType);
    const sessionId = String(body.sessionId ?? "anonymous").slice(0, 120);
    const { userId, userContextPrompt } = await resolveAgentAuthContext(request);

    let projectBundle = null;
    let projectsIndexContext: string | undefined;
    let projectId: string | null = null;
    let projectName: string | null = null;
    let projectCatalog: Awaited<ReturnType<typeof loadProjectCatalogForAgent>> = [];

    if (surface === "project") {
      projectCatalog = await loadProjectCatalogForAgent(body.citySlug);
      if (body.projectId) {
        projectBundle = await loadProjectAgentBundle(body.projectId);
      } else if (body.projectSlug && body.citySlug) {
        projectBundle = await loadProjectAgentBundleBySlug(body.citySlug, body.projectSlug);
      }
      if (projectBundle) {
        projectId = projectBundle.project.id;
        projectName = projectBundle.project.name;
      } else {
        projectsIndexContext = formatProjectsIndexContext(body.citySlug ?? null, projectCatalog);
      }
    }

    let handoffInterest: string | undefined;
    let handoffSummary: string | undefined;

    const result = await runAgentTurn({
      messages,
      surface,
      transactionType: surface === "project" ? "sale" : transactionType,
      userContextPrompt,
      projectBundle,
      citySlug: body.citySlug ?? projectBundle?.project.citySlug ?? null,
      projectsIndexContext,
      sessionId,
      projectCatalog,
      callbacks: {
        onContactHandoff: (params) => {
          handoffInterest = params.interest;
          handoffSummary = params.summary;
        },
      },
    });

    await saveAgentConversation({
      sessionId,
      ipHash: hashIpForAgent(clientKey),
      userId,
      surface,
      transactionType: surface === "project" ? "sale" : transactionType,
      messages: result.allMessages,
      handoffInterest,
      handoffSummary,
      projectId,
      projectName,
      citySlug: body.citySlug ?? projectBundle?.project.citySlug ?? null,
      projectSlug: body.projectSlug ?? projectBundle?.project.slug ?? null,
    }).catch((err) => console.error("[agent/turn] save failed", err));

    const mapPath = extractMapPathFromMessages(result.allMessages);

    return NextResponse.json({
      text: result.text,
      toolsUsed: result.toolCalls,
      mapPath,
      sessionId,
    });
  } catch (error) {
    console.error("[agent/turn]", error);
    return NextResponse.json({ error: "Failed to process your message." }, { status: 500 });
  }
}
