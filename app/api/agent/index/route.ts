import { NextResponse } from "next/server";
import { agentIndexSecret, isAgentConfigured } from "@/lib/agent/env";
import { indexBlogKnowledge } from "@/lib/agent/rag-index";

export const maxDuration = 120;

function isAuthorized(request: Request): boolean {
  if (!agentIndexSecret) return false;
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const urlSecret = new URL(request.url).searchParams.get("secret");
  return bearer === agentIndexSecret || urlSecret === agentIndexSecret;
}

/** POST — embed full blog MDX into agent_knowledge_chunks (vector RAG). */
export async function POST(request: Request) {
  if (!isAgentConfigured) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured." }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Set Authorization: Bearer AGENT_INDEX_SECRET." },
      { status: 401 }
    );
  }

  const result = await indexBlogKnowledge();

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Index failed" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    indexed: result.indexed,
    posts: result.posts,
  });
}
