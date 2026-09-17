import { recordContactEvent, type ContactEventName } from "@/lib/contact-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: ContactEventName[] = [
  "connect_view",
  "mailto_click",
  "form_submit",
  "form_error",
];

export async function POST(request: Request) {
  let body: { event?: string; path?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const event = ALLOWED.find((e) => e === body.event);
  if (!event) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 180) : "/";
  await recordContactEvent(event, path);
  return NextResponse.json({ ok: true });
}
