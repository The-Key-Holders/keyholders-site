import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { listToolRuns, recordToolRun } from "@/lib/path-engine/store";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return withOpsStore(() => {
    const url = new URL(request.url);
    const rows = listToolRuns({
      pathId: url.searchParams.get("pathId") ?? undefined,
      processId: url.searchParams.get("processId") ?? undefined,
    });
    return NextResponse.json({ toolRuns: rows });
  });
}

export async function POST(request: Request) {
  return withOpsStore(async () => {
    const actor = actorFromRequestCookies();
    let body: {
      toolCode?: string;
      pathId?: string;
      processId?: string;
      result?: unknown;
      status?: string;
    } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body.toolCode) {
      return NextResponse.json({ error: "toolCode required" }, { status: 400 });
    }
    recordToolRun({
      toolCode: body.toolCode,
      pathId: body.pathId,
      processId: body.processId,
      result: body.result ?? {},
      status: body.status,
      createdByUserId: actor.userId,
    });
    return NextResponse.json({ ok: true });
  });
}
