import { describe, expect, it } from "vitest";
import {
  PSAP_PORTAL_REQUIRED_MARKERS,
  PSAP_PORTAL_SYSTEM_PROMPT,
} from "./prompt";
import { composePsapPortalSystemPrompt, retrievePortalContext } from "./retrieve";

describe("psap portal agent prompt", () => {
  it("contains required markers", () => {
    for (const m of PSAP_PORTAL_REQUIRED_MARKERS) {
      expect(PSAP_PORTAL_SYSTEM_PROMPT).toContain(m);
    }
  });

  it("compose includes retrieved context", () => {
    const p = composePsapPortalSystemPrompt("### test\nhello residual");
    expect(p).toContain("Retrieved context");
    expect(p).toContain("hello residual");
  });

  it("retrieve returns content for residual query", () => {
    const ctx = retrievePortalContext("residual funds TD-288");
    expect(ctx.length).toBeGreaterThan(50);
  });
});
