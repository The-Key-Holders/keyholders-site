import { exportSnapshot, importSnapshot } from "@/lib/psap-portal/store";
import type { PortalDataSnapshot } from "@/lib/psap-portal/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(exportSnapshot());
}

export async function POST(request: Request) {
  let body: PortalDataSnapshot;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const snap = importSnapshot(body);
    return NextResponse.json({ ok: true, snapshot: snap });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 400 }
    );
  }
}
