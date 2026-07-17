import { listAssignments } from "./store";
import type { Actor, Role, User } from "./types";

export function assignedPsapIds(advisorUserId: string): Set<string> {
  return new Set(
    listAssignments()
      .filter((a) => a.advisorUserId === advisorUserId)
      .map((a) => a.psapId)
  );
}

/** PSAPs this actor may see/write. */
export function visiblePsapIds(actor: Actor): Set<string> {
  if (actor.role === "admin") {
    // admin: all — caller expands via listPsaps when needed
    return new Set(["*"]);
  }
  if (actor.role === "advisor") {
    return assignedPsapIds(actor.userId);
  }
  // psap: membership only
  return new Set(actor.psapIds ?? []);
}

export function canAccessPsap(actor: Actor, psapId: string): boolean {
  if (actor.role === "admin") return true;
  return visiblePsapIds(actor).has(psapId);
}

export function canOverride(actor: Actor): boolean {
  return actor.role === "advisor" || actor.role === "admin";
}

export function canApproveAccess(actor: Actor): boolean {
  return actor.role === "admin";
}

export function userToActor(user: User): Actor {
  return {
    userId: user.id,
    role: user.role,
    displayName: user.displayName,
    email: user.email,
    psapIds: user.psapIds,
  };
}

export function demoUserForRole(role: Role): Actor {
  const map: Record<Role, Actor> = {
    advisor: {
      userId: "user_advisor_demo",
      role: "advisor",
      displayName: "Demo Advisor",
      email: "advisor.demo@example.com",
    },
    psap: {
      userId: "user_psap_demo",
      role: "psap",
      displayName: "Demo PSAP Staff",
      email: "psap.demo@example.com",
      psapIds: ["psap_roseville"],
    },
    admin: {
      userId: "user_admin_demo",
      role: "admin",
      displayName: "Portal Admin",
      email: "admin.demo@example.com",
    },
  };
  return map[role];
}
