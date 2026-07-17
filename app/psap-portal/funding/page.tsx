import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function FundingPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Funding &amp; allotments</h1>
      <p className={portal.lead}>
        Chapter III Fixed Allotment methodology continues; active MPA pricing changes with RFP
        26-16743. Official $ = Branch letter.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["L2", "0–800 / busy month"],
          ["L3", "801–1,200"],
          ["L4", "1,201–15,000"],
          ["L5", ">15,000"],
        ].map(([l, r]) => (
          <div key={l} className={portal.card + " text-center"}>
            <p className="font-[family-name:var(--font-syne)] text-lg text-cyanGlow">{l}</p>
            <p className="text-xs text-white/50">{r}</p>
          </div>
        ))}
      </div>
      <ol className="mt-8 space-y-2 text-sm text-white/65">
        {[
          "Advance Notification",
          "Allotment letter",
          "Quotes / SOW (authorized pool)",
          "TDe-285 + TD-288",
          "Install / TD-284",
          "Invoice or TD-290 · residuals",
        ].map((s, i) => (
          <li key={s} className="rounded-lg border border-white/10 px-3 py-2">
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/psap-allotment" className={portal.btnPrimary}>
          Allotment Engine
        </Link>
        <Link href="/psap-portal/tools/td288-checker" className={portal.btnSecondary}>
          TD-288 package checker
        </Link>
        <Link href="/psap-portal/tools/advance-notification-wizard" className={portal.btnSecondary}>
          Adv Notice prep
        </Link>
      </div>
    </div>
  );
}
