import { type UIMessage } from "ai";
import { NextResponse } from "next/server";
import {
  hashIpForAgent,
  saveAgentConversation,
} from "@/lib/agent/conversations";
import { isAgentConfigured } from "@/lib/agent/env";
import { checkAgentRateLimit, getAgentClientKey } from "@/lib/agent/rate-limit";
import { streamAgentChat } from "@/lib/agent/run-agent";
import type { AgentChatRequestBody, AgentSurface } from "@/lib/agent/types";

export const maxDuration = 60;

function parseSurface(value: unknown): AgentSurface {
  if (value === "map" || value === "showcase" || value === "advisor") return value;
  return "advisor";
}

function parseTransactionType(value: unknown): "rent" | "sale" {
  return value === "sale" ? "sale" : "rent";
}

export async function POST(request: Request) {
  if (!isAgentConfigured) {
    return NextResponse.json(
      {
        error:
          "Property agent is not configured. Set OPENAI_API_KEY on the server (Vercel production env).",
      },
      { status: 503 }
    );
  }

  const clientKey = getAgentClientKey(request);
  const rateLimit = checkAgentRateLimit(clientKey);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Daily agent message limit reached. Try again tomorrow or use the map filters directly.",
      },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as AgentChatRequestBody;
    const messages = (body.messages ?? []) as UIMessage[];
    const surface = parseSurface(body.surface);
    const transactionType = parseTransactionType(body.transactionType);
    const sessionId = String(body.sessionId ?? "anonymous").slice(0, 120);

    let handoffInterest: string | undefined;
    let handoffSummary: string | undefined;

    const result = await streamAgentChat({
      messages,
      surface,
      transactionType,
      callbacks: {
        onContactHandoff: (params) => {
          handoffInterest = params.interest;
          handoffSummary = params.summary;
        },
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: allMessages }) => {
        await saveAgentConversation({
          sessionId,
          ipHash: hashIpForAgent(clientKey),
          surface,
          transactionType,
          messages: allMessages,
          handoffInterest,
          handoffSummary,
        }).catch((err) => console.error("[agent/chat] save failed", err));
      },
    });
  } catch (error) {
    console.error("[agent/chat]", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}
