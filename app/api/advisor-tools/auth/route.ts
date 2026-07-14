import {
  ADVISOR_AUTH_COOKIE,
  getConfiguredPassword,
  sessionTokenFromPassword,
  sessionTokensEqual,
} from "@/lib/advisor-auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export async function POST(request: Request) {
  const password = getConfiguredPassword();
  if (!password) {
    return NextResponse.json(
      { error: "Advisor tools password is not configured on the server." },
      { status: 503 }
    );
  }

  let body: { password?: string; action?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true, loggedOut: true });
    res.cookies.set(ADVISOR_AUTH_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  const submitted = (body.password ?? "").trim();
  if (!submitted) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const expected = sessionTokenFromPassword(password);
  const got = sessionTokenFromPassword(submitted);
  if (!sessionTokensEqual(expected, got)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADVISOR_AUTH_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function GET() {
  const password = getConfiguredPassword();
  if (!password) {
    return NextResponse.json({ authenticated: false, configured: false });
  }
  // Cookie check happens client-side via a protected probe; this only reports config
  return NextResponse.json({ configured: true });
}
