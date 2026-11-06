import { CPE_FIT_BASE } from "@/lib/cpe-fit/public-types";
import {
  isCpeFitHost,
  isCpeFitHostAppPath,
  isCpeFitHostStaticPath,
  loginNextOnCpeFitHost,
} from "@/lib/cpe-fit-host";
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

/** null = cookie is valid, continue. Otherwise return the 401 / login redirect. */
async function enforceAdvisorAuth(request: NextRequest, loginNext: string): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  const password = process.env.ADVISOR_TOOLS_PASSWORD?.trim();
  if (!password) {
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
    return null;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/advisor-tools/login";
  url.searchParams.set("next", loginNext);
  return NextResponse.redirect(url);
}

function rewriteToCpeFitHome(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = CPE_FIT_BASE;
  return NextResponse.rewrite(url);
}

async function cpeFitHostMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isCpeFitHostStaticPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublic(pathname)) {
    if (
      (pathname === "/advisor-tools/login" || pathname === "/advisor-tools/login/") &&
      !request.nextUrl.searchParams.has("next")
    ) {
      const url = request.nextUrl.clone();
      url.searchParams.set("next", "/");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const blocked = await enforceAdvisorAuth(request, loginNextOnCpeFitHost(pathname));
  if (blocked) return blocked;

  if (pathname === "/" || pathname === "") {
    return rewriteToCpeFitHome(request);
  }

  if (!isCpeFitHostAppPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (isCpeFitHost(host)) {
    return cpeFitHostMiddleware(request);
  }

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const blocked = await enforceAdvisorAuth(request, pathname);
  if (blocked) return blocked;
  return NextResponse.next();
}

export const config = {
  matcher: [
    // CPE Fit host must gate `/` and marketing paths; main site still no-ops those.
    "/",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
