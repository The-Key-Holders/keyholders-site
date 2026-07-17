import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { completeProcessForActor } from "@/lib/path-engine/service";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: { processId: string } }
) {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    const result = completeProcessForActor(actor, context.params.processId);
    if (!result.ok) {
      const status = result.error === "Forbidden" ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json(result);
  });
}
