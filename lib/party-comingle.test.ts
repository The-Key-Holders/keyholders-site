import { describe, expect, it } from "vitest";
import {
  DEFAULT_COMINGLE,
  DEFAULT_COMINGLE_ANSWERS,
  answerMatches,
  resolveComingle,
} from "./party-store";

describe("co-mingle pack v2 icebreakers", () => {
  it("ships 5 unique quests (not legacy chad/cupcakes/homelab)", () => {
    expect(DEFAULT_COMINGLE.length).toBe(5);
    const ids = DEFAULT_COMINGLE.map((q) => q.id);
    expect(ids).toContain("allwhite_love");
    expect(ids).toContain("dessert_heist");
    expect(ids).toContain("pet_intel");
    expect(ids).toContain("concert_crew");
    expect(ids).toContain("hike_liar");
    expect(ids).not.toContain("chad");
    expect(ids).not.toContain("homelab");
  });

  it("upgrades legacy 3-quest host pack", () => {
    const legacy = [
      { id: "chad", prompt: "old", points: 25 },
      { id: "cupcakes", prompt: "old", points: 25 },
      { id: "homelab", prompt: "old", points: 25 },
    ];
    const r = resolveComingle(legacy as never, { chad: ["quinn"] });
    expect(r.comingle.length).toBe(5);
    expect(r.comingle[0].id).toBe("allwhite_love");
    expect(r.comingleAnswers.pet_intel).toContain("luna");
  });

  it("keeps custom host packs with 5+ non-legacy quests", () => {
    const custom = Array.from({ length: 5 }, (_, i) => ({
      id: `custom_${i}`,
      prompt: `Custom quest ${i}`,
      points: 25,
    }));
    const r = resolveComingle(custom as never, { custom_0: ["yes"] });
    expect(r.comingle[0].id).toBe("custom_0");
    expect(r.comingleAnswers.custom_0).toContain("yes");
  });

  it("accepts flexible answers for pet + hike quests", () => {
    expect(answerMatches("Luna!", DEFAULT_COMINGLE_ANSWERS.pet_intel)).toBe(true);
    expect(answerMatches("rue", DEFAULT_COMINGLE_ANSWERS.pet_intel)).toBe(true);
    expect(answerMatches("Both of them", DEFAULT_COMINGLE_ANSWERS.hike_liar)).toBe(true);
    expect(answerMatches("Javad", DEFAULT_COMINGLE_ANSWERS.allwhite_love)).toBe(true);
  });
});
