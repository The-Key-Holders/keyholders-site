import {
  ADVISOR_HELP_PROMPT_VERSION,
  ADVISOR_HELP_SYSTEM_PROMPT,
} from "@/lib/advisor-help-agent";
import {
  getCorpusStats,
  retrieveManualContext,
} from "@/lib/advisor-ai/retrieve";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 4_000;
const MAX_HISTORY = 12;
const DEFAULT_MODEL = process.env.XAI_MODEL?.trim() || "grok-4.5";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function GET() {
  const key = process.env.XAI_API_KEY?.trim();
  let corpusChunks: number | null = null;
  try {
    corpusChunks = getCorpusStats().chunks;
  } catch {
    corpusChunks = null;
  }
  return NextResponse.json({
    configured: Boolean(key),
    provider: "xAI Grok",
    model: key ? DEFAULT_MODEL : null,
    scope: "password-gated-advisor-help",
    promptVersion: ADVISOR_HELP_PROMPT_VERSION,
    corpusChunks,
    audiences: ["advisor-desk", "new-hire", "tool-coach", "psap-restricted"],
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Advisor help agent is not configured (set XAI_API_KEY on the server).",
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

  const retrieved = retrieveManualContext(message, 5);
  const system = retrieved
    ? `${ADVISOR_HELP_SYSTEM_PROMPT}\n\n---\n### Retrieved Manual / knowledge context\nUse the following excerpts to ground process answers. Prefer them for wording when on-topic. If they conflict with safety rules, prefer safety rules and escalate.\n\n${retrieved}`
    : ADVISOR_HELP_SYSTEM_PROMPT;

  const messages = [
    { role: "system" as const, content: system },
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
        temperature: 0.35,
        max_tokens: 2200,
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
      promptVersion: ADVISOR_HELP_PROMPT_VERSION,
      retrievalUsed: Boolean(retrieved),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
