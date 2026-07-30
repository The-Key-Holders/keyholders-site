import { describe, expect, it } from "vitest";
import {
  ADVISOR_AI_PROMPT_VERSION,
  ADVISOR_AI_REQUIRED_MARKERS,
  ADVISOR_AI_STARTERS,
  composeAdvisorAiSystemPrompt,
} from "./index";
import {
  clearRetrieveCache,
  getCorpusStats,
  retrieveManualContext,
} from "./retrieve";
import { ADVISOR_HELP_PROMPT_VERSION, ADVISOR_HELP_SYSTEM_PROMPT } from "../advisor-help-agent";

describe("CA 9-1-1 Advisor AI prompt pack", () => {
  it("has a version string", () => {
    expect(ADVISOR_AI_PROMPT_VERSION).toMatch(/1\./);
  });

  it("retains all required baseline markers (no simplification)", () => {
    const prompt = composeAdvisorAiSystemPrompt();
    for (const marker of ADVISOR_AI_REQUIRED_MARKERS) {
      expect(prompt, `missing marker: ${marker}`).toContain(marker);
    }
  });

  it("includes funding, FOR, and 2026 digests", () => {
    const prompt = composeAdvisorAiSystemPrompt();
    expect(prompt).toMatch(/CPE Fixed Allotment/i);
    expect(prompt).toMatch(/Fiscal & Operational Review/i);
    expect(prompt).toMatch(/2026/i);
    expect(prompt).toMatch(/CA911Reimbursements@caloes\.ca\.gov/i);
  });

  it("declares separation from Advisor Desk help agent", () => {
    const prompt = composeAdvisorAiSystemPrompt();
    expect(prompt).toMatch(/SEPARATE product/i);
    expect(prompt).toMatch(/help-agent/i);
    expect(prompt).toMatch(/Advisor Desk \+ Tools Help/i);
  });

  it("appends retrieved Manual context when provided", () => {
    const withR = composeAdvisorAiSystemPrompt("Per Chapter III sample excerpt about residual funds.");
    expect(withR).toContain("Retrieved Manual context");
    expect(withR).toContain("residual funds");
  });

  it("exposes starters across duty domains", () => {
    expect(ADVISOR_AI_STARTERS.length).toBeGreaterThanOrEqual(10);
    const joined = ADVISOR_AI_STARTERS.join(" ");
    expect(joined).toMatch(/CPE/i);
    expect(joined).toMatch(/FOR/i);
    expect(joined).toMatch(/Reimbursement/i);
    expect(joined).toMatch(/GIS/i);
  });

  it("retrieves Manual context for CPE allotment queries when corpus present", () => {
    clearRetrieveCache();
    const ctx = retrieveManualContext(
      "How do I calculate CPE Fixed Allotment funding Level Four busy hour Erlangs?",
      3
    );
    // Corpus should be present after markitdown conversion into knowledge/manual-md
    expect(ctx.length).toBeGreaterThan(100);
    expect(ctx.toLowerCase()).toMatch(/chapter|funding|allotment|erlang|cpe|9-1-1/i);
  });

  it("loads CA 9-1-1 Advisor Agent pack into shared retrieval corpus", () => {
    clearRetrieveCache();
    const stats = getCorpusStats();
    expect(stats.chunks).toBeGreaterThan(50);
    expect(stats.roots.some((r) => /extra-md|manual-md/i.test(r))).toBe(true);

    const residual = retrieveManualContext(
      "What are residual funds 90-day quote and 12-month claim rules PB05?",
      4
    );
    expect(residual.length).toBeGreaterThan(100);
    expect(residual.toLowerCase()).toMatch(/residual|90|claim|allotment|pb05|playbook/i);

    const sow = retrieveManualContext(
      "SOW review checklist for CPE package bounce reasons MPA vendor quote",
      4
    );
    expect(sow.length).toBeGreaterThan(80);
  });
});

describe("Advisor Desk + Tools Help multi-audience prompt", () => {
  it("is multi-audience and not new-hire-only", () => {
    expect(ADVISOR_HELP_PROMPT_VERSION).toMatch(/2\./);
    expect(ADVISOR_HELP_SYSTEM_PROMPT).toMatch(/Multi-audience/i);
    expect(ADVISOR_HELP_SYSTEM_PROMPT).toMatch(/Experienced Branch Advisors/i);
    expect(ADVISOR_HELP_SYSTEM_PROMPT).toMatch(/CA_911_Advisor_Agent/i);
    expect(ADVISOR_HELP_SYSTEM_PROMPT).toMatch(/Retrieved Manual \/ knowledge context/i);
    expect(ADVISOR_HELP_SYSTEM_PROMPT).toMatch(/package completeness|residual clocks/i);
  });
});
