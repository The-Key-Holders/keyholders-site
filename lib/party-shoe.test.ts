import { describe, expect, it } from "vitest";
import {
  DEFAULT_SHOE_QUESTIONS,
  gradePredictions,
  lockPredictions,
  normalizeChoice,
  SHOE_POINTS_PHASE1,
  SHOE_POINTS_PHASE2,
} from "./party-shoe";

describe("normalizeChoice", () => {
  it("accepts dani/javad aliases", () => {
    expect(normalizeChoice("Dani")).toBe("dani");
    expect(normalizeChoice("she")).toBe("dani");
    expect(normalizeChoice("JAVAD")).toBe("javad");
    expect(normalizeChoice("he")).toBe("javad");
    expect(normalizeChoice("nope")).toBeNull();
  });
});

describe("lockPredictions", () => {
  const qs = DEFAULT_SHOE_QUESTIONS;

  it("locks full set and scores phase1", () => {
    const answers = qs.map((q, i) => ({
      questionId: q.id,
      choice: i % 2 === 0 ? "dani" : "javad",
    }));
    const r = lockPredictions({
      existing: [],
      profileId: "p1",
      answers,
      questions: qs,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.predictions).toHaveLength(qs.length);
      expect(r.phase1Score).toBe(qs.length * SHOE_POINTS_PHASE1);
    }
  });

  it("rejects second lock", () => {
    const answers = qs.map((q) => ({ questionId: q.id, choice: "dani" }));
    const first = lockPredictions({
      existing: [],
      profileId: "p1",
      answers,
      questions: qs,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = lockPredictions({
      existing: first.predictions,
      profileId: "p1",
      answers,
      questions: qs,
    });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe("SHOE_ALREADY_LOCKED");
  });

  it("rejects incomplete", () => {
    const r = lockPredictions({
      existing: [],
      profileId: "p1",
      answers: [{ questionId: qs[0].id, choice: "dani" }],
      questions: qs,
    });
    expect(r.ok).toBe(false);
  });
});

describe("gradePredictions", () => {
  it("awards bonus per match once", () => {
    const qs = DEFAULT_SHOE_QUESTIONS.slice(0, 3);
    const preds = qs.map((q, i) => ({
      profileId: "p1",
      questionId: q.id,
      choice: (i === 0 ? "dani" : "javad") as "dani" | "javad",
      lockedAt: 1,
    }));
    const official = {
      [qs[0].id]: "dani" as const,
      [qs[1].id]: "dani" as const,
      [qs[2].id]: "javad" as const,
    };
    const g = gradePredictions({
      predictions: preds,
      profileId: "p1",
      official,
      questions: qs,
    });
    expect(g.matches).toBe(2);
    expect(g.bonus).toBe(2 * SHOE_POINTS_PHASE2);
    expect(g.updated.every((p) => p.graded)).toBe(true);
  });
});
