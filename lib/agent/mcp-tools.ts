import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getDeveloperOffering, recommendPropertyPath, searchAgentFaqs } from "./agent-knowledge";
import { getPlatformOverview, searchAreaGuides, searchProjects } from "./knowledge";
import { formatTricityAreaProfile, searchTricityAreas } from "./tricity-area-knowledge";
import {
  formatInvestmentPlaybook,
  searchTricityInvestments,
} from "./tricity-investment-knowledge";
import { formatPlanningTopic, searchTricityPlanning } from "./tricity-planning-knowledge";
import {
  formatTransactionGuide,
  searchPropertyTransactionGuides,
} from "./tricity-transaction-knowledge";
import { fetchAgentMetrics } from "./metrics";
import { isRagAvailable, searchKnowledge } from "./rag";

function jsonText(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerAgentMcpTools(server: McpServer) {
  server.registerTool(
    "search_knowledge",
    {
      title: "Search RentalPins Knowledge",
      description:
        "Vector RAG over full blog MDX plus keyword fallback — due diligence, rent/buy guides, locality advice.",
      inputSchema: {
        query: z.string().describe("Search query"),
        limit: z.number().min(1).max(8).optional(),
      },
    },
    async ({ query, limit }) => {
      const ragReady = await isRagAvailable();
      const { results, mode } = await searchKnowledge(String(query), limit ?? 5);
      return jsonText({ ragReady, mode, results });
    }
  );

  server.registerTool(
    "search_area_guides",
    {
      title: "Search Buy Area Guides",
      description: "Tricity buy hubs: Mohali, Kharar, Zirakpur, Panchkula.",
      inputSchema: { query: z.string() },
    },
    async ({ query }) => jsonText({ guides: searchAreaGuides(String(query), 4) })
  );

  server.registerTool(
    "search_tricity_areas",
    {
      title: "Search Tricity Localities",
      description:
        "Core hubs + outer belts: Kurali, Banur, Chunni, Rajpura, Landran, Derabassi, Lalru, Siswan, etc.",
      inputSchema: { query: z.string(), limit: z.number().min(1).max(6).optional() },
    },
    async ({ query, limit }) =>
      jsonText({
        areas: searchTricityAreas(String(query), limit ?? 4).map(formatTricityAreaProfile),
      })
  );

  server.registerTool(
    "search_tricity_investments",
    {
      title: "Search Tricity Investment Playbooks",
      description:
        "Yield, appreciation, budget-band strategies — Mohali, Zirakpur, Kharar, outer belts, projects.",
      inputSchema: { query: z.string(), limit: z.number().min(1).max(6).optional() },
    },
    async ({ query, limit }) =>
      jsonText({
        playbooks: searchTricityInvestments(String(query), limit ?? 4).map(formatInvestmentPlaybook),
      })
  );

  server.registerTool(
    "search_tricity_planning",
    {
      title: "Search Tricity Planning & Zoning",
      description:
        "Master plan, MC limits, residential/mixed-use/industrial, PSIEC, IT Park vs IT City.",
      inputSchema: { query: z.string(), limit: z.number().min(1).max(6).optional() },
    },
    async ({ query, limit }) =>
      jsonText({
        topics: searchTricityPlanning(String(query), limit ?? 4).map(formatPlanningTopic),
      })
  );

  server.registerTool(
    "search_property_transaction_guides",
    {
      title: "Property Transaction Guides",
      description:
        "Sale agreement, sale deed, ownership transfer, precautions — RentalPins guidance.",
      inputSchema: { query: z.string(), limit: z.number().min(1).max(6).optional() },
    },
    async ({ query, limit }) =>
      jsonText({
        guides: searchPropertyTransactionGuides(String(query), limit ?? 4).map(formatTransactionGuide),
      })
  );

  server.registerTool(
    "search_faqs",
    {
      title: "Search Agent FAQs",
      description: "Curated FAQs — platform, objections, PG, invest, white-label.",
      inputSchema: { query: z.string() },
    },
    async ({ query }) => jsonText({ faqs: searchAgentFaqs(String(query), 5) })
  );

  server.registerTool(
    "get_platform_overview",
    {
      title: "RentalPins Platform Overview",
      description: "Modules, stack, and demo paths.",
      inputSchema: {},
    },
    async () => jsonText(getPlatformOverview())
  );

  server.registerTool(
    "get_developer_offering",
    {
      title: "White-label PropTech Offering",
      description: "Engagement tiers and modules Rudder Tech ships.",
      inputSchema: {},
    },
    async () => jsonText(getDeveloperOffering())
  );

  server.registerTool(
    "recommend_next_step",
    {
      title: "Recommend User Path",
      description: "Route rent/buy/invest/sell/developer intent to paths.",
      inputSchema: {
        need: z.string(),
        budget: z.string().optional(),
      },
    },
    async ({ need, budget }) =>
      jsonText(recommendPropertyPath({ need: String(need), budget: budget ? String(budget) : undefined }))
  );

  server.registerTool(
    "search_projects",
    {
      title: "Search Developer Projects",
      description: "Tricity sample projects on RentalPins Buy.",
      inputSchema: { query: z.string() },
    },
    async ({ query }) => jsonText({ projects: searchProjects(String(query), undefined, 4) })
  );

  server.registerTool(
    "get_agent_metrics",
    {
      title: "Agent Metrics Summary",
      description: "Recent agent sessions, tools, and high-intent counts (admin data).",
      inputSchema: { days: z.number().optional() },
    },
    async ({ days }) => jsonText(await fetchAgentMetrics(days ?? 7))
  );
}
