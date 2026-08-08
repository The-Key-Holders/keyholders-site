import { describe, expect, it } from "vitest";
import {
  SHIPPED_CONTENT_PACK_VERSION,
  SHIPPED_HE_SAID,
  SHIPPED_TRIVIA,
  assertHeSaidPackV3,
  assertTriviaPackV3,
  packVersion,
  resolveContentPack,
} from "./party-content";

describe("party content pack versioning", () => {
  it("ships trivia v3 with sister roast + relationship lore", () => {
    expect(packVersion(SHIPPED_TRIVIA)).toBe(SHIPPED_CONTENT_PACK_VERSION);
    const errs = assertTriviaPackV3(SHIPPED_TRIVIA as { questions?: Array<{ q?: string }> });
    expect(errs, errs.join("\n")).toEqual([]);
  });

  it("ships he-said v3 roast pack", () => {
    expect(packVersion(SHIPPED_HE_SAID)).toBe(SHIPPED_CONTENT_PACK_VERSION);
    const errs = assertHeSaidPackV3(SHIPPED_HE_SAID as { questions?: Array<{ q?: string }> });
    expect(errs, errs.join("\n")).toEqual([]);
  });

  it("ignores stale host trivia with same length but no version", () => {
    const stale = {
      id: "trivia",
      questions: Array.from({ length: 15 }, (_, i) => ({
        q: `Old question ${i + 1}`,
        choices: ["A", "B", "C", "D"],
        answer: 0,
      })),
    };
    const resolved = resolveContentPack("trivia", stale);
    expect(resolved.contentPackVersion).toBe(SHIPPED_CONTENT_PACK_VERSION);
    const blob = (resolved.questions as Array<{ q: string }>).map((q) => q.q).join("\n");
    expect(blob).toContain("self-centered, petty, and egotistical");
    expect(blob).not.toContain("Old question 1");
  });

  it("ignores short host he-said packs", () => {
    const stale = {
      questions: [{ q: "More likely to over-optimize a packing list?", choices: ["Dani", "Javad"], answer: 1 }],
    };
    const resolved = resolveContentPack("he-said", stale);
    expect((resolved.questions as unknown[]).length).toBeGreaterThanOrEqual(12);
    expect(
      (resolved.questions as Array<{ q: string }>).some((q) => q.q.includes("dramatic"))
    ).toBe(true);
  });

  it("accepts host pack when version is newer", () => {
    const newer = {
      contentPackVersion: SHIPPED_CONTENT_PACK_VERSION + 1,
      contentPackId: "host-custom",
      questions: [
        { q: "Host-only custom question?", choices: ["A", "B", "C", "D"], answer: 0 },
      ],
    };
    const resolved = resolveContentPack("trivia", newer);
    expect(resolved.contentPackId).toBe("host-custom");
    expect((resolved.questions as Array<{ q: string }>)[0].q).toContain("Host-only");
  });

  it("rejects empty host pack even with high version", () => {
    const empty = { contentPackVersion: 99, questions: [] };
    const resolved = resolveContentPack("trivia", empty);
    expect(resolved.contentPackVersion).toBe(SHIPPED_CONTENT_PACK_VERSION);
  });
});
