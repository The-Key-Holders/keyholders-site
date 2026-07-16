import {
  ADVISOR_AI_PROMPT_VERSION,
  composeAdvisorAiSystemPrompt,
} from "@/lib/advisor-ai";
import { retrieveManualContext } from "@/lib/advisor-ai/retrieve";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 6_000;
const MAX_HISTORY = 20;
const DEFAULT_MODEL =
  process.env.ADVISOR_AI_MODEL?.trim() ||
  process.env.XAI_MODEL?.trim() ||
  "grok-4.5";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Simple in-memory rate limit (best-effort on serverless)
const hits = new Map<string, { n: number; t: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 40;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || now - cur.t > RATE_WINDOW_MS) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  if (cur.n >= RATE_MAX) return false;
  cur.n += 1;
  return true;
}

export async function GET() {
  const key = process.env.XAI_API_KEY?.trim();
  return NextResponse.json({
    configured: Boolean(key),
    provider: "xAI Grok",
    model: key ? DEFAULT_MODEL : null,
    agentId: "ca-911-advisor-ai",
    promptVersion: ADVISOR_AI_PROMPT_VERSION,
    scope: "password-gated-ca-911-advisor-ai",
    separateFrom: "advisor-tools-help-agent",
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "CA 9-1-1 Advisor AI is not configured (set XAI_API_KEY on the server).",
      },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait and try again." },
      { status: 429 }
    );
  }

  let body: {
    message?: string;
    history?: ChatMessage[];
    roleHint?: string;
  } = {};
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

  const retrieved = retrieveManualContext(message, 4);
  const system = composeAdvisorAiSystemPrompt(retrieved || undefined);

  const roleLine =
    body.roleHint && body.roleHint.trim()
      ? `[User role context for this session: ${body.roleHint.trim()}]\n\n`
      : "";

  const messages = [
    { role: "system" as const, content: system },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: roleLine + message },
  ];

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 3200,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
      message?: string;
    };

    if (!res.ok) {
      const detail =
        data.error?.message || data.message || `xAI error (${res.status})`;
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "";
    if (!reply) {
      return NextResponse.json(
        { error: "Empty reply from Grok. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      reply,
      model: DEFAULT_MODEL,
      provider: "xAI Grok",
      agentId: "ca-911-advisor-ai",
      promptVersion: ADVISOR_AI_PROMPT_VERSION,
      retrievalUsed: Boolean(retrieved),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
