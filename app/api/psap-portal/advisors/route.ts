import { getAdvisors, searchAdvisors, setAdvisors } from "@/lib/psap-portal/store";
import type { AdvisorRecord } from "@/lib/psap-portal/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const rows = q ? searchAdvisors(q) : getAdvisors();
  return NextResponse.json({ advisors: rows });
}

export async function PUT(request: Request) {
  let body: { advisors?: AdvisorRecord[] } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.advisors)) {
    return NextResponse.json({ error: "advisors array required" }, { status: 400 });
  }
  const advisors = setAdvisors(body.advisors);
  return NextResponse.json({ advisors });
}
