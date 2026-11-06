import { runCompare } from "@/lib/cpe-fit/catalog-api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const payload = runCompare(body);
  const res = NextResponse.json(payload);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
