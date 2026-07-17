import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function ProcessesPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Processes &amp; checklists</h1>
      <p className={portal.lead}>Template-driven path Advisors now gatekeep under the new MPA.</p>
      <div className="mt-8 space-y-4">
        {[
          {
            t: "1 · Evaluate",
            d: "Cloud vs On-Prem · vendor pool demos · facility readiness",
            href: "/psap-portal/tools/cloud-vs-onprem",
          },
          {
            t: "2 · Advance Notification",
            d: "Att 11 prep · model · FY · send to Advisor",
            href: "/psap-portal/tools/advance-notification-wizard",
          },
          {
            t: "3 · Quotes & SOW",
            d: "Authorized contractors · Attachment 16 completeness",
            href: "/psap-portal/tools/sow-checker",
          },
          {
            t: "4 · TD-288 package",
            d: "Letter · SOW · TDe-285 · package checker",
            href: "/psap-portal/tools/td288-checker",
          },
          {
            t: "5 · Install · accept · invoice",
            d: "TD-284 · Att 14/15 invoice fields · residuals",
            href: "/psap-portal/tools/invoice-checker",
          },
        ].map((x) => (
          <Link key={x.t} href={x.href} className={`${portal.cardHover} block`}>
            <p className={portal.label}>{x.t}</p>
            <p className={`${portal.muted} mt-1`}>{x.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
