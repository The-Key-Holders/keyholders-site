/** Shoe Game pure logic (predict → grade). */

export type ShoeChoice = "dani" | "javad";

export type ShoeQuestion = {
  id: string;
  q: string;
  category?: string;
};

export type ShoePhase = "closed" | "predict" | "live" | "grade" | "archived";

export type ShoePrediction = {
  profileId: string;
  questionId: string;
  choice: ShoeChoice;
  lockedAt: number;
  graded?: boolean;
  matched?: boolean;
};

export const SHOE_POINTS_PHASE1 = 10;
export const SHOE_POINTS_PHASE2 = 15;

export const DEFAULT_SHOE_QUESTIONS: ShoeQuestion[] = [
  { id: "first_move", q: "Who made the first move?", category: "dynamics" },
  { id: "love_first", q: "Who said “I love you” first?", category: "dynamics" },
  { id: "messier", q: "Who is messier?", category: "funny" },
  { id: "ready", q: "Who takes longer to get ready?", category: "funny" },
  { id: "stubborn", q: "Who is more stubborn?", category: "funny" },
  { id: "cook", q: "Who is the better cook?", category: "food" },
  { id: "pets", q: "Who is more likely to spoil the pets?", category: "pets" },
  { id: "roadtrip", q: "Who is more likely to suggest a spontaneous road trip?", category: "adventure" },
  { id: "laugh", q: "Who makes the other laugh more?", category: "sweet" },
  { id: "grow_old", q: "Who is more excited to grow old together?", category: "sweet" },
];

export function normalizeChoice(raw: unknown): ShoeChoice | null {
  const s = String(raw || "")
    .trim()
    .toLowerCase();
  if (s === "dani" || s === "she" || s === "d") return "dani";
  if (s === "javad" || s === "he" || s === "j") return "javad";
  return null;
}

/** Phase 1 lock: one choice per question; immutable after lock. */
export function lockPredictions(args: {
  existing: ShoePrediction[];
  profileId: string;
  answers: Array<{ questionId: string; choice: unknown }>;
  questions: ShoeQuestion[];
  now?: number;
}): { ok: true; predictions: ShoePrediction[]; phase1Score: number } | { ok: false; code: string; message: string } {
  const { existing, profileId, answers, questions, now = Date.now() } = args;
  const already = existing.filter((p) => p.profileId === profileId);
  if (already.length > 0) {
    return {
      ok: false,
      code: "SHOE_ALREADY_LOCKED",
      message: "Predictions are locked. No take-backs.",
    };
  }
  const qIds = new Set(questions.map((q) => q.id));
  const next: ShoePrediction[] = [];
  for (const a of answers) {
    if (!qIds.has(a.questionId)) continue;
    const choice = normalizeChoice(a.choice);
    if (!choice) {
      return { ok: false, code: "SHOE_BAD_CHOICE", message: "Each answer must be Dani or Javad." };
    }
    if (next.some((n) => n.questionId === a.questionId)) continue;
    next.push({ profileId, questionId: a.questionId, choice, lockedAt: now });
  }
  if (next.length < Math.min(questions.length, 1)) {
    return { ok: false, code: "SHOE_EMPTY", message: "Lock at least one prediction." };
  }
  // require full set for full points clarity
  if (next.length < questions.length) {
    return {
      ok: false,
      code: "SHOE_INCOMPLETE",
      message: `Answer all ${questions.length} questions before locking.`,
    };
  }
  const phase1Score = next.length * SHOE_POINTS_PHASE1;
  return { ok: true, predictions: next, phase1Score };
}

export function gradePredictions(args: {
  predictions: ShoePrediction[];
  profileId: string;
  official: Record<string, ShoeChoice>;
  questions: ShoeQuestion[];
}): { matches: number; bonus: number; updated: ShoePrediction[] } {
  const { predictions, profileId, official, questions } = args;
  let matches = 0;
  const updated = predictions.map((p) => {
    if (p.profileId !== profileId) return p;
    if (p.graded) return p;
    const ans = official[p.questionId];
    if (!ans) return p;
    const matched = p.choice === ans;
    if (matched) matches += 1;
    return { ...p, graded: true, matched };
  });
  return {
    matches,
    bonus: matches * SHOE_POINTS_PHASE2,
    updated,
  };
}

export function shoePhaseLabel(phase: ShoePhase): string {
  switch (phase) {
    case "closed":
      return "Shoe Game is closed";
    case "predict":
      return "Phase 1: lock your prop bets";
    case "live":
      return "Phase 2 prep: couple is live on stage";
    case "grade":
      return "Phase 2: verify & collect bonus points";
    case "archived":
      return "Shoe Game finished";
    default:
      return "Shoe Game";
  }
}
