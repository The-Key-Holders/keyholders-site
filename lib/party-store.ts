/**
 * Party store for TKH /celebrate on Vercel (in-memory, best-effort multiplayer).
 * Host desk can mutate config + content; guests use same origin /api/*.
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
  comingleDone: string[];
  stationsDone: string[];
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

export type HostState = {
  scoringMode: "auto" | "open" | "frozen";
  deadlineIso: string;
  publicBaseUrl: string;
  photosUrl?: string;
  eventName?: string;
  couple?: string;
  prize?: Record<string, unknown>;
  comingle?: Array<{ id: string; prompt: string; hint?: string; points?: number }>;
  comingleAnswers?: Record<string, string[]>;
  stations?: Array<{
    id: string;
    title: string;
    riddle: string;
    selfie?: string;
    points?: number;
  }>;
  stationKeywords?: Record<string, string[]>;
  content?: {
    trivia?: unknown;
    heSaid?: unknown;
    poses?: unknown;
  };
  /** Couples / hidden memory slots 1–10 (QR-only discovery) */
  memories?: HiddenMemory[];
  updatedAt?: string;
};

export type HiddenMemory = {
  slot: number;
  title: string;
  caption: string;
  /** Inline photo (data URL). Prefer small/compressed; large payloads can fail on serverless. */
  imageDataUrl: string;
  /** External https image URL (most reliable for public display). */
  imageUrl?: string;
  enabled: boolean;
};

type Store = {
  profiles: Map<string, PartyProfile>;
  scores: PartyScore[];
  predictions: Array<{ profileId: string; predictionId: string; option: string }>;
  wishes: Array<{ displayName: string; message: string; createdAt: number }>;
  songs: Array<{ displayName: string; title: string; artist: string; createdAt: number }>;
  advice: Array<{ displayName: string; message: string; createdAt: number }>;
  margarita: Array<{ profileId: string; flavor: string; rating: number }>;
  host: HostState;
};

const globalForParty = globalThis as unknown as { __djPartyStoreV2?: Store };

const DEFAULT_DEADLINE = "2026-08-08T16:30:00-07:00";
const DEFAULT_PUBLIC_BASE = "https://www.thekeyholders.org/celebrate/";

export const DEFAULT_COMINGLE = [
  {
    id: "chad",
    prompt: "Find Chad Cahill and ask him his daughter's name.",
    hint: "One word. Family-friendly spy work.",
    points: 25,
  },
  {
    id: "cupcakes",
    prompt:
      "Find Ronni or Alondra and ask what cupcake flavors are at the dessert station.",
    hint: "Type the flavors you heard (any order is fine).",
    points: 25,
  },
  {
    id: "homelab",
    prompt: "Find Uncle J and ask how many servers are in his homelab.",
    hint: "A number. Nerds will know.",
    points: 25,
  },
];

export const DEFAULT_COMINGLE_ANSWERS: Record<string, string[]> = {
  chad: ["quinn"],
  cupcakes: [
    "chocolate",
    "vanilla",
    "red velvet",
    "lemon",
    "funfetti",
    "strawberry",
  ],
  homelab: ["3", "4", "5", "6", "7", "8", "9", "10", "12", "16"],
};

export const DEFAULT_STATIONS = [
  {
    id: "margarita",
    title: "Margarita Bar",
    riddle: "I'm salty, cold, and plural at this party. What station are you at?",
    selfie: "Selfie with a (full or empty) cup raised like a trophy.",
    points: 20,
  },
  {
    id: "arch",
    title: "Floral Arch",
    riddle:
      "Where blooms frame the couple in all white — what's this photo zone called?",
    selfie: "Selfie at the floral arch (couple optional but encouraged).",
    points: 20,
  },
  {
    id: "dessert",
    title: "Dessert Table",
    riddle: "Cupcakes live here. What table did you find?",
    selfie: "Selfie with dessert energy (no crumbs on the camera).",
    points: 20,
  },
];

export const DEFAULT_STATION_KEYWORDS: Record<string, string[]> = {
  margarita: ["margarita", "bar", "drinks", "sip"],
  arch: ["arch", "floral", "photo", "backdrop"],
  dessert: ["dessert", "cupcake", "sweet"],
};

export const DEFAULT_TRIVIA = {
  id: "trivia",
  title: "Dani & Javad · Party Trivia",
  subtitle:
    "Hunt QR hidden memories for hints. +15 per correct. Family lore included.",
  pointsPerCorrect: 15,
  questions: [
    {
      q: "What is the name of Dani & Javad’s dog?",
      choices: ["Luna", "Pixel", "Taco", "Server"],
      answer: 0,
      explain: "Luna. Aussie / Border Collie energy.",
    },
    {
      q: "Dani’s “soul cat” is named…",
      choices: ["Ollie", "Rue", "Luna", "Pixel"],
      answer: 1,
      explain: "Rue. (Ollie is the chaotic younger cat.) QR pet memory helps.",
    },
    {
      q: "Which trip shows kiss + skyline + “walking on clouds” energy?",
      choices: ["Nashville", "Seattle (Space Needle)", "Disneyland", "Stockton"],
      answer: 1,
      explain: "Seattle. QR travel memory helps.",
    },
    {
      q: "Which hike shows them as a team on the mountain?",
      choices: ["Mt St Helena", "Everest", "Capitol steps only", "The taco line"],
      answer: 0,
      explain: "Mt St Helena. QR hike memory helps.",
    },
    {
      q: "Wine-country homework often means which tasting name?",
      choices: ["Helwig", "Only boxed rosé", "Homelab Cellar", "In-N-Out flight"],
      answer: 0,
      explain: "Helwig. QR wine memory helps.",
    },
    {
      q: "Aquarium glass, big tanks, coast day: where?",
      choices: ["Monterey Bay Aquarium", "Living room tank", "IKEA cafeteria", "The cloud"],
      answer: 0,
      explain: "Monterey. QR aquarium memory helps.",
    },
    {
      q: "Local powerhouse vibes in the photo vault?",
      choices: ["Old Folsom powerhouse", "Mars colony", "Only LA freeways", "Random Costco"],
      answer: 0,
      explain: "Old Folsom. QR local memory helps.",
    },
    {
      q: "Main food energy at THIS engagement party?",
      choices: ["Sushi conveyor only", "Tacos", "Celery cleanse", "Mystery meatloaf"],
      answer: 1,
      explain: "Tacos. Priorities.",
    },
    {
      q: "Where is this party (city)?",
      choices: ["Sacramento", "San Francisco", "The cloud", "Bakersfield"],
      answer: 0,
      explain: "Sacramento.",
    },
    {
      q: "Scoring freezes at what time (Pacific)?",
      choices: ["3:00 PM", "4:30 PM", "Midnight", "Never (chaos mode)"],
      answer: 1,
      explain: "4:30 PM. Winner locks then.",
    },
    {
      q: "What are Dani & Javad wearing so you can spot them today?",
      choices: ["Matching Hawaiian shirts", "All white", "Server-rack camo", "Superhero capes"],
      answer: 1,
      explain: "All white spot-check for the couple.",
    },
    {
      q: "Who said “I love you” first?",
      choices: ["Dani", "Javad", "Luna (via bark)", "Simultaneously, for the plot"],
      answer: 1,
      explain: "Javad. (Host can edit if lore differs.)",
    },
    {
      q: "Which sister of Dani tried hardest to sabotage the engagement party because she couldn’t stand Dani being happier than she’ll ever be?",
      choices: ["Ronni", "Lupe", "Luna the dog", "A random cousin from the taco line"],
      answer: 0,
      explain: "If you know, you know. Be kind in person; savage on the scoreboard.",
    },
    {
      q: "Who demanded a $200 custom gift before appointing herself “lead event planner,” then dumped the work on her partner?",
      choices: ["The maid of honor / self-appointed planner (Ronni)", "Javad’s homelab", "The margarita dispenser", "Chad Cahill"],
      answer: 0,
      explain: "Yes. That one.",
    },
    {
      q: "True: maid of honor / self-appointed planner skipped real invites & venue work, then still wanted more gifts for “hard work”?",
      choices: ["Tragically accurate", "False, she is a certified PMP", "Only the invitation part", "Only the gifts part"],
      answer: 0,
      explain: "Tragically accurate.",
    },
    {
      q: "Which sister might actually believe today is HER engagement party?",
      choices: ["Ronni", "Dani (correct bride energy)", "Ollie the cat", "The florist"],
      answer: 0,
      explain: "Main character syndrome: advanced edition.",
    },
  ],
};

/** QR-only defaults (not linked in guest nav). Host can edit; print pack uses these URLs. */
export const DEFAULT_MEMORIES: HiddenMemory[] = [
  {
    slot: 1,
    title: "Hidden memory 1 · Proposal",
    caption:
      "We locked it in for real. One knee, zero chill. If trivia asks how this story started, start here.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_proposal1.jpg",
    enabled: true,
  },
  {
    slot: 2,
    title: "Hidden memory 2 · Seattle",
    caption:
      "Space Needle skyline. Kiss included. Some trips rewrite your map of “us.”",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_seattle_trip_kiss_space-needle_fav13.jpg",
    enabled: true,
  },
  {
    slot: 3,
    title: "Hidden memory 3 · Rue",
    caption:
      "Soul cat energy. Rue always votes Dani. (Ollie is chaos. Luna is the dog.)",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_pets_rue_dani_fav7.jpg",
    enabled: true,
  },
  {
    slot: 4,
    title: "Hidden memory 4 · Mt St Helena",
    caption: "Legs burned. View paid us back. Mountain day: Mt St Helena.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_mtsainthelena_d&j_fav5.jpg",
    enabled: true,
  },
  {
    slot: 5,
    title: "Hidden memory 5 · Helwig",
    caption:
      "Wine-country homework. The tasting name on the tip of your tongue: Helwig.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_wine_tasting_helwig_fav15.jpg",
    enabled: true,
  },
  {
    slot: 6,
    title: "Hidden memory 6 · Paddle",
    caption:
      "Boards on water. Still land people at heart. Outdoors is a love language.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_adventures_paddle_boards.jpg",
    enabled: true,
  },
  {
    slot: 7,
    title: "Hidden memory 7 · Neon",
    caption: "Neon signs. Crossed pose. Festival world (Dani’s flow-art orbit).",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_crossed_festival_pose_neon_sign_fav12.jpg",
    enabled: true,
  },
  {
    slot: 8,
    title: "Hidden memory 8 · July 4",
    caption: "California summer fireworks. America-themed chaos, couple edition.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_4thofjuly_fav1.jpg",
    enabled: true,
  },
  {
    slot: 9,
    title: "Hidden memory 9 · Monterey",
    caption: "Aquarium glass. Big tanks. Coast day stamped: Monterey Bay.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_monteray_bay_aquarium_fav4.jpg",
    enabled: true,
  },
  {
    slot: 10,
    title: "Hidden memory 10 · Folsom",
    caption: "Old Folsom powerhouse. Local roots. Sacramento-orbit life.",
    imageDataUrl: "",
    imageUrl:
      "https://www.thekeyholders.org/celebrate/assets/photos/web_engagement_app_old_folsom_powerhouse_fav10.jpg",
    enabled: true,
  },
];

export const DEFAULT_HE_SAID = {
  id: "he-said-she-said",
  title: "He Said / She Said",
  subtitle: "Who is more likely? Speed helps a tiny bit.",
  questions: [
    {
      q: "More likely to over-optimize a packing list?",
      choices: ["Dani", "Javad"],
      answer: 1,
    },
    {
      q: "More likely to notice the flowers first?",
      choices: ["Dani", "Javad"],
      answer: 0,
    },
    {
      q: "More likely to say “we should document this”?",
      choices: ["Dani", "Javad"],
      answer: 1,
    },
    {
      q: "More likely to claim the last taco “for balance”?",
      choices: ["Dani", "Javad", "Both, honestly"],
      answer: 2,
    },
    {
      q: "More likely to dance first when the surprise hits?",
      choices: ["Dani", "Javad", "The guests"],
      answer: 0,
    },
    {
      q: "More likely to thank you three times for coming?",
      choices: ["Dani", "Javad", "Both"],
      answer: 2,
    },
  ],
};

export const DEFAULT_POSES = {
  prompts: [
    "Taco cheers — lift your (empty) cup like it’s crystal",
    "Couple sandwich — friends on both sides of Dani & Javad",
    "All-white radar — frame the couple like a fashion ad",
    "Ring hunter pose — detective magnifying glass (fingers OK)",
    "Floral power — point at the brightest outfit in the room",
    "Kids crown energy — flower crown or invisible crown",
    "Nerdy handshake — overcomplicated high-five sequence",
    "Group jump (safe ankles only)",
    "Fake Oscar speech — 3 seconds, then laugh",
    "Symmetry shot — line up by height",
    "Heart hands — classic, we allow one cheese tax",
    "Documentary mode — serious face, silly background",
  ],
};

export function emptyMemories(): HiddenMemory[] {
  return Array.from({ length: 10 }, (_, i) => ({
    slot: i + 1,
    title: `Hidden memory ${i + 1}`,
    caption: "",
    imageDataUrl: "",
    imageUrl: "",
    enabled: false,
  }));
}

export function seedMemories(): HiddenMemory[] {
  return DEFAULT_MEMORIES.map((m) => ({ ...m }));
}

function defaultHost(): HostState {
  return {
    scoringMode: "auto",
    deadlineIso: DEFAULT_DEADLINE,
    publicBaseUrl: DEFAULT_PUBLIC_BASE,
    photosUrl: "https://photos.app.goo.gl/tNy59HYGHJzvhX536",
    prize: {
      enabled: true,
      title: "Gift Card",
      description: "Highest score at 4:30 PM wins. See Javad to claim.",
      announceAt: "4:30 PM",
      legalNote: "One win per person. Must be present. Host decision final.",
    },
    comingle: DEFAULT_COMINGLE,
    comingleAnswers: DEFAULT_COMINGLE_ANSWERS,
    stations: DEFAULT_STATIONS,
    stationKeywords: DEFAULT_STATION_KEYWORDS,
    content: {
      trivia: DEFAULT_TRIVIA,
      heSaid: DEFAULT_HE_SAID,
      poses: DEFAULT_POSES,
    },
    memories: seedMemories(),
  };
}

function store(): Store {
  if (!globalForParty.__djPartyStoreV2) {
    globalForParty.__djPartyStoreV2 = {
      profiles: new Map(),
      scores: [],
      predictions: [],
      wishes: [],
      songs: [],
      advice: [],
      margarita: [],
      host: defaultHost(),
    };
  }
  // migrate older empty host
  const s = globalForParty.__djPartyStoreV2;
  if (!s.host) s.host = defaultHost();
  if (!s.host.content) s.host.content = defaultHost().content;
  if (!s.host.comingle) s.host.comingle = DEFAULT_COMINGLE;
  if (!s.host.publicBaseUrl) s.host.publicBaseUrl = DEFAULT_PUBLIC_BASE;
  if (!s.host.memories || s.host.memories.length !== 10) {
    const existing = s.host.memories || [];
    const base = seedMemories();
    for (const m of existing) {
      if (m && m.slot >= 1 && m.slot <= 10) base[m.slot - 1] = { ...base[m.slot - 1], ...m };
    }
    s.host.memories = base;
  } else {
    // If host has empty slots (fresh instance), fill defaults so QR hunt works without re-entry
    const anyOn = s.host.memories.some((m) => m.enabled && m.caption);
    if (!anyOn) s.host.memories = seedMemories();
  }
  if (!s.host.content?.trivia) {
    if (!s.host.content) s.host.content = {};
    s.host.content.trivia = DEFAULT_TRIVIA;
  }
  return s;
}

export const MAX_PROFILES = 150;

export const BASE_PUBLIC_CONFIG = {
  eventName: "Dani & Javad Engagement Party",
  couple: "Dani & Javad",
  dateLabel: "Saturday, August 8, 2026",
  timeLabel: "1:00 PM – 5:00 PM",
  venue: "Unleashed Event Space",
  venueAddress: "1361 Fulton Ave, Suite 103, Sacramento, CA 95825",
  photosUrl: "https://photos.app.goo.gl/tNy59HYGHJzvhX536",
  maxProfiles: MAX_PROFILES,
  timezone: "America/Los_Angeles",
  prize: {
    enabled: true,
    title: "Gift Card",
    description: "Highest score at 4:30 PM wins. See Javad to claim.",
    announceAt: "4:30 PM",
    legalNote: "One win per person. Must be present. Host decision final.",
  },
  ringHunt: {
    title: "The Great Plastic Ring Hunt",
    blurb:
      "Real plastic wedding rings are hidden around the venue. Find them. Be gentle with decor.",
    rules: [
      "Scan the room carefully.",
      "Be kind to flowers, kids, and other hunters.",
      "When you find a ring, follow the table sign.",
      "Tap “I found a ring!” for points (until freeze).",
    ],
    pointsPerFind: 15,
    maxFindsCounted: 3,
  },
  guestbook: {
    title: "Sign the real guest book",
    location: "Welcome table near the entrance (paper book + pens).",
    blurb: "Ink > pixels for keepsakes. Leave a note, then stamp here too.",
    points: 10,
  },
  schedule: [
    { time: "1:00 PM", what: "Doors · drinks · photos · chaos (friendly)" },
    { time: "1:25 PM", what: "Welcome speech" },
    { time: "1:30 PM", what: "Tacos. Priorities." },
    { time: "2:15 PM", what: "Surprise energy spike" },
    { time: "2:30 PM", what: "Games + phone quests" },
    { time: "4:30 PM", what: "Scoring freezes · winner locked" },
    { time: "4:45 PM", what: "Prize announcement" },
    { time: "5:00 PM", what: "Hugs and graceful exit" },
  ],
  predictions: [
    {
      id: "ceremony_length",
      question: "How long will the wedding ceremony last?",
      options: ["Under 20 minutes", "Over 20 minutes"],
    },
    {
      id: "who_cries",
      question: "Who will cry first during wedding speeches?",
      options: ["Dani", "Javad", "A guest (chaos option)"],
    },
    {
      id: "honeymoon",
      question: "Where will Dani & Javad go for their honeymoon?",
      options: ["Beach / tropical", "Europe", "Staycation / NorCal", "Somewhere secret"],
    },
  ],
  margaritaFlavors: ["Classic Lime", "Strawberry", "Mango", "Spicy"],
  thanks:
    "Thanks for showing up IRL. The Wi-Fi of our hearts is stronger with you here.",
};

export function getStore() {
  return store();
}

export function getHost() {
  return store().host;
}

export function liveConfig() {
  const h = getHost();
  const prize = {
    ...BASE_PUBLIC_CONFIG.prize,
    ...(h.prize || {}),
  };
  // Explicit boolean so "enabled: false" always wins over defaults
  if (h.prize && typeof h.prize.enabled === "boolean") {
    prize.enabled = h.prize.enabled;
  }
  // Strip removed prank field if present
  delete (prize as { hostOnlyRealPrize?: string }).hostOnlyRealPrize;
  return {
    ...BASE_PUBLIC_CONFIG,
    eventName: h.eventName || BASE_PUBLIC_CONFIG.eventName,
    couple: h.couple || BASE_PUBLIC_CONFIG.couple,
    photosUrl: h.photosUrl || BASE_PUBLIC_CONFIG.photosUrl,
    prize,
    comingle: h.comingle || DEFAULT_COMINGLE,
    stations: h.stations || DEFAULT_STATIONS,
    pointsDeadlineIso: h.deadlineIso || DEFAULT_DEADLINE,
    publicBaseUrl: h.publicBaseUrl || DEFAULT_PUBLIC_BASE,
    host: {
      scoringMode: h.scoringMode,
      publicBaseUrl: h.publicBaseUrl || DEFAULT_PUBLIC_BASE,
      updatedAt: h.updatedAt,
    },
  };
}

export function getMemory(slot: number): HiddenMemory | null {
  if (slot < 1 || slot > 10) return null;
  const list = getHost().memories || emptyMemories();
  return list[slot - 1] || null;
}

export function publicMemory(slot: number) {
  const m = getMemory(slot);
  if (!m || !m.enabled || !m.caption) {
    return {
      slot,
      enabled: false,
      title: "",
      caption: "",
      imageDataUrl: "",
      imageUrl: "",
      hasImage: false,
    };
  }
  const imageUrl = (m.imageUrl || "").trim();
  const imageDataUrl = m.imageDataUrl || "";
  return {
    slot: m.slot,
    enabled: true,
    title: m.title || `Hidden memory ${slot}`,
    caption: m.caption,
    // Prefer external URL (stable); fall back to data URL
    imageUrl,
    imageDataUrl: imageUrl ? "" : imageDataUrl,
    hasImage: Boolean(imageUrl || imageDataUrl),
  };
}

export function scoringOpen(): boolean {
  const h = getHost();
  if (h.scoringMode === "open") return true;
  if (h.scoringMode === "frozen") return false;
  try {
    return Date.now() < new Date(h.deadlineIso || DEFAULT_DEADLINE).getTime();
  } catch {
    return true;
  }
}

export function deadlinePayload() {
  const open = scoringOpen();
  const h = getHost();
  return {
    scoringOpen: open,
    scoringMode: h.scoringMode || "auto",
    pointsDeadlineIso: h.deadlineIso || DEFAULT_DEADLINE,
    serverNowIso: new Date().toISOString(),
    message: open
      ? "Points are live. Clock stops at 4:30 PM PT (unless host overrides)."
      : "Scoring is frozen. You can still play for fun; no new points.",
    winner: open ? null : computeWinner(),
  };
}

export function norm(s: string) {
  return s.trim().split(/\s+/).join(" ").toLowerCase();
}

export function displayFor(first: string, last: string) {
  const f = first.trim().split(/\s+/).join(" ");
  const l = last.trim().split(/\s+/).join(" ");
  return `${f} ${l ? l[0] + "." : ""}`.trim();
}

export function recompute(p: PartyProfile) {
  const s = store();
  const best: Record<string, number> = {};
  for (const sc of s.scores.filter((x) => x.profileId === p.id)) {
    best[sc.game] = Math.max(best[sc.game] || 0, sc.score);
  }
  const gamePts = Object.values(best).reduce((a, b) => a + b, 0);
  const cfg = liveConfig();
  const ringPts =
    Math.min(p.ringsFound, cfg.ringHunt.maxFindsCounted) *
    cfg.ringHunt.pointsPerFind;
  const bookPts = p.guestbookSigned ? cfg.guestbook.points : 0;
  const posePts = Math.min(p.posesSpun, 1) * 5;
  p.totalPoints = gamePts + ringPts + bookPts + posePts + (p.passportBonus || 0);
  return p.totalPoints;
}

export function computeWinner() {
  const all = Array.from(store().profiles.values());
  if (!all.length) return null;
  all.forEach((p) => recompute(p));
  all.sort((a, b) => b.totalPoints - a.totalPoints || a.createdAt - b.createdAt);
  const w = all[0];
  return {
    profileId: w.id,
    displayName: w.displayName,
    totalPoints: w.totalPoints,
  };
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

export function answerMatches(answer: string, accepted: string[]) {
  const a = norm(answer);
  return accepted.some((x) => a.includes(norm(x)) || norm(x).includes(a));
}
