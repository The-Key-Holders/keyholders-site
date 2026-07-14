"use client";

import { ADVISOR_HELP_STARTERS } from "@/lib/advisor-help-agent";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AdvisorHelpAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the **New Hire + Automation Tool Help** agent (Grok). I only run inside this password-protected hub. Ask about onboarding, Chapter III / TD-288 themes, allotment, invoice reconciliation, or FOR process coaching.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetch("/api/advisor-tools/agent-chat")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setConfigured(Boolean(d.configured)))
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
      const res = await fetch("/api/advisor-tools/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: nextHistory.filter(
            (m, i) => !(i === 0 && m.role === "assistant")
          ),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Chat request failed");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I couldn't reach the help agent just now. Check that XAI_API_KEY is configured on the server, then try again.",
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
          content: "Network error while contacting the help agent.",
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

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col px-4 py-10 sm:px-6">
      <p className="text-sm text-white/45">
        <Link href="/advisor-tools" className="text-cyanGlow hover:underline">
          Advisor Tools Hub
        </Link>
        <span className="mx-2">/</span>
        <span>Help agent</span>
      </p>
      <p className="mt-4 text-sm font-medium uppercase tracking-widest text-cyanGlow/80">
        Restricted · Grok · password gate
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
        New Hire + Automation Help
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
        Private Grok coach for onboarding and Advisor Tools. Public portfolio questions belong on{" "}
        <Link href="/support" className="text-cyanGlow hover:underline">
          /support
        </Link>{" "}
        (Taskade site guide).
      </p>

      {configured === false && (
        <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          Server is missing <code className="text-rose-50">XAI_API_KEY</code>. An admin needs to set
          it on Vercel (and redeploy) before chat works.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {ADVISOR_HELP_STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => void send(s)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-xs text-white/75 transition hover:border-cyanGlow/40 hover:text-white disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex min-h-[420px] flex-1 flex-col rounded-2xl border border-white/10 bg-vault-950/50">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyanGlow/20 text-white"
                    : "border border-white/10 bg-white/5 text-white/85"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-white/45">Grok is thinking…</div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/10 p-3 sm:p-4">
          {error && (
            <div className="mb-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="agent-chat-input">
              Message
            </label>
            <textarea
              id="agent-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Ask about onboarding or Advisor Tools…"
              className="min-h-[44px] flex-1 resize-y rounded-xl border border-white/15 bg-vault-950/60 px-3 py-2 text-sm text-white placeholder:text-white/35"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <button
              type="submit"
              className="btn-primary self-end px-4 py-2 disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? "Sending…" : "Send"}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-white/40">
            Password-gated · Grok · sanitized guidance only · not a system of record
          </p>
        </form>
      </div>
    </div>
  );
}
