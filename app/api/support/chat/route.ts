import { SUPPORT_SYSTEM_PROMPT, sanitizeHistory } from "@/lib/support-agent";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 2_000;
const DEFAULT_MODEL = process.env.XAI_MODEL?.trim() || "grok-4.5";

/** Simple in-memory rate limit per IP (best-effort on serverless). */
const hits = new Map<string, { count: number; reset: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

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

export async function GET() {
  const key = process.env.XAI_API_KEY?.trim();
  return NextResponse.json({
    configured: Boolean(key),
    model: key ? DEFAULT_MODEL : null,
    provider: "xAI Grok",
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Public support agent is not configured yet (server missing XAI_API_KEY).",
      },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: { message?: string; history?: unknown } = {};
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

  const history = sanitizeHistory(body.history);
  const messages = [
    { role: "system" as const, content: SUPPORT_SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
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
        temperature: 0.5,
        max_tokens: 1200,
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
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
