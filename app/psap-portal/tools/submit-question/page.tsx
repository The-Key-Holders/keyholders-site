"use client";

import { portal } from "@/lib/psap-portal/ui";
import { FormEvent, useState } from "react";

export default function SubmitQuestionPage() {
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/psap-portal/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        error?: string;
        question?: { ticketId: string };
      };
      if (!res.ok) {
        setError(data.error || "Submit failed");
        return;
      }
      setTicketId(data.question?.ticketId || null);
      e.currentTarget.reset();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-10">
      <h1 className={portal.h1}>Submit a question</h1>
      <p className={portal.lead}>
        Structured intake reduces free-form email chaos. Prefer FAQs, wizards, and the Grok agent
        first — then ticket what still needs a human Advisor.
      </p>

      {ticketId ? (
        <div className={`${portal.alertCyan} mt-6`} data-testid="question-success">
          <strong className="text-cyanGlow">Ticket {ticketId}</strong>
          <p className="mt-2">
            Stored for Admin review (sample store). For urgent outages, follow operational SOP and
            contact your Advisor / Branch immediately.
          </p>
          <button
            type="button"
            className={`${portal.btnSecondary} mt-3`}
            onClick={() => setTicketId(null)}
          >
            Submit another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className={`${portal.card} mt-6 max-w-xl space-y-3`}>
          <input name="psapName" required placeholder="PSAP name" className={portal.input} />
          <input name="psapCode" placeholder="PSAP code" className={portal.input} />
          <input name="county" required placeholder="County" className={portal.input} />
          <input name="contactName" required placeholder="Contact name" className={portal.input} />
          <input
            name="contactEmail"
            required
            type="email"
            placeholder="Contact email"
            className={portal.input}
          />
          <input name="contactPhone" placeholder="Phone (optional)" className={portal.input} />
          <select name="category" required className={portal.input} defaultValue="Funding">
            {["Timing", "Funding", "Contracts", "NG", "Vendor", "Claims", "Residual", "Other"].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </select>
          <select name="urgency" required className={portal.input} defaultValue="Routine">
            <option value="Routine">Routine</option>
            <option value="Time-sensitive">Time-sensitive</option>
            <option value="Outage-related">Outage-related</option>
          </select>
          <textarea
            name="question"
            required
            rows={5}
            placeholder="Your question…"
            className={portal.input}
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button type="submit" disabled={loading} className={portal.btnPrimary}>
            {loading ? "Submitting…" : "Submit ticket"}
          </button>
        </form>
      )}
    </div>
  );
}
