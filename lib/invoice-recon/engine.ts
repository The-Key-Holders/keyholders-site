import { parseBatchText, indexFromFilenames, indexFromJson } from "./ingest";
import { reconcile, summarize } from "./match";
import type { ReconcileSummary, Td288Entry } from "./types";
import { parseDate } from "./sla";

export const ENGINE_VERSION = "1.0.0-web";

export function runInvoiceReconcile(input: {
  batchText: string;
  receivedDate: string;
  today?: string;
  td288Filenames?: string[];
  td288IndexJson?: unknown;
  reviewed?: boolean;
}): ReconcileSummary {
  const lines = parseBatchText(input.batchText);
  if (!lines.length) {
    throw new Error("No batch lines parsed. Paste a Victoria-style table with PSAP / Tracking / Amount / Notes.");
  }

  let index: Record<string, Td288Entry> = {};
  if (input.td288IndexJson) {
    index = indexFromJson(input.td288IndexJson) as Record<string, Td288Entry>;
  }
  if (input.td288Filenames?.length) {
    const fromFiles = indexFromFilenames(input.td288Filenames) as Record<string, Td288Entry>;
    for (const [k, v] of Object.entries(fromFiles)) {
      if (!index[k]) index[k] = v;
      else {
        index[k].paths = Array.from(new Set(index[k].paths.concat(v.paths)));
        index[k].filenames = Array.from(new Set(index[k].filenames.concat(v.filenames)));
      }
    }
  }

  const received = parseDate(input.receivedDate);
  const today = input.today ? parseDate(input.today) : undefined;
  const results = reconcile(lines, index, { received, today, reviewed: input.reviewed });
  return summarize(results, {
    received_date: input.receivedDate,
    version: ENGINE_VERSION,
    index_size: Object.keys(index).length,
  });
}
