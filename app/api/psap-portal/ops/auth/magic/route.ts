import { redeemMagicToken } from "@/lib/path-engine/access";
import {
  PORTAL_ROLE_COOKIE,
  PORTAL_USER_COOKIE,
} from "@/lib/path-engine/session";
import { withOpsStore } from "@/lib/path-engine/with-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_AGE = 60 * 60 * 24 * 14;

export async function GET(request: Request) {
  return withOpsStore(() => {
    const url = new URL(request.url);
    const token = url.searchParams.get("token") || "";
    try {
      const user = redeemMagicToken(token);
      const res = NextResponse.redirect(
        new URL(
          user.role === "advisor"
            ? "/psap-portal/advisor/dashboard"
            : user.role === "admin"
              ? "/psap-portal/admin"
              : "/psap-portal/pathfinder",
          url.origin
        )
      );
      res.cookies.set(PORTAL_USER_COOKIE, user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      });
      res.cookies.set(PORTAL_ROLE_COOKIE, user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
      });
      return res;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid link";
      return NextResponse.redirect(
        new URL(
          `/psap-portal/access?error=${encodeURIComponent(msg)}`,
          url.origin
        )
      );
    }
  });
}
