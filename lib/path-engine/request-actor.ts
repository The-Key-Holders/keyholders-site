import { cookies } from "next/headers";
import { demoUserForRole } from "./authz";
import { PORTAL_ROLE_COOKIE, parseRoleCookie } from "./session";
import type { Actor, Role } from "./types";

/** Resolve Slice 1 actor from role cookie (defaults to psap). */
export function actorFromRequestCookies(): Actor {
  const jar = cookies();
  const role = parseRoleCookie(jar.get(PORTAL_ROLE_COOKIE)?.value) ?? "psap";
  return demoUserForRole(role);
}

export function roleFromRequestCookies(): Role {
  const jar = cookies();
  return parseRoleCookie(jar.get(PORTAL_ROLE_COOKIE)?.value) ?? "psap";
}
