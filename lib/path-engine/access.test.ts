import { beforeEach, describe, expect, it } from "vitest";
import {
  decideAccessRequest,
  redeemMagicToken,
  submitAccessRequest,
} from "./access";
import { demoUserForRole } from "./authz";
import { resetOpsStore, getUserByEmail } from "./store";

beforeEach(() => {
  resetOpsStore();
});

describe("access request + magic link", () => {
  it("submits, approves, redeems token", () => {
    const req = submitAccessRequest({
      email: "new.psap@county.example",
      displayName: "New PSAP User",
      roleRequested: "psap",
      psapName: "Roseville PD",
      county: "Placer",
      note: "Need portal for CPE package",
    });
    expect(req.status).toBe("pending");

    const admin = demoUserForRole("admin");
    const decided = decideAccessRequest(admin, req.id, "approved", {
      psapId: "psap_roseville",
    });
    expect(decided.request.status).toBe("approved");
    expect(decided.magicUrlPath).toMatch(/token=/);
    expect(getUserByEmail("new.psap@county.example")?.psapIds).toContain(
      "psap_roseville"
    );

    const token = decided.magicUrlPath!.split("token=")[1];
    const user = redeemMagicToken(token);
    expect(user.email).toBe("new.psap@county.example");
    expect(() => redeemMagicToken(token)).toThrow(/already used/i);
  });

  it("rejects admin self-request", () => {
    expect(() =>
      submitAccessRequest({
        email: "x@y.com",
        displayName: "X",
        roleRequested: "admin",
      })
    ).toThrow(/Admin/i);
  });
});
