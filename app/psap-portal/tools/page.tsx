import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

const TOOLS = [
  {
    href: "/psap-portal/tools/advisor-lookup",
    title: "Find my Advisor",
    desc: "Search sample county / PSAP Advisor assignments.",
  },
  {
    href: "/psap-portal/tools/advance-notification-wizard",
    title: "Advance Notification prep (Att 11)",
    desc: "Eligibility, FY, Cloud vs On-Prem, draft message to Advisor.",
  },
  {
    href: "/psap-portal/tools/cloud-vs-onprem",
    title: "Cloud vs On-Prem decision",
    desc: "Model fit wizard and dual readiness checklists.",
  },
  {
    href: "/psap-portal/tools/vendor-pool",
    title: "Vendor pool & evaluation",
    desc: "Placeholder awarded pool + evaluation checklist.",
  },
  {
    href: "/psap-portal/tools/td288-checker",
    title: "TD-288 package checker",
    desc: "Funding package completeness before Commitment to Fund.",
  },
  {
    href: "/psap-portal/tools/sow-checker",
    title: "SOW completeness (Att 16)",
    desc: "Model-aware SOW section checklist.",
  },
  {
    href: "/psap-portal/tools/invoice-checker",
    title: "Invoice readiness (Att 14/15)",
    desc: "Required invoice fields and TD-288 amount guard.",
  },
  {
    href: "/psap-portal/tools/submit-question",
    title: "Submit a question",
    desc: "Structured ticket for Advisor review.",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Tools</h1>
      <p className={portal.lead}>
        Self-service checkers and wizards that absorb transition volume for county Advisors under
        RFP 26-16743.
      </p>
      <div className={`${portal.grid2} mt-8`}>
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className={portal.cardHover}>
            <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white">
              {t.title}
            </h2>
            <p className={`${portal.muted} mt-2`}>{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
