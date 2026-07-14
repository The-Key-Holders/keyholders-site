"use client";

import BrandLogo from "@/components/BrandLogo";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/advisor-tools";
  const configError = params.get("error") === "not_configured";

  const [password, setPassword] = useState("");
  const [error, setError] = useState(configError ? "Server password is not configured yet." : "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/advisor-tools/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      // Full navigation so the new HttpOnly cookie is always sent to middleware.
      // Soft App Router transitions can race and get redirected back to login.
      const dest = next.startsWith("/") ? next : "/advisor-tools";
      window.location.assign(dest);
      return;
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex justify-center">
        <BrandLogo variant="parent" size="header" />
      </div>
      <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">Restricted</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">Advisor Tools Login</h1>
      <p className="mt-3 text-sm text-white/65">
        Cal OES Funding Advisor automations (allotment, invoice reconciler, FOR) are password-protected. Enter the
        shared access password to continue.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <label className="block text-sm text-white/80">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-white"
            required
          />
        </label>
        {error && (
          <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </div>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Checking…" : "Unlock tools"}
        </button>
      </form>
    </div>
  );
}

export default function AdvisorToolsLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white/50">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
