"use client";

import { PSAP_PORTAL_STARTERS } from "@/lib/psap-portal/agent/prompt";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function PsapPortalChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the **PSAP Funding Support Agent** (Grok). I help with Advance Notification, Cloud vs On-Prem, SOW/invoice checklists, TD-288 packages, and RFP 26-16743 transition. I don't approve funding — your Advisor and Branch letters do.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    fetch("/api/psap-portal/chat")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setConfigured(Boolean(d.configured)))
      .catch(() => setConfigured(false));
  }, []);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    setLoading(true);
    const next = [...messages, { role: "user" as const, content: message }];
    setMessages(next);
    setInput("");
    try {
      const res = await fetch("/api/psap-portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: next.filter((m, i) => !(i === 0 && m.role === "assistant")),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ||
              "I couldn't reach the agent. Confirm XAI_API_KEY on the server, then try again.",
          },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "(empty reply)" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error contacting the agent." },
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
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-cyanGlow px-4 py-3 text-sm font-bold text-[#050810] shadow-[0_0_28px_rgba(34,211,238,0.45)] hover:bg-cyan-300"
        aria-expanded={open}
      >
        {open ? "Close chat" : "PSAP Support AI"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[min(560px,70vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0e1a] shadow-2xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-[family-name:var(--font-syne)] text-sm font-semibold text-white">
              PSAP Funding Support Agent
            </p>
            <p className="text-[11px] text-white/45">
              Grok · Guidance only ·{" "}
              <Link href="/psap-portal/tools" className="text-cyanGlow hover:underline">
                Tools
              </Link>
            </p>
            {configured === false && (
              <p className="mt-1 text-[11px] text-rose-300">
                XAI_API_KEY not configured on server.
              </p>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-lg bg-cyanGlow/15 px-3 py-2 text-sm text-white"
                    : "mr-4 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <p className="text-xs text-white/40">Thinking…</p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex flex-wrap gap-1 border-t border-white/10 px-2 py-2">
            {PSAP_PORTAL_STARTERS.slice(0, 3).map((s) => (
              <button
                key={s}
                type="button"
                disabled={loading}
                onClick={() => void send(s)}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50 hover:border-cyanGlow/40 hover:text-cyanGlow"
              >
                {s.slice(0, 36)}…
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about CPE funding, SOW, invoices…"
              className="flex-1 rounded-lg border border-white/15 bg-[#050810] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyanGlow focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-cyanGlow px-3 py-2 text-sm font-semibold text-[#050810] disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
