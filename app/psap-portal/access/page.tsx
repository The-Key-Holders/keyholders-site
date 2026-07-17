"use client";

import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccessForm() {
  const sp = useSearchParams();
  const err = sp.get("error");
  const [msg, setMsg] = useState<string | null>(err);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/psap-portal/ops/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        email: fd.get("email"),
        displayName: fd.get("displayName"),
        roleRequested: fd.get("roleRequested"),
        psapName: fd.get("psapName"),
        county: fd.get("county"),
        note: fd.get("note"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    setOk(true);
    setMsg("Request submitted. An admin will approve and share a magic sign-in link.");
  }

  return (
    <div className={portal.page} data-testid="access-request-page">
      <p className={portal.badge}>Access</p>
      <h1 className={`${portal.h1} mt-3`}>Request portal access</h1>
      <p className={portal.lead}>
        Beta invites: submit your details. After admin approval you receive a magic link (email or
        manual share). Demo roles still work from the portal entry chooser.
      </p>
      {msg && (
        <p
          className={`mt-4 text-sm ${ok ? "text-emerald-300" : "text-amber-200"}`}
          data-testid="access-msg"
        >
          {msg}
        </p>
      )}
      {!ok && (
        <form onSubmit={onSubmit} className={`${portal.card} mt-8 space-y-3 max-w-lg`}>
          <label className="block text-sm">
            <span className={portal.label}>Work email</span>
            <input name="email" type="email" required className={`${portal.input} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className={portal.label}>Display name</span>
            <input name="displayName" required className={`${portal.input} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className={portal.label}>Role</span>
            <select name="roleRequested" className={`${portal.input} mt-1`} defaultValue="psap">
              <option value="psap">PSAP / County staff</option>
              <option value="advisor">Advisor</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className={portal.label}>PSAP name</span>
            <input name="psapName" className={`${portal.input} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className={portal.label}>County</span>
            <input name="county" className={`${portal.input} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className={portal.label}>Note</span>
            <textarea name="note" className={`${portal.input} mt-1 min-h-[72px]`} />
          </label>
          <button type="submit" className={portal.btnPrimary} data-testid="access-submit">
            Submit request
          </button>
        </form>
      )}
      <p className="mt-6">
        <Link href="/psap-portal" className="text-sm text-cyanGlow hover:underline">
          ← Portal entry
        </Link>
      </p>
    </div>
  );
}

export default function AccessPage() {
  return (
    <Suspense fallback={<div className={portal.page}>Loading…</div>}>
      <AccessForm />
    </Suspense>
  );
}
