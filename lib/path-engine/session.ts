import type { Role } from "./types";

/** HTTP-only cookie for server-side portal role (Slice 1). */
export const PORTAL_ROLE_COOKIE = "psap_portal_role";

export function isRole(v: unknown): v is Role {
  return v === "psap" || v === "advisor" || v === "admin";
}

export function parseRoleCookie(value: string | undefined): Role | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  return isRole(v) ? v : null;
}
