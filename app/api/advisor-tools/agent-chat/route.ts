import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TASKADE_PROMPT_URL = "https://www.taskade.com/api/v2/promptAgent";
const MAX_MESSAGE_LEN = 4_000;
const MAX_HISTORY = 12;

type ChatMessage = { role: "user" | "assistant"; content: string };

function getTaskadeConfig() {
  const apiKey =
    process.env.TASKADE_API_KEY?.trim() || process.env.TASKADE_ACCESS_TOKEN?.trim();
  const spaceId = process.env.TASKADE_SPACE_ID?.trim() || "912rDhsLvyDzJQ5r";
  const agentId =
    process.env.TASKADE_AGENT_ID?.trim() || "01KXFEPH8H7ZSKHPF2H02XKDAB";
  return { apiKey, spaceId, agentId };
}

function buildPrompt(message: string, history: ChatMessage[]): string {
  const recent = history.slice(-MAX_HISTORY);
  if (recent.length === 0) return message.trim();

  const lines = recent.map((m) => {
    const who = m.role === "user" ? "User" : "Assistant";
    return `${who}: ${m.content.trim()}`;
  });
  return [
    "Continue this private Advisor Tools help conversation.",
    "Stay in role as the New Hire + Automation Tool Help Agent.",
    "Do not claim you are publicly available; this chat is only for password-gated Advisor Tools users.",
    "",
    "Conversation so far:",
    ...lines,
    "",
    `User: ${message.trim()}`,
    "Assistant:",
  ].join("\n");
}

export async function POST(request: Request) {
  const { apiKey, spaceId, agentId } = getTaskadeConfig();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Help agent is not configured (set TASKADE_API_KEY or TASKADE_ACCESS_TOKEN on the server).",
      },
      { status: 503 }
    );
  }

  let body: { message?: string; history?: ChatMessage[] } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LEN} characters)` },
      { status: 400 }
    );
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, MAX_MESSAGE_LEN),
        }))
    : [];

  const prompt = buildPrompt(message, history);

  try {
    const res = await fetch(TASKADE_PROMPT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spaceId, agentId, prompt }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      summary?: string;
      message?: string;
      error?: string;
      item?: { summary?: string; content?: string };
    };

    if (!res.ok) {
      const detail =
        data.message || data.error || `Taskade promptAgent failed (${res.status})`;
      return NextResponse.json(
        { error: detail },
        { status: res.status === 401 || res.status === 403 ? 502 : 502 }
      );
    }

    const reply =
      (typeof data.summary === "string" && data.summary.trim()) ||
      (typeof data.item?.summary === "string" && data.item.summary.trim()) ||
      (typeof data.item?.content === "string" && data.item.content.trim()) ||
      "";

    if (!reply) {
      return NextResponse.json(
        { error: "Agent returned an empty reply. Try again in a moment." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      reply,
      agentId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upstream agent error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function GET() {
  const { apiKey, agentId } = getTaskadeConfig();
  return NextResponse.json({
    configured: Boolean(apiKey),
    agentId: apiKey ? agentId : null,
    // Never expose the token
  });
}
