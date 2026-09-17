import {
  composePublicSiteSystemPrompt,
  looksLikeInjection,
  PUBLIC_SITE_REMINDER,
  PUBLIC_SITE_REFUSAL,
  sanitizePublicChatHistory,
  sanitizePublicPath,
  sanitizePublicReply,
  wrapUntrustedVisitorMessage,
} from "@/lib/public-site-agent";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 2_000;
const MAX_HISTORY = 12;
const DEFAULT_MODEL = process.env.XAI_MODEL?.trim() || "grok-4.6";

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

function unavailable(status = 503) {
  return NextResponse.json(
    { error: "The site guide is unavailable right now. Please try again shortly." },
    { status }
  );
}

export async function GET() {
  const apiKey = process.env.XAI_API_KEY?.trim();
  return NextResponse.json({
    configured: Boolean(apiKey),
    scope: "public-site",
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) return unavailable(503);

  if (!rateLimit(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: { message?: string; history?: unknown; path?: unknown } = {};
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

  let history = sanitizePublicChatHistory(
    body.history,
    MAX_HISTORY,
    MAX_MESSAGE
  );
  const last = history[history.length - 1];
  if (last?.role === "user" && last.content === message) {
    history = history.slice(0, -1);
  }
  const system = composePublicSiteSystemPrompt(sanitizePublicPath(body.path));

  const messages = [
    { role: "system" as const, content: system },
    ...history.map((m) =>
      m.role === "user"
        ? { role: "user" as const, content: wrapUntrustedVisitorMessage(m.content) }
        : { role: "assistant" as const, content: m.content }
    ),
    { role: "system" as const, content: PUBLIC_SITE_REMINDER },
    {
      role: "user" as const,
      content: wrapUntrustedVisitorMessage(message),
    },
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
        temperature: looksLikeInjection(message) ? 0.15 : 0.35,
        max_tokens: 700,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      choices?: { message?: { content?: string } }[];
    };

    if (!res.ok) return unavailable(502);

    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    if (!raw) return unavailable(502);

    const { reply } = sanitizePublicReply(raw);
    return NextResponse.json({
      ok: true,
      reply: reply || PUBLIC_SITE_REFUSAL,
    });
  } catch {
    return unavailable(502);
  }
}
