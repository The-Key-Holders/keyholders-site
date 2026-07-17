/**
 * In-memory overlay over committed sample JSON.
 * Export/Import for durable updates across deploys (no Neon/Blob this sprint).
 */

import type {
  AdvisorRecord,
  NewsItem,
  PortalDataSnapshot,
  QuestionRecord,
  VendorRecord,
} from "./types";
import advisorsSeed from "./data/advisors.sample.json";
import newsSeed from "./data/news.sample.json";
import questionsSeed from "./data/questions.sample.json";
import vendorsSeed from "./data/vendors.sample.json";

type Overlay = Partial<PortalDataSnapshot>;

const g = globalThis as unknown as { __psapPortalOverlay?: Overlay };
function overlay(): Overlay {
  if (!g.__psapPortalOverlay) g.__psapPortalOverlay = {};
  return g.__psapPortalOverlay;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function getAdvisors(): AdvisorRecord[] {
  return clone((overlay().advisors as AdvisorRecord[]) ?? (advisorsSeed as AdvisorRecord[]));
}

export function setAdvisors(rows: AdvisorRecord[]): AdvisorRecord[] {
  overlay().advisors = clone(rows);
  return getAdvisors();
}

export function searchAdvisors(q: string): AdvisorRecord[] {
  const needle = q.trim().toLowerCase();
  const all = getAdvisors();
  if (!needle) return all;
  return all.filter((a) => {
    const hay = [a.name, a.email, a.phone, a.notes ?? "", ...a.counties]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function getVendors(): VendorRecord[] {
  return clone((overlay().vendors as VendorRecord[]) ?? (vendorsSeed as VendorRecord[]));
}

export function setVendors(rows: VendorRecord[]): VendorRecord[] {
  overlay().vendors = clone(rows);
  return getVendors();
}

export function getNews(opts?: { publishedOnly?: boolean }): NewsItem[] {
  const all = clone((overlay().news as NewsItem[]) ?? (newsSeed as NewsItem[]));
  const filtered = opts?.publishedOnly ? all.filter((n) => n.published) : all;
  return filtered.sort((a, b) => b.date.localeCompare(a.date));
}

export function upsertNews(item: NewsItem): NewsItem[] {
  const all = getNews();
  const idx = all.findIndex((n) => n.id === item.id);
  if (idx >= 0) all[idx] = clone(item);
  else all.unshift(clone(item));
  overlay().news = all;
  return getNews();
}

export function deleteNews(id: string): NewsItem[] {
  overlay().news = getNews().filter((n) => n.id !== id);
  return getNews();
}

export function getQuestions(): QuestionRecord[] {
  const all = clone(
    (overlay().questions as QuestionRecord[]) ?? (questionsSeed as QuestionRecord[])
  );
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addQuestion(
  input: Omit<QuestionRecord, "id" | "ticketId" | "status" | "createdAt">
): QuestionRecord {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const ticketId = `Q-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const row: QuestionRecord = {
    ...input,
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ticketId,
    status: "new",
    createdAt: now.toISOString(),
  };
  const all = getQuestions();
  all.unshift(row);
  overlay().questions = all;
  return clone(row);
}

export function updateQuestionStatus(
  id: string,
  status: QuestionRecord["status"]
): QuestionRecord | null {
  const all = getQuestions();
  const idx = all.findIndex((q) => q.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], status };
  overlay().questions = all;
  return clone(all[idx]);
}

export function exportSnapshot(): PortalDataSnapshot {
  return {
    advisors: getAdvisors(),
    vendors: getVendors(),
    news: getNews(),
    questions: getQuestions(),
  };
}

export function importSnapshot(data: PortalDataSnapshot): PortalDataSnapshot {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid snapshot");
  }
  if (Array.isArray(data.advisors)) overlay().advisors = clone(data.advisors);
  if (Array.isArray(data.vendors)) overlay().vendors = clone(data.vendors);
  if (Array.isArray(data.news)) overlay().news = clone(data.news);
  if (Array.isArray(data.questions)) overlay().questions = clone(data.questions);
  return exportSnapshot();
}

/** Test helper — clear memory overlay */
export function resetPortalStoreForTests(): void {
  g.__psapPortalOverlay = {};
}
