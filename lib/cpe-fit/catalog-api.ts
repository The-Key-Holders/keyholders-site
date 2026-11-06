import { compare_all, estimate, load_catalog, suggest_positions } from "./estimate";
import { parseEstimateInputs, parsePositionMonths } from "./parse-inputs";

const catalog = load_catalog();

export function runEstimate(body: Record<string, unknown>) {
  const { inp, errors } = parseEstimateInputs(body);
  return { result: estimate(inp, catalog), inputs: inp, errors };
}

export function runCompare(body: Record<string, unknown>) {
  const { inp, errors } = parseEstimateInputs(body);
  return { rows: compare_all(inp, catalog), inputs: inp, errors };
}

export function runPositions(body: Record<string, unknown>) {
  const parsed = parsePositionMonths(body);
  if (parsed.error) {
    return { out: null, error: parsed.error };
  }
  return { out: suggest_positions(parsed.calls, parsed.abandoned), error: null };
}
