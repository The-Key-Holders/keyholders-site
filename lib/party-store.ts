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

/** Live Photo Wall item (guest upload or durable stock seed). */
export type WallPhoto = {
  id: string;
  url: string;
  displayName: string;
  caption?: string;
  createdAt: number;
  /** True for built-in stock seeds (not guest uploads). */
  stock?: boolean;
};

type Store = {
  profiles: Map<string, PartyProfile>;
  scores: PartyScore[];
  predictions: Array<{ profileId: string; predictionId: string; option: string }>;
  wishes: Array<{ displayName: string; message: string; createdAt: number }>;
  songs: Array<{ displayName: string; title: string; artist: string; createdAt: number }>;
  advice: Array<{ displayName: string; message: string; createdAt: number }>;
  margarita: Array<{ profileId: string; flavor: string; rating: number }>;
  /** Guest uploads only (stock lives in STOCK_WALL_PHOTOS so cold starts keep seeds). */
  photos: WallPhoto[];
  host: HostState;
};

/** Durable stock wall seeds (static HTTPS paths under /celebrate/assets/photowall/). */
export const STOCK_WALL_PHOTOS: WallPhoto[] = [
  { id: "stock-01", url: "/celebrate/assets/photowall/wall-01.jpg", displayName: "Stock · 34th birthday crew", caption: "Cody, Javad & Nate birthday energy", createdAt: 0, stock: true },
  { id: "stock-02", url: "/celebrate/assets/photowall/wall-02.jpg", displayName: "Stock · Paddle board adventures", caption: "Adventure day on the water", createdAt: 0, stock: true },
  { id: "stock-03", url: "/celebrate/assets/photowall/wall-03.jpg", displayName: "Stock · Javad favorite", caption: "A classic Javad moment", createdAt: 0, stock: true },
  { id: "stock-04", url: "/celebrate/assets/photowall/wall-04.jpg", displayName: "Stock · Maunee birthday", caption: "Dani and cousin Maunee birthday vibes", createdAt: 0, stock: true },
  { id: "stock-05", url: "/celebrate/assets/photowall/wall-05.jpg", displayName: "Stock · Hilary Duff night", caption: "Dani, Roni, Lupe: concert mode", createdAt: 0, stock: true },
  { id: "stock-06", url: "/celebrate/assets/photowall/wall-06.jpg", displayName: "Stock · Disaster Christmas", caption: "Holiday chaos with the pet fam", createdAt: 0, stock: true },
  { id: "stock-07", url: "/celebrate/assets/photowall/wall-07.jpg", displayName: "Stock · Downtown Sac art", caption: "Downtown Sacramento art wander", createdAt: 0, stock: true },
  { id: "stock-08", url: "/celebrate/assets/photowall/wall-08.jpg", displayName: "Stock · Sisters", caption: "Ronni & Dani sister energy", createdAt: 0, stock: true },
  { id: "stock-09", url: "/celebrate/assets/photowall/wall-09.jpg", displayName: "Stock · Family photobomb", caption: "Aunti Cadena, Mom Regina, Javad photobomb", createdAt: 0, stock: true },
  { id: "stock-10", url: "/celebrate/assets/photowall/wall-10.jpg", displayName: "Stock · Dani & Mom", caption: "Dani with Mom Regina", createdAt: 0, stock: true },
  { id: "stock-11", url: "/celebrate/assets/photowall/wall-11.jpg", displayName: "Stock · Ronni & Briauna", caption: "Friends and family hang", createdAt: 0, stock: true },
  { id: "stock-12", url: "/celebrate/assets/photowall/wall-12.jpg", displayName: "Stock · Hilary Duff crew", caption: "Dani, Briauna, Ronni, Chelsea", createdAt: 0, stock: true },
  { id: "stock-13", url: "/celebrate/assets/photowall/wall-13.jpg", displayName: "Stock · Scotty & Briauna", caption: "Friend crew favorites", createdAt: 0, stock: true },
  { id: "stock-14", url: "/celebrate/assets/photowall/wall-14.jpg", displayName: "Stock · Scotty & Briauna 2", caption: "More friend crew favorites", createdAt: 0, stock: true },
  { id: "stock-15", url: "/celebrate/assets/photowall/wall-15.jpg", displayName: "Stock · Line dancing", caption: "Nancy & Justin line dancing night", createdAt: 0, stock: true },
  { id: "stock-16", url: "/celebrate/assets/photowall/wall-16.jpg", displayName: "Stock · Pets & friends", caption: "Briauna and the pets", createdAt: 0, stock: true },
  { id: "stock-17", url: "/celebrate/assets/photowall/wall-17.jpg", displayName: "Stock · Rue & Javad", caption: "Rue the dog and Javad", createdAt: 0, stock: true },
];

export const MAX_GUEST_PHOTOS = 80;
export const MAX_PHOTO_DATA_URL_LEN = 700_000;

/** Guest uploads first (newest), then durable stock seeds. */
export function listWallPhotos(storePhotos: WallPhoto[] | undefined): WallPhoto[] {
  const guest = Array.isArray(storePhotos) ? storePhotos : [];
  return [...guest, ...STOCK_WALL_PHOTOS].slice(0, 120);
}

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
      "Where blooms frame the couple in all white  -  what's this photo zone called?",
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
  title: "Couples & Family Trivia",
  subtitle: "Speed round about Dani & Javad. +15 pts per correct answer.",
  pointsPerCorrect: 15,
  questions: [
    {
      q: "Who made the first move?",
      choices: ["Dani", "Javad", "Mutual escalation", "Destiny + strong Wi-Fi"],
      answer: 1,
      explain: "Flip the official answer in Host desk if lore differs.",
    },
    {
      q: "Who asked the other out?",
      choices: ["Dani", "Javad", "A group chat forced it", "Still debating in committee"],
      answer: 1,
      explain: "Host: set the real story if needed.",
    },
    {
      q: 'Who said "I love you" first?',
      choices: ["Dani", "Javad", "Luna (via bark)", "Simultaneously, for the plot"],
      answer: 1,
      explain: "Canonical couple lore (edit on Host desk if wrong).",
    },
    {
      q: "Who knew first that marriage was going to happen?",
      choices: ["Dani", "Javad", "Both at the same time", "The dog knew first"],
      answer: 0,
      explain: "Soft lore. Host can re-point the truth.",
    },
    {
      q: "What is the name of Javad & Dani's dog?",
      choices: ["Luna", "Pixel", "Taco", "Server"],
      answer: 0,
      explain: "Luna. Correct. Good human.",
    },
    {
      q: "Who is the better cook (according to household law)?",
      choices: ["Dani", "Javad", "Takeout is the third partner", "Whoever didn't burn dinner"],
      answer: 0,
      explain: "Official household law until overruled by Host desk.",
    },
    {
      q: "Who is more sentimental about old photos and texts?",
      choices: ["Dani", "Javad", "The cloud storage bill", "Both, full softies"],
      answer: 0,
      explain: "Sentimentality points go here unless Host flips it.",
    },
    {
      q: "Who planned more of the adventurous trips?",
      choices: ["Dani", "Javad", "The group chat", "Google Maps (solo hero)"],
      answer: 1,
      explain: "Outdoorsy couple energy.",
    },
    {
      q: "Who has the bigger celebrity-crush energy?",
      choices: ["Dani", "Javad", "Both equally unhinged", "We don't talk about that"],
      answer: 0,
      explain: "Light roast. Host may reassign the unhinged party.",
    },
    {
      q: "Who is more excited for the wedding day?",
      choices: ["Dani", "Javad", "The guests (chaos option)", "Equal-volume screaming"],
      answer: 3,
      explain: "Equal hype unless Host declares a winner.",
    },
    {
      q:
        "Which of Dani's sisters is so self-centered, petty, and egotistical that the ENTIRE wedding party had to keep reminding her: today is Dani's engagement party (not hers), maid of honor is not a paid position, she may not be the center of attention, and she should focus on supporting her only sister Dani on one of the most important days of her life?",
      choices: [
        "Ronni",
        "Alondra",
        "Both (a full production)",
        "We plead the fifth (coward option)",
      ],
      answer: 0,
      explain:
        "Confirm the correct sister in Host desk if needed. Roast level: intentional.",
    },
    {
      q: "What are Dani & Javad wearing so you can spot them instantly?",
      choices: ["Matching Hawaiian shirts", "All white", "Server-rack camo", "Superhero capes"],
      answer: 1,
      explain: "All white. Bright florals for everyone else.",
    },
    {
      q: "Where is this party (city)?",
      choices: ["Sacramento", "San Francisco", "The cloud", "Stockton"],
      answer: 0,
      explain: "Sacramento. Farm-to-fork and freeways.",
    },
    {
      q: "Main food energy today?",
      choices: ["Sushi conveyor", "Tacos", "Only celery", "Mystery meatloaf"],
      answer: 1,
      explain: "Tacos. Priorities.",
    },
    {
      q: "Scoring freezes at what time?",
      choices: ["3:00 PM", "4:30 PM", "Midnight", "Never (chaos mode)"],
      answer: 1,
      explain: "4:30 PM Pacific. Winner locks then.",
    },
  ],
};

export const DEFAULT_HE_SAID = {
  id: "he-said-she-said",
  title: "He Said / She Said",
  subtitle: "Who is more likely? Speed helps a tiny bit.",
  questions: [
    {
      q: "Who is more dramatic?",
      choices: ["Dani", "Javad", "Both, honestly"],
      answer: 0,
    },
    {
      q: "Who is more likely to get hangry first?",
      choices: ["Dani", "Javad", "Both (dangerous)"],
      answer: 0,
    },
    {
      q: "Who is more likely to steal food off the other person's plate?",
      choices: ["Dani", "Javad", "A coordinated joint operation"],
      answer: 2,
    },
    {
      q: 'Who says "I\'m fine" when they are definitely not fine?',
      choices: ["Dani", "Javad", "Both, Olympic level"],
      answer: 0,
    },
    {
      q: "Who is more likely to start an argument over something ridiculous?",
      choices: ["Dani", "Javad", "Both, for sport"],
      answer: 2,
    },
    {
      q: "Who is more stubborn?",
      choices: ["Dani", "Javad", "Dead heat"],
      answer: 2,
    },
    {
      q: "Who is more likely to steal the blankets?",
      choices: ["Dani", "Javad", "The pets (true winners)"],
      answer: 0,
    },
    {
      q: "Who is more likely to hit snooze until the alarm gives up?",
      choices: ["Dani", "Javad", "Both, separate alarms"],
      answer: 1,
    },
    {
      q: 'Who is more likely to say "we should clean" and then not clean?',
      choices: ["Dani", "Javad", "Both, then order tacos"],
      answer: 2,
    },
    {
      q: 'Who is more likely to say "it\'s not that far" on a hike when it absolutely is?',
      choices: ["Dani", "Javad", "Both, lying with confidence"],
      answer: 1,
    },
    {
      q: "Who is more likely to spoil the pets rotten?",
      choices: ["Dani", "Javad", "Both (pets win)"],
      answer: 2,
    },
    {
      q: "Who is the pets' favorite human (according to the pets)?",
      choices: ["Dani", "Javad", "Whoever has treats"],
      answer: 2,
    },
  ],
};

export const DEFAULT_POSES = {
  prompts: [
    "Taco cheers  -  lift your (empty) cup like it's crystal",
    "Couple sandwich  -  friends on both sides of Dani & Javad",
    "All-white radar  -  frame the couple like a fashion ad",
    "Ring hunter pose  -  detective magnifying glass (fingers OK)",
    "Floral power  -  point at the brightest outfit in the room",
    "Kids crown energy  -  flower crown or invisible crown",
    "Nerdy handshake  -  overcomplicated high-five sequence",
    "Group jump (safe ankles only)",
    "Fake Oscar speech  -  3 seconds, then laugh",
    "Symmetry shot  -  line up by height",
    "Heart hands  -  classic, we allow one cheese tax",
    "Documentary mode  -  serious face, silly background",
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
    memories: emptyMemories(),
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
      photos: [],
      host: defaultHost(),
    };
  }
  // migrate older empty host
  const s = globalForParty.__djPartyStoreV2;
  if (!s.host) s.host = defaultHost();
  if (!s.host.content) s.host.content = defaultHost().content;
  if (!s.host.comingle) s.host.comingle = DEFAULT_COMINGLE;
  if (!s.host.publicBaseUrl) s.host.publicBaseUrl = DEFAULT_PUBLIC_BASE;
  if (!Array.isArray(s.photos)) s.photos = [];
  if (!s.host.memories || s.host.memories.length !== 10) {
    const existing = s.host.memories || [];
    const base = emptyMemories();
    for (const m of existing) {
      if (m && m.slot >= 1 && m.slot <= 10) base[m.slot - 1] = { ...base[m.slot - 1], ...m };
    }
    s.host.memories = base;
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
      'Tap "I found a ring!" for points (until freeze).',
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
