import {
  convertToModelMessages,
  generateText,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { agentMaxSteps, agentModel } from "@/lib/agent/env";
import { buildAgentSystemPrompt } from "@/lib/agent/system-prompt";
import {
  createPropertyAgentTools,
  type AgentToolCallbacks,
} from "@/lib/agent/tools";
import { createProjectAgentTools } from "@/lib/agent/project-agent-tools";
import type { ProjectAgentBundle } from "@/lib/agent/project-agent-knowledge";
import type { AgentSurface } from "@/lib/agent/types";
import type { BuilderProject } from "@/lib/types/builder-microsite";

export interface AgentRunParams {
  messages: UIMessage[];
  surface: AgentSurface;
  transactionType: "rent" | "sale";
  callbacks?: AgentToolCallbacks;
  userContextPrompt?: string;
  projectBundle?: ProjectAgentBundle | null;
  citySlug?: string | null;
  projectsIndexContext?: string;
  sessionId?: string;
  projectCatalog?: BuilderProject[];
}

export function buildAgentTools(
  params: Pick<
    AgentRunParams,
    "surface" | "transactionType" | "callbacks" | "projectBundle" | "citySlug" | "sessionId" | "projectCatalog"
  >
) {
  if (params.surface === "project") {
    return createProjectAgentTools(
      params.projectBundle ?? null,
      params.citySlug ?? null,
      { ...(params.callbacks ?? {}), sessionId: params.sessionId },
      params.projectCatalog ?? []
    );
  }
  return createPropertyAgentTools(
    {
      surface: params.surface,
      defaultTransactionType: params.transactionType,
    },
    params.callbacks ?? {}
  );
}

export async function streamAgentChat(params: AgentRunParams) {
  const tools = buildAgentTools(params);
  return streamText({
    model: openai(agentModel),
    system: buildAgentSystemPrompt({
      surface: params.surface,
      transactionType: params.transactionType,
      userContextPrompt: params.userContextPrompt,
      projectBundle: params.projectBundle,
      projectsIndexContext: params.projectsIndexContext,
    }),
    messages: await convertToModelMessages(params.messages),
    tools,
    stopWhen: stepCountIs(agentMaxSteps),
  });
}

export async function runAgentTurn(params: AgentRunParams) {
  const tools = buildAgentTools(params);
  const result = await generateText({
    model: openai(agentModel),
    system: buildAgentSystemPrompt({
      surface: params.surface,
      transactionType: params.transactionType,
      userContextPrompt: params.userContextPrompt,
      projectBundle: params.projectBundle,
      projectsIndexContext: params.projectsIndexContext,
    }),
    messages: await convertToModelMessages(params.messages),
    tools,
    stopWhen: stepCountIs(agentMaxSteps),
  });

  const assistantMessage: UIMessage = {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    parts: [{ type: "text", text: result.text }],
  };

  return {
    text: result.text,
    assistantMessage,
    allMessages: [...params.messages, assistantMessage],
    toolCalls:
      result.toolCalls?.flatMap((t) => (t?.toolName ? [t.toolName] : [])) ?? [],
  };
}
