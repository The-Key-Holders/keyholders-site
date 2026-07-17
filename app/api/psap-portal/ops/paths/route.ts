import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { listPathsForActor } from "@/lib/path-engine/service";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    const url = new URL(request.url);
    const bucketCode = url.searchParams.get("bucket") ?? undefined;
    const pathTypeCode = url.searchParams.get("pathType") ?? undefined;
    const paths = listPathsForActor(actor, { bucketCode, pathTypeCode });
    return NextResponse.json({ actor, paths });
  });
}
