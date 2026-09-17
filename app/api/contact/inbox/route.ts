import {
  ADVISOR_AUTH_COOKIE,
  getConfiguredPassword,
  sessionTokenFromPassword,
  sessionTokensEqual,
} from "@/lib/advisor-auth";
import { contactEventCounts, listContactMessages } from "@/lib/contact-store";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(): boolean {
  const password = getConfiguredPassword();
  if (!password) return false;
  const token = cookies().get(ADVISOR_AUTH_COOKIE)?.value;
  return sessionTokensEqual(token, sessionTokenFromPassword(password));
}

export async function GET() {
  if (!authorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [messages, events] = await Promise.all([
    listContactMessages(80),
    contactEventCounts(),
  ]);
  return NextResponse.json({ ok: true, messages, events });
}
