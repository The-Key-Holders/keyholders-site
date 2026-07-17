import { createHash, randomBytes } from "crypto";
import { newId, nowIso } from "./id";
import {
  getSnapshot,
  getUserByEmail,
  getUserById,
  mutateSnapshot,
} from "./store";
import type {
  AccessRequest,
  Actor,
  MagicToken,
  Role,
  User,
} from "./types";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function tokenValue(): string {
  return randomBytes(24).toString("hex");
}

export function listAccessRequests(): AccessRequest[] {
  return clone(getSnapshot().accessRequests ?? []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function submitAccessRequest(input: {
  email: string;
  displayName: string;
  roleRequested: Role;
  psapId?: string;
  psapName?: string;
  county?: string;
  note?: string;
}): AccessRequest {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) throw new Error("Valid email required");
  if (!input.displayName.trim()) throw new Error("Name required");
  if (input.roleRequested === "admin") {
    throw new Error("Admin access cannot be self-requested");
  }

  const existing = (getSnapshot().accessRequests ?? []).find(
    (r) => r.email === email && r.status === "pending"
  );
  if (existing) return clone(existing);

  const row: AccessRequest = {
    id: newId("areq"),
    email,
    displayName: input.displayName.trim(),
    roleRequested: input.roleRequested,
    psapId: input.psapId,
    psapName: input.psapName,
    county: input.county,
    note: input.note,
    status: "pending",
    createdAt: nowIso(),
  };

  mutateSnapshot((snap) => {
    if (!snap.accessRequests) snap.accessRequests = [];
    snap.accessRequests.push(row);
  });
  return clone(row);
}

export function decideAccessRequest(
  actor: Actor,
  requestId: string,
  decision: "approved" | "denied",
  opts?: { psapId?: string }
): { request: AccessRequest; magicUrlPath?: string; user?: User } {
  if (actor.role !== "admin") throw new Error("Forbidden");

  const snap = getSnapshot();
  const req = (snap.accessRequests ?? []).find((r) => r.id === requestId);
  if (!req) throw new Error("Request not found");
  if (req.status !== "pending") throw new Error("Request already decided");

  if (decision === "denied") {
    const updated: AccessRequest = {
      ...req,
      status: "denied",
      decidedAt: nowIso(),
      decidedByUserId: actor.userId,
    };
    mutateSnapshot((s) => {
      const i = (s.accessRequests ?? []).findIndex((r) => r.id === requestId);
      if (i >= 0 && s.accessRequests) s.accessRequests[i] = updated;
    });
    return { request: updated };
  }

  const psapId = opts?.psapId || req.psapId;
  if (req.roleRequested === "psap" && !psapId) {
    throw new Error("psapId required to approve PSAP access");
  }

  let user = getUserByEmail(req.email);
  if (!user) {
    user = {
      id: newId("user"),
      email: req.email,
      displayName: req.displayName,
      role: req.roleRequested,
      psapIds: req.roleRequested === "psap" ? [psapId!] : undefined,
      active: true,
      createdAt: nowIso(),
    };
  } else {
    user = {
      ...user,
      displayName: req.displayName,
      role: req.roleRequested,
      psapIds:
        req.roleRequested === "psap"
          ? Array.from(new Set([...(user.psapIds ?? []), psapId!]))
          : user.psapIds,
      active: true,
    };
  }

  const token = tokenValue();
  const magic: MagicToken = {
    token,
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
  };

  const updated: AccessRequest = {
    ...req,
    status: "approved",
    decidedAt: nowIso(),
    decidedByUserId: actor.userId,
    psapId: psapId || req.psapId,
    magicLinkToken: token,
  };

  mutateSnapshot((s) => {
    if (!s.accessRequests) s.accessRequests = [];
    const i = s.accessRequests.findIndex((r) => r.id === requestId);
    if (i >= 0) s.accessRequests[i] = updated;
    const ui = s.users.findIndex((u) => u.id === user!.id);
    if (ui >= 0) s.users[ui] = user!;
    else s.users.push(user!);
    if (!s.magicTokens) s.magicTokens = [];
    s.magicTokens.push(magic);
    // Advisor assignment if new advisor
    if (user!.role === "advisor" && psapId) {
      const has = s.assignments.some(
        (a) => a.advisorUserId === user!.id && a.psapId === psapId
      );
      if (!has) {
        s.assignments.push({
          id: newId("asgn"),
          advisorUserId: user!.id,
          psapId,
        });
      }
    }
  });

  return {
    request: updated,
    user,
    magicUrlPath: `/api/psap-portal/ops/auth/magic?token=${token}`,
  };
}

/** Redeem magic token → user id for cookie. */
export function redeemMagicToken(token: string): User {
  const snap = getSnapshot();
  const mt = (snap.magicTokens ?? []).find((t) => t.token === token);
  if (!mt) throw new Error("Invalid or expired link");
  if (mt.usedAt) throw new Error("Link already used");
  if (new Date(mt.expiresAt).getTime() < Date.now()) {
    throw new Error("Link expired");
  }
  const user = getUserById(mt.userId);
  if (!user || user.active === false) throw new Error("User inactive");

  mutateSnapshot((s) => {
    const i = (s.magicTokens ?? []).findIndex((t) => t.token === token);
    if (i >= 0 && s.magicTokens) {
      s.magicTokens[i] = { ...s.magicTokens[i], usedAt: nowIso() };
    }
  });
  return clone(user);
}

/** Issue a fresh magic link for an existing user (admin or self re-send later). */
export function issueMagicLinkForUser(userId: string): string {
  const user = getUserById(userId);
  if (!user) throw new Error("User not found");
  const token = tokenValue();
  const magic: MagicToken = {
    token,
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
  };
  mutateSnapshot((s) => {
    if (!s.magicTokens) s.magicTokens = [];
    s.magicTokens.push(magic);
  });
  return `/api/psap-portal/ops/auth/magic?token=${token}`;
}

export function sessionFingerprint(userId: string): string {
  return createHash("sha256").update(`portal-user:${userId}`).digest("hex").slice(0, 16);
}

