import {
  decideAccessRequest,
  listAccessRequests,
  submitAccessRequest,
} from "@/lib/path-engine/access";
import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { isRole } from "@/lib/path-engine/session";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    if (actor.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ requests: listAccessRequests() });
  });
}

export async function POST(request: Request) {
  return withOpsStore(async () => {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Public-ish: submit request (still behind password portal middleware)
    if (body.action === "submit" || !body.action) {
      try {
        if (!isRole(body.roleRequested) || body.roleRequested === "admin") {
          return NextResponse.json(
            { error: "roleRequested must be psap or advisor" },
            { status: 400 }
          );
        }
        const row = submitAccessRequest({
          email: String(body.email || ""),
          displayName: String(body.displayName || ""),
          roleRequested: body.roleRequested,
          psapId: body.psapId ? String(body.psapId) : undefined,
          psapName: body.psapName ? String(body.psapName) : undefined,
          county: body.county ? String(body.county) : undefined,
          note: body.note ? String(body.note) : undefined,
        });
        return NextResponse.json({ ok: true, request: row });
      } catch (e) {
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Failed" },
          { status: 400 }
        );
      }
    }

    if (body.action === "decide") {
      const actor = actorFromRequestCookies();
      try {
        const decision = body.decision === "denied" ? "denied" : "approved";
        const result = decideAccessRequest(
          actor,
          String(body.requestId || ""),
          decision,
          { psapId: body.psapId ? String(body.psapId) : undefined }
        );
        return NextResponse.json({
          ok: true,
          request: result.request,
          magicUrlPath: result.magicUrlPath,
          // Dev-friendly: full path relative; UI prefixes origin
          magicLinkHint: result.magicUrlPath
            ? "Copy magic link (shown once). No email configured — share manually."
            : undefined,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed";
        const status = msg === "Forbidden" ? 403 : 400;
        return NextResponse.json({ error: msg }, { status });
      }
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  });
}
