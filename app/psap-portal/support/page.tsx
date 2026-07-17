import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Support</h1>
      <p className={portal.lead}>Self-serve first, then your county Advisor.</p>
      <div className={`${portal.grid2} mt-8`}>
        <div className={portal.card}>
          <p className={portal.label}>1 · Self-serve</p>
          <p className={`${portal.muted} mt-2`}>
            Tools, FAQs, and the floating Grok agent on every portal page.
          </p>
          <Link href="/psap-portal/tools" className={`${portal.btnPrimary} mt-4`}>
            Open tools
          </Link>
        </div>
        <div className={portal.card}>
          <p className={portal.label}>2 · Human Advisor</p>
          <p className={`${portal.muted} mt-2`}>
            Use Advisor lookup (sample data until replaced) or submit a structured question.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/psap-portal/tools/advisor-lookup" className={portal.btnSecondary}>
              Lookup
            </Link>
            <Link href="/psap-portal/tools/submit-question" className={portal.btnSecondary}>
              Submit question
            </Link>
          </div>
        </div>
      </div>
      <div className={`${portal.alert} mt-8`}>
        Escalation pattern: PSAP Advisor → Advisory &amp; Compliance supervisor → Program leadership.
        Outages: operational SOP first, then vendor + Branch notification paths.
      </div>
    </div>
  );
}
