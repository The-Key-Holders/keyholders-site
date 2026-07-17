import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { buildCsvReport } from "@/lib/path-engine/service";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    const csv = buildCsvReport(actor);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="assigned-paths.csv"',
      },
    });
  });
}
