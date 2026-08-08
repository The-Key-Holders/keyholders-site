import { describe, expect, it } from "vitest";
import {
  SHIPPED_CONTENT_PACK_VERSION,
  SHIPPED_HE_SAID,
  SHIPPED_TRIVIA,
  assertHeSaidPackV4,
  assertTriviaPackV4,
  packVersion,
  resolveContentPack,
} from "./party-content";

describe("party content pack v4", () => {
  it("ships trivia v4 with curated lore + sister roast, no basic ops filler", () => {
    expect(packVersion(SHIPPED_TRIVIA)).toBe(SHIPPED_CONTENT_PACK_VERSION);
    expect(SHIPPED_CONTENT_PACK_VERSION).toBe(4);
    const errs = assertTriviaPackV4(SHIPPED_TRIVIA as { questions?: Array<{ q?: string }> });
    expect(errs, errs.join("\n")).toEqual([]);
    expect((SHIPPED_TRIVIA.questions as unknown[]).length).toBe(12);
  });

  it("ships he-said v4 roast pack", () => {
    expect(packVersion(SHIPPED_HE_SAID)).toBe(SHIPPED_CONTENT_PACK_VERSION);
    const errs = assertHeSaidPackV4(SHIPPED_HE_SAID as { questions?: Array<{ q?: string }> });
    expect(errs, errs.join("\n")).toEqual([]);
  });

  it("ignores stale host trivia with same length but no version", () => {
    const stale = {
      id: "trivia",
      questions: Array.from({ length: 12 }, (_, i) => ({
        q: `Old basic question ${i + 1}`,
        choices: ["A", "B", "C", "D"],
        answer: 0,
      })),
    };
    const resolved = resolveContentPack("trivia", stale);
    expect(resolved.contentPackVersion).toBe(4);
    const blob = (resolved.questions as Array<{ q: string }>).map((q) => q.q).join("\n");
    expect(blob).toContain("self-centered, petty, and egotistical");
    expect(blob).not.toContain("Old basic question 1");
  });

  it("ignores short host he-said packs", () => {
    const stale = {
      questions: [{ q: "More likely to over-optimize a packing list?", choices: ["Dani", "Javad"], answer: 1 }],
    };
    const resolved = resolveContentPack("he-said", stale);
    expect((resolved.questions as unknown[]).length).toBeGreaterThanOrEqual(12);
  });

  it("accepts host pack when version is newer", () => {
    const newer = {
      contentPackVersion: SHIPPED_CONTENT_PACK_VERSION + 1,
      contentPackId: "host-custom",
      questions: [{ q: "Host-only custom question?", choices: ["A", "B", "C", "D"], answer: 0 }],
    };
    const resolved = resolveContentPack("trivia", newer);
    expect(resolved.contentPackId).toBe("host-custom");
  });

  it("public path uses null host => shipped", () => {
    const resolved = resolveContentPack("trivia", null);
    expect(resolved.contentPackId).toBe("guest-hub-questions-v4-20260808");
  });
});
