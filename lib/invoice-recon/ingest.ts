import type { BatchLine } from "./types";

const TRACKING_RE = /\b(?:PON\s+)?(\d{5,6})(?:-OP)?\b/i;
const AMOUNT_RE = /\$?\s*([\d,]+(?:\.\d{1,2})?)/;
const PSAP_CODE_RE = /\b(\d{4})\b/;
const HEADER_HINTS = ["psap", "tracking", "amount", "notes", "pon"];

function normalizeTracking(text: string): string {
  const m = TRACKING_RE.exec(text || "");
  return m ? m[1] : "";
}

function parseAmount(text: string | undefined | null): number | null {
  if (text == null || !String(text).trim()) return null;
  const s = String(text).replace(/,/g, "");
  const m = AMOUNT_RE.exec(s);
  if (!m) {
    const n = Number(s.replace(/\$/g, "").trim());
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function splitPsap(cell: string): [string, string] {
  const c = (cell || "").trim();
  const m = PSAP_CODE_RE.exec(c);
  const code = m ? m[1] : "";
  let name = c;
  if (code) name = c.replace(new RegExp(`^\\s*${code}\\s*`), "").replace(/^[-–\t ]+/, "").trim();
  return [code, name];
}

function isHeader(parts: string[]): boolean {
  const joined = parts.join(" ").toLowerCase();
  return HEADER_HINTS.some((h) => joined.includes(h)) && (joined.includes("psap") || joined.includes("tracking") || joined.includes("amount"));
}

function rowFromParts(line_no: number, parts: string[], raw: string): BatchLine | null {
  const p = parts.map((x) => x.trim());
  if (!p.some(Boolean)) return null;
  const psapCell = p[0] || "";
  const trackCell = p[1] || "";
  const amountCell = p[2] || "";
  const notes = p.length > 3 ? p.slice(3).join(" ") : "";
  const [code, name] = splitPsap(psapCell);
  const tracking = normalizeTracking(trackCell) || normalizeTracking(`${psapCell} ${notes}`);
  return {
    line_no,
    psap_code: code,
    psap_name: name,
    tracking,
    amount: parseAmount(amountCell),
    notes,
    raw,
  };
}

/** Parse pasted Victoria table (TSV / CSV / multi-space). */
export function parseBatchText(text: string): BatchLine[] {
  const out: BatchLine[] = [];
  let line_no = 0;
  for (const raw of text.split(/\r?\n/)) {
    const raw_stripped = raw.trim();
    if (!raw_stripped) continue;
    let parts: string[];
    if (raw.includes("\t")) {
      parts = raw.split("\t");
    } else if ((raw.match(/,/g) || []).length >= 2) {
      parts = parseCsvLine(raw);
    } else {
      parts = raw_stripped.split(/\s{2,}|\t/);
      if (parts.length < 3) {
        const tokens = raw_stripped.split(/\s+/);
        const track_i = tokens.findIndex((t) => TRACKING_RE.test(t));
        if (track_i > 0) {
          const psap = tokens.slice(0, track_i).join(" ");
          const tracking = tokens[track_i];
          const rest = tokens.slice(track_i + 1);
          parts = [psap, tracking, rest[0] || "", rest.slice(1).join(" ")];
        } else {
          parts = tokens;
        }
      }
    }
    if (isHeader(parts)) continue;
    line_no += 1;
    const row = rowFromParts(line_no, parts, raw_stripped);
    if (row) out.push(row);
  }
  return out;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      result.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  result.push(cur);
  return result;
}

/** Build index from browser File objects (filename-only, no folder scan). */
export function indexFromFilenames(names: string[]): Record<string, { tracking: string; paths: string[]; filenames: string[] }> {
  const NUM = /(\d{5,6})/g;
  const index: Record<string, { tracking: string; paths: string[]; filenames: string[] }> = {};
  for (const name of names) {
    const nums: string[] = [];
    let m: RegExpExecArray | null;
    const re = /(\d{5,6})/g;
    while ((m = re.exec(name)) !== null) nums.push(m[1]);
    for (const t of nums) {
      if (!index[t]) index[t] = { tracking: t, paths: [], filenames: [] };
      if (!index[t].filenames.includes(name)) index[t].filenames.push(name);
      if (!index[t].paths.includes(name)) index[t].paths.push(name);
    }
  }
  return index;
}

/** Load desktop-exported td288_index.json shape. */
export function indexFromJson(data: unknown): Record<string, { tracking: string; paths: string[]; filenames: string[] }> {
  const root = data as { entries?: Record<string, { tracking?: string; paths?: string[]; filenames?: string[] }> };
  const entries = root.entries ?? (data as Record<string, { tracking?: string; paths?: string[]; filenames?: string[] }>);
  const out: Record<string, { tracking: string; paths: string[]; filenames: string[] }> = {};
  for (const [k, v] of Object.entries(entries || {})) {
    if (!v || typeof v !== "object") continue;
    out[k] = {
      tracking: v.tracking || k,
      paths: v.paths || [],
      filenames: v.filenames || [],
    };
  }
  return out;
}
