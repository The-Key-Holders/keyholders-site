import { mergeEcatsResults, parseCallSummary } from "./ecats-parser";
import { calculateFunding } from "./funding-calculator";
import type { AllotmentRequest, AllotmentResponse, SystemType } from "./types";

export function runAllotment(req: AllotmentRequest): AllotmentResponse {
  try {
    const ecats = mergeEcatsResults(parseCallSummary(req.callSummary, "call_summary.xls"), {
      callsPerHour: req.callsPerHour,
      answerTime: req.answerTime,
      ringTime: req.ringTime,
      classOfService: req.classOfService,
    });

    const psapName = req.psapName || ecats.metadata.psapName || "UNNAMED PSAP";
    const systemType: SystemType = req.systemType ?? "on_premise";
    let duration = req.avgCallDuration ?? 80;
    if (ecats.metadata.avgCallDurationSec > 0 && (req.avgCallDuration ?? 80) === 80) {
      duration = ecats.metadata.avgCallDurationSec;
    }

    const calc = calculateFunding(ecats, systemType, duration);
    const supplementalEcats: Record<string, unknown> = {};
    if (ecats.answerTime) supplementalEcats.answerTime = ecats.answerTime;
    if (ecats.ringTime) supplementalEcats.ringTime = ecats.ringTime;
    if (ecats.classOfService.length) supplementalEcats.classOfService = ecats.classOfService;

    const markdown = [
      `# PSAP Allotment — ${psapName}`,
      "",
      `**Funding Level:** ${calc.fundingLevel}`,
      `**Positions:** ${calc.provisioningPositions}`,
      `**Estimated Allotment:** $${calc.estimatedAllotmentUsd.toLocaleString()}`,
      `**Avg Call Duration:** ${duration}s`,
      "",
      "## Advisor Notes",
      ...calc.notes.map((n) => `- ${n}`),
    ].join("\n");

    return {
      status: "ok",
      psap: psapName,
      fundingLevel: calc.fundingLevel,
      positions: calc.provisioningPositions,
      estimatedAllotmentUsd: calc.estimatedAllotmentUsd,
      avgCallDurationSec: duration,
      calculation: calc,
      supplementalEcats,
      markdown,
    };
  } catch (err) {
    return {
      status: "error",
      psap: req.psapName ?? "",
      fundingLevel: 0,
      positions: 0,
      estimatedAllotmentUsd: 0,
      avgCallDurationSec: 0,
      calculation: {
        fundingLevel: 0,
        basis: "",
        typicalBusyMonthCalls: 0,
        typicalBusyHourCalls: 0,
        avgCallDurationSec: 0,
        erlangs: null,
        provisioningPositions: 0,
        cloudHourlyTier: null,
        estimatedAllotmentUsd: 0,
        notes: [],
      },
      supplementalEcats: {},
      markdown: "",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}