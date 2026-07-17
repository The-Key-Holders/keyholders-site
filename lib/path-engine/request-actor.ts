import { cookies } from "next/headers";
import { demoUserForRole, userToActor } from "./authz";
import {
  PORTAL_ROLE_COOKIE,
  PORTAL_USER_COOKIE,
  parseRoleCookie,
} from "./session";
import { getUserById } from "./store";
import type { Actor, Role } from "./types";

/**
 * Prefer magic-link user cookie; fall back to demo role cookie (beta).
 */
export function actorFromRequestCookies(): Actor {
  const jar = cookies();
  const userId = jar.get(PORTAL_USER_COOKIE)?.value?.trim();
  if (userId) {
    const user = getUserById(userId);
    if (user && user.active !== false) return userToActor(user);
  }
  const role = parseRoleCookie(jar.get(PORTAL_ROLE_COOKIE)?.value) ?? "psap";
  return demoUserForRole(role);
}

export function roleFromRequestCookies(): Role {
  return actorFromRequestCookies().role;
}
