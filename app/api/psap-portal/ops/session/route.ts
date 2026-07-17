import { demoUserForRole } from "@/lib/path-engine/authz";
import {
  PORTAL_ROLE_COOKIE,
  PORTAL_USER_COOKIE,
  isRole,
} from "@/lib/path-engine/session";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_AGE = 60 * 60 * 24 * 14;

export async function POST(request: Request) {
  let body: { role?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isRole(body.role)) {
    return NextResponse.json({ error: "role must be psap|advisor|admin" }, { status: 400 });
  }
  const actor = demoUserForRole(body.role);
  const res = NextResponse.json({ ok: true, role: body.role, actor, mode: "demo" });
  res.cookies.set(PORTAL_ROLE_COOKIE, body.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  // Clear magic-link user so demo persona takes effect
  res.cookies.set(PORTAL_USER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET() {
  const { cookies } = await import("next/headers");
  const jar = cookies();
  const role = jar.get(PORTAL_ROLE_COOKIE)?.value ?? null;
  return NextResponse.json({
    role: isRole(role) ? role : null,
    actor: isRole(role) ? demoUserForRole(role) : null,
  });
}
