import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { buildCsvReport } from "@/lib/path-engine/service";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return withOpsStore(async () => {
    const actor = actorFromRequestCookies();
    const kind = new URL(request.url).searchParams.get("kind");
    const { buildSlaCsvReport } = await import("@/lib/path-engine/service");
    const csv =
      kind === "sla" ? buildSlaCsvReport(actor) : buildCsvReport(actor);
    const filename = kind === "sla" ? "sla-aging.csv" : "assigned-paths.csv";
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  });
}
