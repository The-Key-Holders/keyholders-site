"use client";

import AgentChatMarkdown from "@/components/AgentChatMarkdown";
import {
  ADVISOR_AI_PROMPT_VERSION,
  ADVISOR_AI_STARTERS,
} from "@/lib/advisor-ai";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const ROLES = [
  "PSAP Manager",
  "County Coordinator",
  "Finance / admin staff",
  "Vendor partner",
  "New Funding Advisor",
] as const;

const GREETING = `Hello — I'm **CA 9-1-1 Advisor AI** (Grok), a password-gated assistant on the Advisor Tools portal. I embody CA 9-1-1 Branch Advisor guidance on **PSAP funding, Chapter III processes, FOR prep, NG9-1-1, standards, and forms**.

I **complement** human Advisors — I never issue TD-288s, allotment letters, or claim approvals. For official decisions contact your assigned Advisor, **CA911Branch@caloes.ca.gov**, or **(916) 894-5007**.

I am **separate** from the [Advisor Desk + Tools Help](/advisor-tools/help-agent) agent (desk coaching, onboarding, and tool navigation).

Ask about CPE allotments, Direct vs Reimbursement, residual funds, FOR prep, ATA, GIS funding, or Manual topics. **How else can I assist your PSAP today?**`;

export default function AdvisorAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [roleHint, setRoleHint] = useState<string>("");
  const [modelLabel, setModelLabel] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetch("/api/advisor-tools/advisor-ai/chat")
      .then((r) => r.json())
      .then((d: { configured?: boolean; model?: string | null }) => {
        setConfigured(Boolean(d.configured));
        if (d.model) setModelLabel(d.model);
      })
      .catch(() => setConfigured(false));
  }, []);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    setError("");
    setLoading(true);
    const nextHistory = [...messages, { role: "user" as const, content: message }];
    setMessages(nextHistory);
    setInput("");

    try {
      const res = await fetch("/api/advisor-tools/advisor-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          roleHint: roleHint || undefined,
          history: nextHistory.filter((m, i) => !(i === 0 && m.role === "assistant")),
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        model?: string;
      };
      if (data.model) setModelLabel(data.model);
      if (!res.ok) {
        setError(data.error || "Chat request failed");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I couldn't reach CA 9-1-1 Advisor AI just now. Confirm **XAI_API_KEY** is set on the server, then try again — or contact CA911Branch@caloes.ca.gov / your assigned Advisor.",
          },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "(empty reply)" },
      ]);
    } catch {
      setError("Network error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error while contacting CA 9-1-1 Advisor AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function exportTranscript() {
    const md = messages
      .map((m) => `### ${m.role === "user" ? "You" : "CA 9-1-1 Advisor AI"}\n\n${m.content}\n`)
      .join("\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ca911-advisor-ai-transcript-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-3xl flex-col px-4 py-10 sm:px-6">
      <p className="text-sm text-white/45">
        <Link href="/advisor-tools" className="text-cyanGlow hover:underline">
          Advisor Tools Hub
        </Link>
        <span className="mx-2">/</span>
        <span>CA 9-1-1 Advisor AI</span>
      </p>
      <p className="mt-4 text-sm font-medium uppercase tracking-widest text-cyanGlow/80">
        Cal OES · Advisory & Compliance · Grok
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
        CA 9-1-1 Advisor AI
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-white/65">
        Full Advisor persona for PSAP funding, Manual policy, FOR prep, NG9-1-1, and forms. Complements human
        Advisors — never replaces them.{" "}
        <span className="text-white/45">
          Prompt {ADVISOR_AI_PROMPT_VERSION}
          {modelLabel ? ` · ${modelLabel}` : ""}
        </span>
      </p>

      <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-50/90">
        Separate from{" "}
        <Link href="/advisor-tools/help-agent" className="text-cyanGlow underline">
          Advisor Desk + Tools Help
        </Link>
        . Not legal advice. Not Fi$Cal. Not an official allotment letter. Life-threatening emergency → call{" "}
        <strong>9-1-1</strong>.
      </div>

      {configured === false && (
        <p className="mt-3 text-sm text-red-300">
          Server reports Grok is not configured (missing XAI_API_KEY).
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/45">Your role (optional):</span>
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoleHint(roleHint === r ? "" : r)}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${
              roleHint === r
                ? "border-cyanGlow bg-cyanGlow/20 text-cyanGlow"
                : "border-white/15 text-white/60 hover:border-white/30"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ADVISOR_AI_STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => void send(s)}
            className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-left text-[11px] text-white/70 hover:border-cyanGlow/40 hover:text-white disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-vault-950/50">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-8 bg-cyanGlow/15 text-white"
                  : "mr-4 border border-white/10 bg-white/5 text-white/85"
              }`}
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
                {m.role === "user" ? "You" : "CA 9-1-1 Advisor AI"}
              </p>
              {m.role === "assistant" ? (
                <AgentChatMarkdown content={m.content} />
              ) : (
                <div className="whitespace-pre-wrap">{m.content}</div>
              )}
            </div>
          ))}
          {loading && (
            <p className="text-xs text-white/45">Advisor AI is preparing a policy-grounded answer…</p>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/10 p-3 sm:p-4">
          {error && <p className="mb-2 text-xs text-red-300">{error}</p>}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about CPE allotment, claims, FOR, NG9-1-1, standards…"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-vault-950/80 px-3 py-2.5 text-sm text-white placeholder:text-white/35"
              disabled={loading}
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-cyanGlow px-4 py-2.5 text-sm font-semibold text-vault-950 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportTranscript}
              className="text-[11px] text-white/45 hover:text-white/70"
            >
              Export transcript
            </button>
            <Link href="/advisor-tools/help-agent" className="text-[11px] text-cyanGlow/80 hover:underline">
              Open Advisor Desk + Tools Help agent
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
