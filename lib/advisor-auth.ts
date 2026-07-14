import { createHash, timingSafeEqual } from "crypto";

/** HTTP-only cookie name for Advisor Tools gate */
export const ADVISOR_AUTH_COOKIE = "advisor_tools_auth";

/** Paths that require the advisor tools password */
export const ADVISOR_PROTECTED_PREFIXES = [
  "/advisor-tools",
  "/psap-allotment",
  "/api/psap-allotment",
  "/api/invoice-reconcile",
] as const;

/** Public under protected prefixes */
export const ADVISOR_PUBLIC_PATHS = [
  "/advisor-tools/login",
  "/api/advisor-tools/auth",
] as const;

export function isAdvisorProtectedPath(pathname: string): boolean {
  if (ADVISOR_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return false;
  }
  return ADVISOR_PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

/** Deterministic session token derived from the shared password (Node runtime). */
export function sessionTokenFromPassword(password: string): string {
  return createHash("sha256")
    .update(`keyholders-advisor-tools:v1:${password}`, "utf8")
    .digest("hex");
}

export function sessionTokensEqual(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function getConfiguredPassword(): string | null {
  const p = process.env.ADVISOR_TOOLS_PASSWORD?.trim();
  return p ? p : null;
}
