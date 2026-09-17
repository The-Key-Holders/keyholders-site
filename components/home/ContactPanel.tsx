"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const TOPICS = [
  { id: "general", label: "General" },
  { id: "geeks", label: "Geeks Next Door" },
  { id: "trade", label: "Trade / contractors" },
  { id: "tools", label: "Professional tools" },
  { id: "other", label: "Something else" },
] as const;

function track(event: string) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  void fetch("/api/contact/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, path }),
    keepalive: true,
  }).catch(() => {});
}

export default function ContactPanel() {
  const rootRef = useRef<HTMLElement>(null);
  const viewed = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (viewed.current) return;
        if (entries.some((e) => e.isIntersecting)) {
          viewed.current = true;
          track("connect_view");
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
          company,
          path: window.location.pathname,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send. Please try again.");
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <section
      id="connect"
      ref={rootRef}
      className="section-padding border-t border-white/5"
    >
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-3xl font-bold text-white">Connect</h2>
          <p className="mt-4 text-center text-white/60">
            Consumer services, contractor integrations, professional tools, or collabs — we respond
            within one business day.
          </p>

          {status === "sent" ? (
            <div className="glass-card mt-8 p-6 text-center text-sm text-white/80">
              Thanks — your note is in. We&apos;ll reply from the Connect inbox.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="glass-card mt-8 space-y-4 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm" htmlFor="contact-name">
                  <span className="text-white/50">Name</span>
                  <input
                    id="contact-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-vault-950/70 px-3 py-2.5 text-white"
                    autoComplete="name"
                  />
                </label>
                <label className="block text-sm" htmlFor="contact-email">
                  <span className="text-white/50">Email</span>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-vault-950/70 px-3 py-2.5 text-white"
                    autoComplete="email"
                  />
                </label>
              </div>
              <label className="block text-sm" htmlFor="contact-topic">
                <span className="text-white/50">Topic</span>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-vault-950/70 px-3 py-2.5 text-white"
                >
                  {TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm" htmlFor="contact-message">
                <span className="text-white/50">Message</span>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full resize-y rounded-lg border border-white/15 bg-vault-950/70 px-3 py-2.5 text-white"
                />
              </label>
              <div className="hidden" aria-hidden="true">
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-rose-200">{error}</p>}
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
