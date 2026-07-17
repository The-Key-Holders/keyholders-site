import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { getPathDetail } from "@/lib/path-engine/service";
import { effectiveBucketCode } from "@/lib/path-engine/buckets";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: { pathId: string } }
) {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    const detail = getPathDetail(actor, context.params.pathId);
    if (!detail) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      actor,
      ...detail,
      effectiveBucket: effectiveBucketCode(detail.path),
    });
  });
}
