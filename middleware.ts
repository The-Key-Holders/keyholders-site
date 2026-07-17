import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "advisor_tools_auth";

const PROTECTED = [
  "/advisor-tools",
  "/psap-allotment",
  "/psap-portal",
  "/api/psap-allotment",
  "/api/psap-portal",
  "/api/invoice-reconcile",
  // Agent chat API is gated; /api/advisor-tools/auth stays public via PUBLIC list
  "/api/advisor-tools",
];
const PUBLIC = ["/advisor-tools/login", "/api/advisor-tools/auth"];

function isPublic(pathname: string): boolean {
  return PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isProtected(pathname: string): boolean {
  if (isPublic(pathname)) return false;
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Edge-compatible SHA-256 hex */
async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function expectedToken(password: string): Promise<string> {
  return sha256Hex(`keyholders-advisor-tools:v1:${password}`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const password = process.env.ADVISOR_TOOLS_PASSWORD?.trim();
  if (!password) {
    // Fail closed: tools unavailable until password is configured
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Advisor tools password not configured (ADVISOR_TOOLS_PASSWORD)." },
        { status: 503 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/advisor-tools/login";
    url.searchParams.set("error", "not_configured");
    return NextResponse.redirect(url);
  }

  const cookie = request.cookies.get(COOKIE)?.value;
  const expected = await expectedToken(password);
  if (cookie && cookie === expected) {
    return NextResponse.next();
  }

  // Unauthenticated
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/advisor-tools/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/advisor-tools",
    "/advisor-tools/:path*",
    "/psap-allotment",
    "/psap-allotment/:path*",
    "/psap-portal",
    "/psap-portal/:path*",
    "/api/psap-allotment",
    "/api/psap-allotment/:path*",
    "/api/psap-portal",
    "/api/psap-portal/:path*",
    "/api/invoice-reconcile",
    "/api/invoice-reconcile/:path*",
    "/api/advisor-tools",
    "/api/advisor-tools/:path*",
  ],
};
