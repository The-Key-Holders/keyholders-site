import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function DocumentsPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Documents map</h1>
      <p className={portal.lead}>
        Prefer official Cal OES-hosted forms. RFP attachments define process shape (Att 11, 14–16).
      </p>
      <div className="mt-6 space-y-2">
        {[
          ["Advance Notification (CPE)", "Att 11 themes · portal wizard"],
          ["TDe-285 Spending Plan", "Allotment + residuals"],
          ["TD-288 Commitment to Fund", "Before authorized spend"],
          ["TD-284 System Acceptance", "Payment + residual clocks"],
          ["TD-290 Reimbursement", "When PSAP paid vendor"],
          ["SOW template", "Att 16 · SOW checker"],
          ["Invoice template", "Att 14/15 · invoice checker"],
          ["Chapter III Funding", "Policy of record on caloes.ca.gov"],
        ].map(([t, d]) => (
          <div key={t} className={`${portal.card} flex flex-wrap justify-between gap-2`}>
            <span className="font-medium text-white">{t}</span>
            <span className="text-sm text-white/45">{d}</span>
          </div>
        ))}
      </div>
      <a
        className={`${portal.btnPrimary} mt-6`}
        href="https://www.caloes.ca.gov/cal-oes-divisions/public-safety-communications/ca-9-1-1-emergency-communications-branch/ca-9-1-1-operations-manual"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ops Manual (official)
      </a>
      <Link href="/psap-portal/tools" className={`${portal.btnSecondary} ml-2 mt-6`}>
        Tools
      </Link>
    </div>
  );
}
