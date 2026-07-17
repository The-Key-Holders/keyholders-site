import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { getDashboard } from "@/lib/path-engine/service";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    const data = getDashboard(actor);
    return NextResponse.json({ actor, ...data });
  });
}
