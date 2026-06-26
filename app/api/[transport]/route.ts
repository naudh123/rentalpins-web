import { createMcpHandler } from "mcp-handler";
import { NextResponse } from "next/server";
import { isMcpConfigured, mcpApiKey } from "@/lib/agent/env";
import { registerAgentMcpTools } from "@/lib/agent/mcp-tools";

function isAuthorized(request: Request) {
  if (!isMcpConfigured) return true;
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return bearer === mcpApiKey;
}

const handler = createMcpHandler(
  (server) => {
    registerAgentMcpTools(server);
  },
  {
    capabilities: { tools: {} },
  },
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: false,
  }
);

async function guardedHandler(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Set Authorization: Bearer MCP_API_KEY." },
      { status: 401 }
    );
  }
  return handler(request);
}

export { guardedHandler as GET, guardedHandler as POST, guardedHandler as DELETE };
