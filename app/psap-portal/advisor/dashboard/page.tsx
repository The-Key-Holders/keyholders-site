import AdvisorOpsDashboard from "@/components/psap-portal/AdvisorOpsDashboard";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function AdvisorDashboardPage() {
  return (
    <div className={portal.page}>
      <p className={portal.badgeGold}>Advisor · Live ops</p>
      <h1 className={`${portal.h1} mt-3`}>Compliance path dashboard</h1>
      <p className={portal.lead}>
        Track assigned PSAPs across the CPE funding path: counts, bucket board, drill-down,
        overrides, and CSV export. Shared records with the PSAP portal.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/psap-portal/advisor" className={portal.btnSecondary}>
          Content desk
        </Link>
        <Link href="/psap-portal/tools" className={portal.btnSecondary}>
          QC tools
        </Link>
      </div>
      <div className="mt-10">
        <AdvisorOpsDashboard />
      </div>
    </div>
  );
}
