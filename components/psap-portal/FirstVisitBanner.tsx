"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "psap-portal-first-visit-dismissed-v1";

export default function FirstVisitBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem(KEY)) {
        setShow(true);
      }
    } catch {
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="border-b border-cyanGlow/25 bg-gradient-to-r from-cyanGlow/15 via-[#0a0e1a] to-gold/10"
      data-testid="first-visit-banner"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyanGlow">
            First time here?
          </p>
          <p className="mt-0.5 text-sm text-white/80">
            This portal is a <strong className="text-white">private beta</strong> — free while we
            prove it cuts Advisor email volume. Start with a 2-minute orient, then follow the
            numbered CPE path.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/psap-portal/start"
            className="rounded-lg bg-cyanGlow px-3 py-2 text-xs font-bold text-[#050810]"
            onClick={dismiss}
          >
            How this works
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 hover:border-white/30"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
