import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getDeveloperOffering, recommendPropertyPath, searchAgentFaqs } from "./agent-knowledge";
import { getPlatformOverview, searchAreaGuides, searchProjects } from "./knowledge";
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
