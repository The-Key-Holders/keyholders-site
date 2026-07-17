import type { CheckStatus } from "@/lib/psap-portal/types";

const STYLES: Record<CheckStatus, string> = {
  Ready: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  "Needs work": "border-gold/40 bg-gold/15 text-gold",
  Blocked: "border-rose-400/40 bg-rose-500/15 text-rose-200",
};

export default function StatusBanner({
  status,
  title,
}: {
  status: CheckStatus;
  title?: string;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${STYLES[status]}`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-80">
        Result
      </p>
      <p className="font-[family-name:var(--font-syne)] text-lg font-semibold">
        {title || status}
      </p>
    </div>
  );
}
