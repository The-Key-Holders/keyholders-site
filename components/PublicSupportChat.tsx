"use client";

import AgentChatMarkdown from "@/components/AgentChatMarkdown";
import {
  PUBLIC_SITE_GREETING,
  PUBLIC_SITE_STARTERS,
} from "@/lib/public-site-agent";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function PublicSupportChat() {
  const pathname = usePathname() || "/support";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: PUBLIC_SITE_GREETING,
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
    fetch("/api/support/chat")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => {
        setConfigured(Boolean(d.configured));
      })
      .catch(() => setConfigured(false));
  }, []);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    setError("");
    setLoading(true);
    const next = [...messages, { role: "user" as const, content: message }];
    setMessages(next);
    setInput("");

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          path: pathname,
          history: next.filter((m, i) => !(i === 0 && m.role === "assistant")),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Request failed");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ||
              "I couldn't reach the site guide just now. Please try again shortly, or use Connect on the homepage.",
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
          content: "Network error. Please try again, or use Connect on the homepage.",
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
        <Link href="/" className="text-cyanGlow hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>Support</span>
      </p>
      <p className="mt-4 text-sm font-medium uppercase tracking-widest text-cyanGlow/80">
        Public site guide
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
        Key Holders Site Guide
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
        Ask about the public portfolio, Geeks Next Door, Trade, or finding your way around the site.
        Restricted tools are not covered here.
      </p>

      {configured === false && (
        <div className="mt-4 rounded-xl border border-amber-400/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-50/90">
          The site guide is unavailable right now. Please try again shortly, or use{" "}
          <Link href="/#connect" className="underline">
            Connect
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {PUBLIC_SITE_STARTERS.map((s) => (
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
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "whitespace-pre-wrap bg-cyanGlow/20 text-white"
                    : "border border-white/10 bg-white/5 text-white/85"
                }`}
              >
                {m.role === "assistant" ? (
                  <AgentChatMarkdown content={m.content} />
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-white/45">Thinking…</div>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/10 p-3 sm:p-4">
          {error && (
            <div className="mb-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="public-support-input">
              Message
            </label>
            <textarea
              id="public-support-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Ask about Key Holders, Trade, or Geeks Next Door…"
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
            Public chat · rate-limited · not for private or restricted topics
          </p>
        </form>
      </div>
    </div>
  );
}
