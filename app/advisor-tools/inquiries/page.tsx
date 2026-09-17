"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Message = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  path: string | null;
};

export default function InquiriesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<{ event: string; n: number }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/contact/inbox")
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not load inbox");
        return r.json();
      })
      .then((d: { messages?: Message[]; events?: { event: string; n: number }[] }) => {
        setMessages(d.messages || []);
        setEvents(d.events || []);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm text-white/45">
        <Link href="/advisor-tools" className="text-cyanGlow hover:underline">
          Advisor Tools
        </Link>
        <span className="mx-2">/</span>
        Inquiries
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white">Public contact inbox</h1>
      <p className="mt-2 text-sm text-white/60">
        Connect-section views, mailto clicks, and form submissions from the public site.
      </p>

      {error && <p className="mt-4 text-sm text-rose-200">{error}</p>}

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {events.length === 0 && (
          <div className="glass-card p-4 text-sm text-white/55 sm:col-span-4">
            No tracked events yet.
          </div>
        )}
        {events.map((e) => (
          <div key={e.event} className="glass-card p-4">
            <p className="text-xs uppercase tracking-widest text-white/40">{e.event}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{e.n}</p>
          </div>
        ))}
      </div>

      <ul className="mt-8 space-y-4">
        {messages.map((m) => (
          <li key={m.id} className="glass-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-white">
                {m.name}{" "}
                <a className="text-cyanGlow hover:underline" href={`mailto:${m.email}`}>
                  {m.email}
                </a>
              </p>
              <p className="text-xs text-white/40">
                {new Date(m.created_at).toLocaleString()} · {m.topic}
              </p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-white/75">{m.message}</p>
          </li>
        ))}
        {!error && messages.length === 0 && (
          <li className="text-sm text-white/50">No form submissions yet.</li>
        )}
      </ul>
    </div>
  );
}
