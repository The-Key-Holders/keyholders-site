import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import {
  overridePathForActor,
  reverseOverrideForActor,
} from "@/lib/path-engine/service";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: { pathId: string } }
) {
  let body: { toBucketCode?: string; reason?: string; action?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  return withOpsStore(() => {
    const actor = actorFromRequestCookies();

    if (body.action === "reverse") {
      const result = reverseOverrideForActor(actor, context.params.pathId);
      if (!result.ok) {
        const status = result.error === "Forbidden" ? 403 : 400;
        return NextResponse.json({ error: result.error }, { status });
      }
      return NextResponse.json({ ok: true, reversed: true });
    }

    if (!body.toBucketCode || !body.reason) {
      return NextResponse.json(
        { error: "toBucketCode and reason required" },
        { status: 400 }
      );
    }

    const result = overridePathForActor(
      actor,
      context.params.pathId,
      body.toBucketCode,
      body.reason
    );
    if (!result.ok) {
      const status = result.error === "Forbidden" ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ ok: true });
  });
}
