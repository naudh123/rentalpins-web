import { createHash } from "node:crypto";
import type { UIMessage } from "ai";

export function hashAgentClientKey(key: string): string {
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("");
}

export function extractToolsFromMessages(messages: UIMessage[]): string[] {
  const tools = new Set<string>();
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type.startsWith("tool-")) {
        tools.add(part.type.replace("tool-", ""));
      }
    }
  }
  return Array.from(tools);
}

export function buildConversationSummary(messages: UIMessage[]): string | null {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => getMessageText(m.parts))
    .filter(Boolean);
  if (userMessages.length === 0) return null;
  return userMessages.slice(-3).join(" | ").slice(0, 500);
}

export function serializeAgentTranscript(messages: UIMessage[], maxChars = 8000): string {
  const lines: string[] = [];
  for (const message of messages) {
    const text = getMessageText(message.parts).trim();
    if (!text) continue;
    lines.push(`${message.role.toUpperCase()}: ${text}`);
  }
  const joined = lines.join("\n\n");
  return joined.length > maxChars ? `${joined.slice(0, maxChars)}…` : joined;
}

export function extractMapPathFromMessages(messages: UIMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "assistant") continue;
    const text = getMessageText(message.parts);
    const match = text.match(/(\/(?:buy\/)?search\?[^\s)\]"']+)/);
    if (match?.[1]) return match[1];
  }
  return null;
}

export interface AgentLeadScore {
  score: number;
  signals: string[];
  highIntent: boolean;
  interest?: string;
}

export function scoreAgentConversation(params: {
  messages: UIMessage[];
  toolsUsed: string[];
  surface: string;
}): AgentLeadScore {
  let score = 0;
  const signals: string[] = [];

  const toolPoints: Record<string, number> = {
    scheduleContact: 50,
    buildMapSearch: 20,
    compareAreas: 12,
    matchBuyerRequirement: 25,
    getPlatformOverview: 18,
    getDeveloperOffering: 20,
    recommendNextStep: 14,
    sampleListings: 10,
    searchProjects: 12,
    searchAreaGuides: 8,
    searchRentGuides: 8,
    searchBuyGuides: 6,
    searchRentBlog: 6,
    searchFaqs: 8,
    getMarketInsight: 10,
    estimateAffordability: 12,
  };

  for (const tool of params.toolsUsed) {
    const pts = toolPoints[tool];
    if (pts) {
      score += pts;
      signals.push(`tool:${tool}`);
    }
  }

  const userMessages = params.messages.filter((m) => m.role === "user");
  if (userMessages.length >= 3) {
    score += 10;
    signals.push("engaged_conversation");
  }

  const userText = userMessages
    .map((m) => getMessageText(m.parts))
    .join(" ")
    .toLowerCase();

  const patterns: { re: RegExp; pts: number; signal: string }[] = [
    { re: /\b(lakh|crore|₹|budget|under \d)/i, pts: 12, signal: "budget_mentioned" },
    { re: /\b(invest|investment|roi|rental yield)/i, pts: 10, signal: "invest_intent" },
    { re: /\b(white.?label|build|develop|platform|portal)/i, pts: 15, signal: "dev_client_intent" },
    { re: /\b(3bhk|2bhk|bhk|flat|plot|villa)/i, pts: 8, signal: "property_type_mentioned" },
    { re: /\b(mohali|zirakpur|kharar|panchkula|tricity)/i, pts: 6, signal: "tricity_area" },
  ];

  for (const { re, pts, signal } of patterns) {
    if (re.test(userText)) {
      score += pts;
      signals.push(signal);
    }
  }

  if (params.surface === "showcase" && params.toolsUsed.includes("getPlatformOverview")) {
    score += 15;
    signals.push("showcase_platform_interest");
  }

  const highIntent =
    score >= 40 ||
    params.toolsUsed.includes("scheduleContact") ||
    params.toolsUsed.includes("matchBuyerRequirement") ||
    (params.surface === "showcase" && score >= 30);

  let interest: string | undefined;
  if (params.toolsUsed.includes("scheduleContact")) {
    interest = params.surface === "showcase" ? "PropTech strategy call" : "Agent follow-up";
  } else if (params.surface === "showcase") interest = "PropTech development";
  else if (params.toolsUsed.includes("matchBuyerRequirement")) interest = "Buy requirement";
  else if (params.toolsUsed.includes("getDeveloperOffering")) interest = "White-label PropTech";
  else if (params.toolsUsed.includes("buildMapSearch")) interest = "Property search";

  return { score, signals, highIntent, interest };
}
