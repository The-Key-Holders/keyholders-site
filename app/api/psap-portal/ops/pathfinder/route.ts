import { actorFromRequestCookies } from "@/lib/path-engine/request-actor";
import {
  buildPathfinder,
  listPathfinderOptions,
} from "@/lib/path-engine/pathfinder";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return withOpsStore(() => {
    const actor = actorFromRequestCookies();
    const pathId = new URL(request.url).searchParams.get("pathId") ?? undefined;
    const options = listPathfinderOptions(actor);
    const guide = buildPathfinder(actor, pathId);
    return NextResponse.json({ actor, options, guide });
  });
}
