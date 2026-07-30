/**
 * CA 9-1-1 Advisor AI — separate from Advisor Desk + Tools Help agent.
 */

import { CONTACTS_ESCALATION_DIGEST } from "./knowledge/contacts-escalation";
import { CONTEXT_2026_DIGEST } from "./knowledge/context-2026";
import { FOR_PLAYBOOK_DIGEST } from "./knowledge/for-playbook";
import { FORMS_CATALOG_DIGEST } from "./knowledge/forms-catalog";
import { FUNDING_PLAYBOOK_DIGEST } from "./knowledge/funding-playbook";
import { ADVISOR_AI_PROMPT_ADDENDA } from "./prompt-addenda";
import {
  ADVISOR_AI_PROMPT_VERSION,
  ADVISOR_AI_SYSTEM_PROMPT_CORE,
} from "./prompt-core";

export { ADVISOR_AI_PROMPT_VERSION, ADVISOR_AI_SYSTEM_PROMPT_CORE };
export { ADVISOR_AI_PROMPT_ADDENDA };

/** Full system prompt: core (immutable intent) + addenda + knowledge digests */
export function composeAdvisorAiSystemPrompt(retrievedContext?: string): string {
  const parts = [
    ADVISOR_AI_SYSTEM_PROMPT_CORE,
    ADVISOR_AI_PROMPT_ADDENDA,
    "\n---\n### KNOWLEDGE DIGESTS (additive Manual anchors)\n",
    FUNDING_PLAYBOOK_DIGEST,
    FORMS_CATALOG_DIGEST,
    FOR_PLAYBOOK_DIGEST,
    CONTACTS_ESCALATION_DIGEST,
    CONTEXT_2026_DIGEST,
  ];
  if (retrievedContext?.trim()) {
    parts.push(
      "\n---\n### Retrieved Manual context\n",
      "Use the following excerpts to ground citations. Prefer them for wording when on-topic.\n\n",
      retrievedContext.trim()
    );
  }
  return parts.join("\n");
}

export const ADVISOR_AI_SYSTEM_PROMPT = composeAdvisorAiSystemPrompt();

export const ADVISOR_AI_STARTERS = [
  "How do I get my CPE Fixed Allotment?",
  "Direct Funding vs Reimbursement Claim — which path and what forms?",
  "Residual funds: what can I buy and what are the 90-day / 12-month rules?",
  "Walk me through Advanced Notification for CPE Funding.",
  "Prepare me for a Fiscal & Operational Review (FOR).",
  "What are mandatory answer-time standards (Chapter I)?",
  "NG9-1-1 GIS data funding — what is eligible?",
  "ATA travel / training — what needs pre-approval?",
  "New PSAP startup criteria checklist.",
  "When must I escalate to a human Advisor or CA911Reimbursements@caloes.ca.gov?",
  "How do I use the other tools on this Advisor Tools hub?",
] as const;

/** Markers that must remain present in the composed prompt (CI / unit tests). */
export const ADVISOR_AI_REQUIRED_MARKERS = [
  "CA 9-1-1 Advisor AI",
  "SETNA",
  "Chapter III",
  "Rev. 10-2025",
  "TD-288",
  "CA911Reimbursements@caloes.ca.gov",
  "916-894-5007",
  "Never invent policy",
  "Fiscal & Operational Review",
  "NG9-1-1",
  "How else can I assist your PSAP today?",
  "SEPARATE product",
] as const;
