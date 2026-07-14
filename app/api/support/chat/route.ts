import { PUBLIC_SITE_SYSTEM_CONTEXT } from "@/lib/public-site-agent";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TASKADE_PROMPT_URL = "https://www.taskade.com/api/v2/promptAgent";
const MAX_MESSAGE = 2_000;
const MAX_HISTORY = 12;

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Simple in-memory rate limit per IP (best-effort on serverless). */
const hits = new Map<string, { count: number; reset: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 24;

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (row.count >= RATE_MAX) return false;
  row.count += 1;
  return true;
}

function getTaskadeConfig() {
  const apiKey =
    process.env.TASKADE_API_KEY?.trim() || process.env.TASKADE_ACCESS_TOKEN?.trim();
  const spaceId = process.env.TASKADE_SPACE_ID?.trim() || "912rDhsLvyDzJQ5r";
  const agentId =
    process.env.TASKADE_PUBLIC_AGENT_ID?.trim() ||
    process.env.TASKADE_AGENT_ID?.trim() ||
    "01KXFEPH8H7ZSKHPF2H02XKDAB";
  return { apiKey, spaceId, agentId };
}

function buildPrompt(message: string, history: ChatMessage[]): string {
  const recent = history.slice(-MAX_HISTORY);
  const lines = recent.map((m) => {
    const who = m.role === "user" ? "User" : "Assistant";
    return `${who}: ${m.content.trim()}`;
  });
  return [
    PUBLIC_SITE_SYSTEM_CONTEXT,
    "",
    "Continue this public site guide conversation.",
    recent.length ? "Conversation so far:" : "",
    ...lines,
    "",
    `User: ${message.trim()}`,
    "Assistant:",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET() {
  const { apiKey, agentId } = getTaskadeConfig();
  return NextResponse.json({
    configured: Boolean(apiKey),
    provider: "Taskade",
    agentId: apiKey ? agentId : null,
    scope: "public-site",
  });
}

export async function POST(request: Request) {
  const { apiKey, spaceId, agentId } = getTaskadeConfig();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Public site agent is not configured (set TASKADE_API_KEY on the server).",
      },
      { status: 503 }
    );
  }

  if (!rateLimit(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a minute and try again." },
      { status: 429 }
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
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE} characters)` },
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
        .slice(-MAX_HISTORY)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, MAX_MESSAGE),
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
      return NextResponse.json({ error: detail }, { status: 502 });
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
      provider: "Taskade",
      agentId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upstream agent error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
