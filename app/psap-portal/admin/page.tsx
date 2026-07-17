"use client";

import { portal } from "@/lib/psap-portal/ui";
import type { AdvisorRecord, NewsItem, QuestionRecord } from "@/lib/psap-portal/types";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function AdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorRecord[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    Promise.all([
      fetch("/api/psap-portal/news?all=1").then((r) => r.json()),
      fetch("/api/psap-portal/questions").then((r) => r.json()),
      fetch("/api/psap-portal/advisors").then((r) => r.json()),
    ]).then(([n, q, a]) => {
      setNews(n.news || []);
      setQuestions(q.questions || []);
      setAdvisors(a.advisors || []);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createNews(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/psap-portal/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        body: fd.get("body"),
        date: fd.get("date") || new Date().toISOString().slice(0, 10),
        published: fd.get("published") === "on",
        tags: String(fd.get("tags") || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    if (res.ok) {
      e.currentTarget.reset();
      setMsg("News saved (in-memory until Export/Import).");
      load();
    } else {
      const d = await res.json();
      setMsg(d.error || "Failed");
    }
  }

  async function togglePublish(item: NewsItem) {
    await fetch("/api/psap-portal/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, published: !item.published }),
    });
    load();
  }

  async function setQStatus(id: string, status: QuestionRecord["status"]) {
    await fetch("/api/psap-portal/questions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function exportData() {
    const res = await fetch("/api/psap-portal/data");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `psap-portal-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Exported JSON download started.");
  }

  async function importData(file: File) {
    const text = await file.text();
    const res = await fetch("/api/psap-portal/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: text,
    });
    const d = await res.json();
    setMsg(res.ok ? "Import applied to memory overlay." : d.error || "Import failed");
    if (res.ok) load();
  }

  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Admin</h1>
      <p className={portal.lead}>
        News, question inbox, and sample Advisor directory. Mutations are in-memory on serverless —
        use <strong>Export JSON</strong> and re-commit seeds (or Import on next session) to persist.
      </p>
      {msg && <p className={`${portal.alertCyan} mt-4`}>{msg}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className={portal.btnPrimary} onClick={() => void exportData()}>
          Export JSON
        </button>
        <label className={portal.btnSecondary + " cursor-pointer"}>
          Import JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importData(f);
            }}
          />
        </label>
        <Link href="/psap-portal/news" className={portal.btnSecondary}>
          View public news
        </Link>
      </div>

      <section className="mt-10">
        <h2 className={portal.h2}>Create news</h2>
        <form onSubmit={createNews} className={`${portal.card} mt-3 max-w-xl space-y-2`}>
          <input name="title" required placeholder="Title" className={portal.input} />
          <textarea name="body" required rows={4} placeholder="Body" className={portal.input} />
          <input name="date" type="date" className={portal.input} />
          <input name="tags" placeholder="tags, comma,separated" className={portal.input} />
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input name="published" type="checkbox" /> Published
          </label>
          <button type="submit" className={portal.btnPrimary}>
            Save news
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {news.map((n) => (
            <div key={n.id} className={`${portal.card} flex flex-wrap items-center justify-between gap-2`}>
              <div>
                <p className="font-medium text-white">{n.title}</p>
                <p className="text-xs text-white/40">
                  {n.date} · {n.published ? "published" : "draft"}
                </p>
              </div>
              <button type="button" className={portal.btnSecondary} onClick={() => void togglePublish(n)}>
                {n.published ? "Unpublish" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>Questions inbox</h2>
        <div className="mt-3 space-y-2">
          {questions.map((q) => (
            <div key={q.id} className={portal.card}>
              <p className="text-xs text-cyanGlow">
                {q.ticketId} · {q.status} · {q.urgency} · {q.category}
              </p>
              <p className="mt-1 font-medium text-white">
                {q.psapName} ({q.county})
              </p>
              <p className={`${portal.muted} mt-1`}>{q.question}</p>
              <p className="mt-1 text-xs text-white/40">
                {q.contactName} · {q.contactEmail}
              </p>
              <div className="mt-2 flex gap-2">
                {(["new", "in_progress", "done"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={portal.btnSecondary}
                    onClick={() => void setQStatus(q.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {!questions.length && <p className={portal.muted}>No questions yet.</p>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>Advisors (sample)</h2>
        <p className={`${portal.muted} mt-2`}>
          {advisors.length} records loaded. Edit via Export → modify JSON → Import (or update
          lib/psap-portal/data/advisors.sample.json in git).
        </p>
        <ul className="mt-3 space-y-1 text-sm text-white/55">
          {advisors.slice(0, 5).map((a) => (
            <li key={a.id}>
              {a.name} — {a.counties.slice(0, 3).join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
