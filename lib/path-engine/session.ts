import type { Role } from "./types";

/** HTTP-only cookie for demo role pick (Slice 1 fallback). */
export const PORTAL_ROLE_COOKIE = "psap_portal_role";

/** HTTP-only cookie for authenticated user id (Slice 2 magic link). */
export const PORTAL_USER_COOKIE = "psap_portal_user";

export function isRole(v: unknown): v is Role {
  return v === "psap" || v === "advisor" || v === "admin";
}

export function parseRoleCookie(value: string | undefined): Role | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  return isRole(v) ? v : null;
}
