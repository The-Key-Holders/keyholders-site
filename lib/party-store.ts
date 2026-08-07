/**
 * Party store for production multiplayer on Vercel.
 * Uses globalThis so warm instances share state during the party window.
 * Docker party-api + SQLite remains the durable lab option.
 */

export type PartyProfile = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  firstKey: string;
  lastKey: string;
  createdAt: number;
  ringsFound: number;
  guestbookSigned: boolean;
  posesSpun: number;
  passportBonus: number;
  totalPoints: number;
};

export type PartyScore = {
  id: string;
  profileId: string;
  game: string;
  score: number;
  maxScore: number;
  durationMs?: number;
  createdAt: number;
};

type Store = {
  profiles: Map<string, PartyProfile>;
  scores: PartyScore[];
};

const globalForParty = globalThis as unknown as { __djPartyStore?: Store };

function store(): Store {
  if (!globalForParty.__djPartyStore) {
    globalForParty.__djPartyStore = {
      profiles: new Map(),
      scores: [],
    };
  }
  return globalForParty.__djPartyStore;
}

export const MAX_PROFILES = 150;

export const PUBLIC_CONFIG = {
  eventName: "Dani & Javad Engagement Party",
  couple: "Dani & Javad",
  dateLabel: "Saturday, August 8, 2026",
  timeLabel: "1:00 PM – 5:00 PM",
  venue: "Unleashed Event Space",
  venueAddress: "1361 Fulton Ave, Suite 103, Sacramento, CA 95825",
  photosUrl: "https://photos.app.goo.gl/tNy59HYGHJzvhX536",
  maxProfiles: MAX_PROFILES,
  prize: {
    enabled: true,
    title: "Mystery gift card",
    description:
      "Highest combined score at last call wins. Handed out in person — must be present.",
    announceAt: "4:45 PM",
    legalNote: "One win per person. Host decision final.",
  },
  ringHunt: {
    title: "The Great Plastic Ring Hunt",
    blurb:
      "Real plastic wedding rings are hidden around the venue. Find them. Be gentle with decor. Real gold stays on fingers.",
    rules: [
      "Scan the room (not the ceiling tiles, hero).",
      "Be kind to flowers, kids, and other hunters.",
      "When you find a ring, follow the table sign.",
      "Tap “I found a ring!” so we can cheer and stamp your passport.",
    ],
    pointsPerFind: 15,
    maxFindsCounted: 3,
  },
  guestbook: {
    title: "Sign the real guest book",
    location: "Welcome table near the entrance (paper book + pens).",
    blurb: "Ink > pixels for this one. Leave a note, then stamp it here.",
    points: 10,
  },
  schedule: [
    { time: "1:00 PM", what: "Doors · drinks · photos · chaos (friendly)" },
    { time: "1:25 PM", what: "Welcome speech" },
    { time: "1:30 PM", what: "Tacos" },
    { time: "2:15 PM", what: "Surprise energy spike" },
    { time: "2:30 PM", what: "Games + phone quests" },
    { time: "4:30 PM", what: "Last call · short cheers" },
    { time: "4:45 PM", what: "Prize vibe check" },
    { time: "5:00 PM", what: "Hugs and graceful exit" },
  ],
  thanks:
    "Thanks for showing up IRL. The Wi‑Fi of our hearts is stronger with you here.",
};

export function norm(s: string) {
  return s.trim().split(/\s+/).join(" ").toLowerCase();
}

export function displayFor(first: string, last: string) {
  const f = first.trim().split(/\s+/).join(" ");
  const l = last.trim().split(/\s+/).join(" ");
  return `${f} ${l ? l[0] + "." : ""}`.trim();
}

export function recompute(p: PartyProfile, scores: PartyScore[]) {
  const best: Record<string, number> = {};
  for (const s of scores.filter((x) => x.profileId === p.id)) {
    best[s.game] = Math.max(best[s.game] || 0, s.score);
  }
  const gamePts = Object.values(best).reduce((a, b) => a + b, 0);
  const ringPts =
    Math.min(p.ringsFound, PUBLIC_CONFIG.ringHunt.maxFindsCounted) *
    PUBLIC_CONFIG.ringHunt.pointsPerFind;
  const bookPts = p.guestbookSigned ? PUBLIC_CONFIG.guestbook.points : 0;
  const posePts = Math.min(p.posesSpun, 1) * 5;
  p.totalPoints = gamePts + ringPts + bookPts + posePts + (p.passportBonus || 0);
  return p.totalPoints;
}

export function getStore() {
  return store();
}

export function toPublic(p: PartyProfile) {
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    displayName: p.displayName,
    ringsFound: p.ringsFound,
    guestbookSigned: p.guestbookSigned,
    posesSpun: p.posesSpun,
    passportBonus: p.passportBonus,
    totalPoints: p.totalPoints,
    createdAt: p.createdAt,
  };
}
