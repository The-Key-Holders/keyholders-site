"use client";

import { PUBLIC_SITE_STARTERS } from "@/lib/public-site-agent";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Hide floating Taskade widget on gated Advisor Tools surfaces. */
function isGatedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/advisor-tools") ||
    pathname.startsWith("/psap-allotment") ||
    pathname.startsWith("/psap-portal")
  );
}

export default function SiteChatWidget() {
  const pathname = usePathname() || "/";
  const gated = isGatedPath(pathname);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Site Guide here (Taskade). Ask about The Key Holders portfolio, Trade, Geeks Next Door, or contact options.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // Close widget when entering gated routes
  useEffect(() => {
    if (gated) setOpen(false);
  }, [gated]);

  if (gated) return null;

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
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
          history: next.filter((m, i) => !(i === 0 && m.role === "assistant")),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res.ok
              ? data.reply || "(empty reply)"
              : data.error || "Couldn't reach the site guide. Try /support or email javadkhoshnevisan@gmail.com.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
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
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex h-[min(70vh,520px)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-vault-950/95 shadow-2xl shadow-black/50 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Site Guide</p>
              <p className="text-[11px] text-white/45">Taskade · public pages</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 border-b border-white/5 px-3 py-2">
            {PUBLIC_SITE_STARTERS.slice(0, 3).map((s) => (
              <button
                key={s}
                type="button"
                disabled={loading}
                onClick={() => void send(s)}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/65 hover:border-cyanGlow/40 disabled:opacity-50"
              >
                {s.length > 36 ? `${s.slice(0, 34)}…` : s}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-cyanGlow/20 text-white"
                      : "border border-white/10 bg-white/5 text-white/85"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-[11px] text-white/40">Thinking…</p>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={onSubmit} className="border-t border-white/10 p-2">
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="site-widget-input">
                Message
              </label>
              <input
                id="site-widget-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the site guide…"
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-vault-950/60 px-2 py-1.5 text-xs text-white placeholder:text-white/35"
                disabled={loading}
              />
              <button
                type="submit"
                className="btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-cyanGlow/40 bg-cyanGlow/15 px-4 py-3 text-sm font-semibold text-cyanGlow shadow-lg shadow-cyanGlow/10 transition hover:bg-cyanGlow/25"
        aria-expanded={open}
        aria-label={open ? "Close site guide chat" : "Open site guide chat"}
      >
        <span aria-hidden>💬</span>
        {open ? "Close" : "Site Guide"}
      </button>
    </div>
  );
}
