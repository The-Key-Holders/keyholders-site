import { PORTAL_ROLE_COOKIE, isRole } from "@/lib/path-engine/session";
import { demoUserForRole } from "@/lib/path-engine/authz";
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
  const res = NextResponse.json({ ok: true, role: body.role, actor });
  res.cookies.set(PORTAL_ROLE_COOKIE, body.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
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
