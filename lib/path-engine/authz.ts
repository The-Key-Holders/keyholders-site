import { listAssignments } from "./store";
import type { Actor, Role } from "./types";

export function assignedPsapIds(advisorUserId: string): Set<string> {
  return new Set(
    listAssignments()
      .filter((a) => a.advisorUserId === advisorUserId)
      .map((a) => a.psapId)
  );
}

/** Can this actor see/write this PSAP's paths? */
export function canAccessPsap(actor: Actor, psapId: string): boolean {
  if (actor.role === "admin") return true;
  if (actor.role === "psap") {
    // Demo Slice 1: PSAP staff can access all demo PSAPs (single beta tenant).
    // Later: bind user→psap membership.
    return true;
  }
  if (actor.role === "advisor") {
    return assignedPsapIds(actor.userId).has(psapId);
  }
  return false;
}

export function canOverride(actor: Actor): boolean {
  return actor.role === "advisor" || actor.role === "admin";
}

export function demoUserForRole(role: Role): Actor {
  const map: Record<Role, Actor> = {
    advisor: {
      userId: "user_advisor_demo",
      role: "advisor",
      displayName: "Demo Advisor",
    },
    psap: {
      userId: "user_psap_demo",
      role: "psap",
      displayName: "Demo PSAP Staff",
    },
    admin: {
      userId: "user_admin_demo",
      role: "admin",
      displayName: "Portal Admin",
    },
  };
  return map[role];
}
