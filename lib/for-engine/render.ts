import { suggestFiveYearEstimate } from "./defaults";
import {
  dataTable,
  escapeHtml,
  letterhead,
  networkTable,
  psapHeader,
  wrapHtmlDocument,
} from "./html-shell";
import type { ForPackage, RenderedSection, SectionId } from "./types";

function money(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "[amount TBD]";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function num(n: number | null | undefined, fallback = "[TBD]"): string {
  if (n == null || Number.isNaN(n)) return fallback;
  return String(n);
}

function is24x7Text(v: ForPackage["ops"]["is24x7"]): string {
  switch (v) {
    case "yes":
      return "is answering 9-1-1 calls around the clock.";
    case "no_grandfathered":
      return "is not answering 9-1-1 calls 24/7, but it was assured of CA 9-1-1 Branch funding prior to the establishment of this standard.";
    case "no_plan":
      return "is not answering 9-1-1 calls 24/7 and a plan is being developed to answer 9-1-1 calls on a 24/7 basis.";
    case "no_funding_risk":
      return "is not answering 9-1-1 calls 24/7 and the PSAP management has been advised that funding from the CA 9-1-1 Branch will cease unless the PSAP is willing to accept 9-1-1 calls on a 24/7 basis.";
    default:
      return "24/7 posture requires confirmation during the FOR meeting.";
  }
}

function text911Text(v: ForPackage["ops"]["textTo911"]): string {
  switch (v) {
    case "ott":
      return "This PSAP is currently using an Over-the-Top (OTT) text-to-911 solution and should have personnel logged in 24/7 and available to receive and respond to text-to-911 messages.";
    case "integrated":
      return "This PSAP has text-to-911 integrated into the CPE solution and should have personnel logged into a terminal capable of receiving and responding to text-to-911 messages.";
    default:
      return "Text-to-911 deployment posture (OTT vs CPE-integrated) should be confirmed during the FOR meeting. Per California Government Code section 53112(d), each PSAP shall deploy text-to-911 capability.";
  }
}

function networkRowsFromPkg(pkg: ForPackage): { telco: string; description: string }[] {
  const n = pkg.network;
  const rows: { telco: string; description: string }[] = [];
  if (n.trunks911 != null) {
    rows.push({
      telco: "TBD",
      description: `(${n.trunks911}) 9-1-1 trunks / CAMA or IP trunks (verify selective router split at meeting)`,
    });
  }
  if (n.alternateAnswer != null) {
    rows.push({
      telco: "TBD",
      description: `(${n.alternateAnswer}) Alternate answer line(s)${
        n.alternateAnswerPsap ? ` — alternate answer PSAP: ${n.alternateAnswerPsap}` : ""
      }`,
    });
  }
  if (n.totalLines != null) {
    rows.push({
      telco: "—",
      description: `TOTAL COUNT entered: ${n.totalLines} telephone lines (reconcile to telco customer record)`,
    });
  }
  if (n.notes.trim()) {
    rows.push({ telco: "Notes", description: n.notes.trim() });
  }
  return rows;
}

function section(
  id: SectionId,
  title: string,
  filename: string,
  markdown: string,
  bodyHtml: string,
  pkg: ForPackage
): RenderedSection {
  const html = wrapHtmlDocument({
    title: `${title} — ${pkg.cover.psapName || "FOR Draft"}`,
    metaLine: `Draft FOR section · Engine ${pkg.meta.version} · ${pkg.meta.generatedAt} · Decision support only — not an official Branch system of record`,
    bodyHtml,
  });
  return { id, title, filename, markdown, html };
}

export function renderCover(pkg: ForPackage): RenderedSection {
  const c = pkg.cover;
  const md = `# Cover Page

# FISCAL AND OPERATIONAL REVIEW

**${c.psapName || "[PSAP Name]"}**  
**${c.forDate || "[Date]"}**

Prepared for: ${c.managerName || "[Manager]"}  
${c.address || "[Address]"}  
${c.phone || "[Phone]"}

Prepared by: ${c.advisorName || "[Advisor]"}  
911 Advisor, Advisory & Compliance Unit  
${c.advisorPhone || "[Advisor phone]"}
`;

  const body = `
${letterhead()}
<div class="seal-row" aria-hidden="true">
  <div class="seal">CA<br/>SEAL<small>placeholder</small></div>
  <div class="seal">Cal OES<br/>9-1-1<small>letterhead</small></div>
</div>
${psapHeader(c.psapName, c.forDate)}
<div class="prepared">
  <p><span class="label">Prepared for:</span><br/>
  ${escapeHtml(c.managerName || "[PSAP Manager]")}<br/>
  ${escapeHtml(c.address || "[Address]")}<br/>
  ${escapeHtml(c.phone || "[Phone]")}</p>
  <p><span class="label">Prepared by:</span><br/>
  ${escapeHtml(c.advisorName || "[Advisor Name]")}<br/>
  911 Advisor, Advisory &amp; Compliance Unit<br/>
  ${escapeHtml(c.advisorPhone || "[Advisor Phone]")}</p>
</div>
<p class="footnote">Layout mirrors Branch cover packages (e.g. Roseville PD FOR): letterhead, seal/logo area, PSAP name/date, prepared-for / prepared-by. Replace seal placeholders with official artwork in a later DOCX export if required.</p>
`;
  return section("cover", "Cover Page", "00_Cover_Page.html", md, body, pkg);
}

export function renderSectionI(pkg: ForPackage): RenderedSection {
  const f = pkg.fiscal;
  const five = suggestFiveYearEstimate(pkg);
  const md = `# Section I — Fiscal Review

**${pkg.cover.psapName}** · **${pkg.cover.forDate}**

CPE / last upgrade: ${money(f.cpeOnlyCost)}  
ATA level: ${f.ataLevel || "[TBD]"} · ATA balance: ${money(f.ataBalance)}  
Ongoing ops: ${money(f.ongoingOpsCost)}  
Reimbursements: ${money(f.reimbursementsPastFy)}  
Foreign language: ${money(f.foreignLanguageCost)}  
Five-year estimate: ${money(five)}
`;

  const body = `
${letterhead("Section I — Fiscal Review")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>The following Fiscal and Operational Review (FOR) provides the Public Safety Answering Point (PSAP) with summary information about the California 9-1-1 Emergency Communications Branch (CA 9-1-1 Branch) funding that has been provided. The specific categories are described below.</p>

<h2>Customer Premise Equipment (CPE) Replacement/Upgrade and Maintenance Costs</h2>
<p>This information summarizes the total expenses reimbursed for the last replacement or upgrade of the CPE at the PSAP, including residual spending (if applicable) and the costs associated with maintenance for that system.</p>
${dataTable([["CPE / last upgrade (CPE-only cost entered)", money(f.cpeOnlyCost)]])}

<h2>Annual Training Allotment (ATA) Reimbursements</h2>
<p>The CA 9-1-1 Branch allots a specific dollar amount to each PSAP to cover expenses for specifically defined 9-1-1 related training held within the State of California within that fiscal year. The amount of the allotment is based on the call volume of the PSAP which then determines the funding level. The figures below reflect the funding level and balance remaining for the current State fiscal year (July – June).</p>
${dataTable([
  ["ATA funding level", f.ataLevel || "[TBD]"],
  ["ATA balance remaining (current FY)", money(f.ataBalance)],
])}

<h2>Estimated Recurring Costs Paid by the CA 9-1-1 Branch</h2>
<p>The figures presented represent costs paid by the CA 9-1-1 Branch on an ongoing basis for continuing service. In some cases they are estimates based on call volume; in other cases they are specific costs.</p>
${dataTable([
  ["Ongoing operations (past FY / recurring estimate)", money(f.ongoingOpsCost)],
  ["Authorized reimbursements (excl. ATA/CPE where separated)", money(f.reimbursementsPastFy)],
  ["Foreign language emergency interpretation", money(f.foreignLanguageCost)],
  ["MIS / ECaTS note", f.misCostNote || "[see Branch guidance]"],
  ["Approximate five-year estimate", money(five)],
])}
${f.fiscalNotes ? `<h2>Notes</h2><p>${escapeHtml(f.fiscalNotes)}</p>` : ""}
<p class="footnote">Include Summary worksheet figures and Foreign Language report when available (Roseville package pattern: Fiscal Worksheet + Cyracom/Voiance report as attachments).</p>
`;
  return section(
    "section_i",
    "Section I — Fiscal Review",
    "01_Section_I_Fiscal_Review.html",
    md,
    body,
    pkg
  );
}

export function renderSectionII(pkg: ForPackage): RenderedSection {
  const n = pkg.network;
  const rows = networkRowsFromPkg(pkg);
  const md = `# Section II — Network Review

Total lines: ${num(n.totalLines)} · 9-1-1 trunks: ${num(n.trunks911)} · Alternate answer: ${num(n.alternateAnswer)}
`;

  const body = `
${letterhead("Section II — Network Review")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>Each month the CA 9-1-1 Branch pays the telephone companies for the network service costs associated with the 9-1-1 program. These costs include network services such as Automatic Location Identification (ALI) database and circuits to support ALI retrieval, dial backup lines for ALI re-bids, CAMA trunks, alternate answer lines, and other miscellaneous network related costs.</p>
<p>Since these costs make up a significant portion of expenses paid by the CA 9-1-1 Branch each year, it is important to review the information below to verify that all of these services are indeed provided to the PSAP and that they are required. A thorough review ensures the Branch is paying only for services that are required and in fact provided.</p>
<p>According to billing records entered for this draft, the CA 9-1-1 Branch is paying for <strong>${escapeHtml(num(n.totalLines))}</strong> total telephone lines for ${escapeHtml(pkg.cover.psapName || "[PSAP]")}, including <strong>${escapeHtml(num(n.trunks911))}</strong> 9-1-1 trunks and <strong>${escapeHtml(num(n.alternateAnswer))}</strong> alternate answer line(s)${n.alternateAnswerPsap ? ` (alternate answer PSAP: ${escapeHtml(n.alternateAnswerPsap)})` : ""}. These network services will be verified during the FOR meeting.</p>
${networkTable(rows)}
<p class="footnote">Roseville PD FOR example uses a Telco / Description table (e.g. AT trunks by selective router, ALI ports, alternate answer in/out). Replace TBD telco rows after the network customer record PDF is reviewed.</p>
`;
  return section(
    "section_ii",
    "Section II — Network Review",
    "02_Section_II_Network_Review.html",
    md,
    body,
    pkg
  );
}

export function renderSectionIII(pkg: ForPackage): RenderedSection {
  const c = pkg.cpe;
  const md = `# Section III — CPE and Maintenance

Vendor: ${c.vendor || "[TBD]"} · Type: ${c.systemType || "[TBD]"} · TD-288: ${c.td288Tracking || "[TBD]"}
`;

  const body = `
${letterhead("Section III — CPE and Maintenance Review")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>The California 9-1-1 Emergency Communications Branch reimburses Public Safety Answering Points (PSAPs) for expenses associated with upgrading or replacing the telephone equipment required to answer 9-1-1 calls (Customer Premise Equipment / CPE) and the maintenance expenses required to keep that equipment functioning properly. The CPE funding process is described in Chapter III of the CA 9-1-1 Operations Manual.</p>
<p>The specific equipment funded by the CA 9-1-1 Branch will be verified during the FOR meeting with the PSAP to ensure the CPE vendor has provided all equipment funded and included on the maintenance agreement.</p>
${dataTable([
  ["Vendor", c.vendor || "[TBD]"],
  ["Manufacturer / system type", c.systemType || "[TBD]"],
  ["# of state-funded positions", num(c.stateFundedPositions)],
  ["State MPA contract number", c.mpaContract || "[TBD]"],
  ["TD-288 tracking", c.td288Tracking || "[TBD]"],
  ["TD-288 approval date", c.td288ApprovalDate || "[TBD]"],
  ["System acceptance date", c.systemAcceptance || "[TBD]"],
  ["Expiration of 5-year maintenance", c.maint5yrExpiration || "[TBD]"],
])}
<p><em>Note: Advance Funding Notification is typically required 1 year prior to the maintenance expiration date. Extended maintenance is often pre-approved for two additional 1-year extensions (confirm current Branch policy).</em></p>
${c.issues ? `<h2>Issues of particular interest</h2><p>${escapeHtml(c.issues)}</p>` : ""}
<p class="footnote">Attach TD-288 procurement docs as in completed packages (Roseville: Section III narrative + supporting exhibits).</p>
`;
  return section(
    "section_iii",
    "Section III — CPE and Maintenance",
    "03_Section_III_CPE_and_Maintenance.html",
    md,
    body,
    pkg
  );
}

export function renderSectionIV(pkg: ForPackage): RenderedSection {
  const o = pkg.ops;
  const asa = o.pctAnswered15s;
  const substandardHtml =
    asa != null && asa < 90
      ? `<p><strong>The fact that the ASA is substandard is of significant concern and this issue will be discussed further during the Fiscal and Operational Review (FOR) meeting.</strong></p>`
      : "";

  const md = `# Section IV — Operational Performance

ASA: ${asa != null ? `${asa}%` : "___%"} within 15 seconds · Avg calls/mo: ${num(o.avgCallsPerMonth)}
${asa != null && asa < 90 ? "\nASA is substandard (<90% within 15s) — discuss further at FOR meeting.\n" : ""}
`;

  const body = `
${letterhead("Section IV — Operational Performance")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>The Operational Performance section provides a review of the various performance areas of the Public Safety Answering Point (PSAP).</p>

<h2>Speed of Answer</h2>
<p>The current standard for answering calls in California (as stated in Chapter I of the CA 9-1-1 Operations Manual) is that <strong>90% of the 9-1-1 calls should be answered within 15 seconds</strong>. According to the Emergency Call Tracking System (ECaTS) data available to the CA 9-1-1 Branch, this PSAP answered an average of <strong>${asa != null ? escapeHtml(`${asa}%`) : "___%"}</strong> of the 9-1-1 calls within 15 seconds over the past <strong>${escapeHtml(num(o.monthsSampled, "12"))}</strong> months.</p>
${substandardHtml}
<p>This agency has answered an average of <strong>${escapeHtml(num(o.avgCallsPerMonth, "[XXX]"))}</strong> 9-1-1 calls per month over the sample period.</p>
${dataTable([
  ["% answered within 15 seconds", asa != null ? `${asa}%` : "[TBD]"],
  ["Months sampled", num(o.monthsSampled)],
  ["Average 9-1-1 calls per month", num(o.avgCallsPerMonth)],
])}

<h2>24/7 Operation</h2>
<p>The current standard for PSAPs funded by the CA 9-1-1 Branch is that they must answer 9-1-1 calls 24 hours a day, 7 days a week. The ECaTS / operational posture indicates that this PSAP ${escapeHtml(is24x7Text(o.is24x7))}</p>

<h2>Master Street Address Guide (MSAG) Update Process</h2>
<p>The CA 9-1-1 Branch is interested in understanding the process utilized by this agency when an inaccuracy is identified in the MSAG database and how that information is communicated to the 9-1-1 County Coordinator for correction. Examples include “No Records Found”, misroutes, ANI/ALI discrepancies. Provide call type and screen prints when escalating.</p>
${dataTable([
  ["County Coordinator name", o.countyCoordinatorName || "[TBD]"],
  ["Phone", o.countyCoordinatorPhone || "[TBD]"],
  ["Email", o.countyCoordinatorEmail || "[TBD]"],
])}

<h2>Text to 9-1-1</h2>
<p>${escapeHtml(text911Text(o.textTo911))}</p>
<p>Please verify that the PSAP has been logging in and receiving/sending text-to-911 messages. If personnel are not regularly logging into the Text-to-911 platform as required, the PSAP may be out of compliance.</p>

<h2>Teletypewriter (TTY) Capability</h2>
<p>According to current NENA operational standards, PSAP answering equipment should accept TTY calls and call-takers should be trained. Standards: <a href="https://www.nena.org/page/standards">https://www.nena.org/page/standards</a></p>
${o.ttyNotes ? `<p><strong>Site notes:</strong> ${escapeHtml(o.ttyNotes)}</p>` : ""}

<h2>Management Information System (MIS / ECaTS)</h2>
<p>The CA 9-1-1 Branch contracts for MIS (ECaTS) to monitor call activity. Portal: <a href="https://ca.ecats911.com/">https://ca.ecats911.com/</a><br/>
Help Desk: (888) 725-8099 · support@ecats911.com</p>
${o.opsNotes ? `<h2>Additional operational notes</h2><p>${escapeHtml(o.opsNotes)}</p>` : ""}
<p class="footnote">Roseville package attaches eCaTS exports (Answer Time, Call Summary, Calls Per Hour, etc.) as supporting evidence under an eCaTS Reports folder.</p>
`;
  return section(
    "section_iv",
    "Section IV — Operational Performance",
    "04_Section_IV_Operational_Performance.html",
    md,
    body,
    pkg
  );
}

export function renderSectionV(pkg: ForPackage): RenderedSection {
  const n = pkg.ng;
  const md = `# Section V — NG 9-1-1 and Cloud CPE

PNSP: ${n.pnspConnected} · RNSP: ${n.rnspConnected} · Cloud CPE: ${n.cloudCpeDiscussed}
`;

  const body = `
${letterhead("Section V — Next Generation 9-1-1 and Cloud-based CPE")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>Next Generation 9-1-1 (NG 9-1-1) allows for quicker delivery and more accurate routing of 9-1-1 calls, and provides better resiliency and redundancy. NG 9-1-1 equipment is to be installed in all PSAPs within the State of California, enabling transition from legacy CAMA trunks to NENA i3-compliant IP-based call delivery.</p>
<p>Each PSAP will have redundant connections to the Prime Network Service Provider (PNSP) as well as the Regional Network Service Provider (RNSP) — the Next Gen Core Service (NGCS) providers that deliver 9-1-1 calls in the NG environment.</p>
<p>Cloud-based Call Processing Equipment (CPE) is NENA i3 compliant and approved for California PSAPs. Benefits include reduced backroom footprint, integrated text-to-911, mapping integration, and reduced onsite repair presence.</p>
${dataTable([
  ["PNSP connectivity discussed", n.pnspConnected ? "Yes" : "Pending / No"],
  ["RNSP connectivity discussed", n.rnspConnected ? "Yes" : "Pending / No"],
  ["Cloud CPE options discussed", n.cloudCpeDiscussed ? "Yes" : "Pending / No"],
])}
${n.notes ? `<h2>Site-specific notes</h2><p>${escapeHtml(n.notes)}</p>` : ""}
<p class="footnote">Completed packages often attach an NG diagram PDF (see Roseville FOR NG diagram.pdf).</p>
`;
  return section(
    "section_v",
    "Section V — NG 9-1-1 and Cloud CPE",
    "05_Section_V_NG911_and_Cloud_CPE.html",
    md,
    body,
    pkg
  );
}

export function renderSectionVI(pkg: ForPackage): RenderedSection {
  const md = `# Section VI — References

Extra links:\n${pkg.references.extraLinks || "(none)"}
`;

  const body = `
${letterhead("Section VI — References")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>The Reference section provides web links for additional information regarding 9-1-1 standards, CA 9-1-1 Branch contact information, the CA 9-1-1 Branch Operations Manual, contracts, the 9-1-1 Advisory Board, and other 9-1-1 related organizations. The Advisor will review the list with the PSAP.</p>
<ul>
  <li>CA 9-1-1 Operations Manual (Branch website / published chapters)</li>
  <li>NENA standards: <a href="https://www.nena.org/page/standards">https://www.nena.org/page/standards</a></li>
  <li>ECaTS portal: <a href="https://ca.ecats911.com/">https://ca.ecats911.com/</a></li>
  <li>California Government Code §§ 53100–53120 (SETNA / emergency telephone systems framework)</li>
  <li>Text-to-911: Government Code § 53112(d)</li>
  <li>NENA: <a href="https://www.nena.org/">https://www.nena.org/</a></li>
  <li>APCO: <a href="https://www.apcointl.org/">https://www.apcointl.org/</a></li>
</ul>
${
  pkg.references.extraLinks
    ? `<h2>Additional links / contacts</h2><pre style="white-space:pre-wrap;font-family:inherit;border:1px solid #ccc;padding:0.5rem;">${escapeHtml(pkg.references.extraLinks)}</pre>`
    : ""
}
`;
  return section(
    "section_vi",
    "Section VI — References",
    "06_Section_VI_References.html",
    md,
    body,
    pkg
  );
}

export function renderSummary(pkg: ForPackage): RenderedSection {
  const five = suggestFiveYearEstimate(pkg);
  const asa = pkg.ops.pctAnswered15s;
  const md = `# FOR Summary

${pkg.cover.psapName} · ${pkg.cover.forDate}
CPE ${money(pkg.fiscal.cpeOnlyCost)} · Ongoing ${money(pkg.fiscal.ongoingOpsCost)} · 5yr ${money(five)}
ASA ${asa != null ? `${asa}%` : "XX%"}
`;

  const body = `
${letterhead("Summary")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<p>The California Government Code Sections 53100–53120 authorize the California 9-1-1 Emergency Communications Branch (CA 9-1-1 Branch) to oversee disbursement of funds collected from the State Emergency Telephone Number Account (SETNA) and to oversee the 9-1-1 system for the State of California. Included in Government Code Section 53114.2 is the CA 9-1-1 Branch’s obligation to publish, review, and update technical and operational standards for public agency systems on an ongoing basis. Further, the CA 9-1-1 Branch is to monitor emergency telephone systems to ensure they comply with minimal operational and technical standards as described in Government Code Section 53115e. Therefore, the CA 9-1-1 Branch is providing this review of fiscal and operational policies for the benefit of the Public Safety Answering Point (PSAP) and the State of California.</p>
<p>This review includes a summary of the funding provided by the CA 9-1-1 Branch for the PSAP’s last upgrade and funding provided on a continuing basis for operations and other authorized activities. Additionally, this review addresses performance requirements, CA 9-1-1 Branch funded equipment deployments, and industry standards.</p>
<p><strong>This Summary provides the PSAP with an overview of the intent and scope of the Fiscal and Operational Review (FOR).</strong></p>

<h2>Section I — Fiscal Review</h2>
<p>The CA 9-1-1 Branch provided <strong>${escapeHtml(money(pkg.fiscal.cpeOnlyCost))}</strong> for the last upgrade at ${escapeHtml(pkg.cover.psapName || "[PSAP]")} in addition to approximately <strong>${escapeHtml(money(pkg.fiscal.ongoingOpsCost))}</strong> for ongoing operations during the past fiscal year. The CA 9-1-1 Branch anticipates providing approximately <strong>${escapeHtml(money(five))}</strong> over five years for 9-1-1 service at ${escapeHtml(pkg.cover.psapName || "[PSAP]")}.</p>

<h2>Section II — Network Review</h2>
<p>According to billing records entered for this draft, the CA 9-1-1 Branch is paying for <strong>${escapeHtml(num(pkg.network.totalLines))}</strong> total telephone lines, including <strong>${escapeHtml(num(pkg.network.trunks911))}</strong> 9-1-1 trunks and <strong>${escapeHtml(num(pkg.network.alternateAnswer))}</strong> alternate answer line(s). These services will be verified during the FOR meeting.</p>

<h2>Section III — Customer Premise Equipment (CPE)</h2>
<p>CPE vendor <strong>${escapeHtml(pkg.cpe.vendor || "[TBD]")}</strong>, system <strong>${escapeHtml(pkg.cpe.systemType || "[TBD]")}</strong>, TD-288 <strong>${escapeHtml(pkg.cpe.td288Tracking || "[TBD]")}</strong>. ${pkg.cpe.issues ? escapeHtml(`Discussion focus: ${pkg.cpe.issues}`) : "Equipment list and maintenance will be reviewed with the PSAP Manager."}</p>

<h2>Section IV — Operational Performance</h2>
<p>According to ECaTS data entered for this draft, <strong>${asa != null ? escapeHtml(`${asa}%`) : "XX%"}</strong> of 9-1-1 calls are answered within 15 seconds at ${escapeHtml(pkg.cover.psapName || "[PSAP]")}. The CA 9-1-1 Branch standard is <strong>90% of 9-1-1 calls answered within 15 seconds</strong>.</p>
<p>Per California Government Code section 53112(d), each PSAP shall deploy text-to-911 service capable of accepting SMS and RTT. ${escapeHtml(text911Text(pkg.ops.textTo911))}</p>

<h2>Section V — Next Generation 9-1-1 and Cloud-based CPE</h2>
<p>NG 9-1-1 and cloud CPE options, including PNSP/RNSP connectivity themes, will be reviewed. PNSP discussed: ${pkg.ng.pnspConnected ? "yes" : "pending"}; RNSP discussed: ${pkg.ng.rnspConnected ? "yes" : "pending"}; cloud CPE discussed: ${pkg.ng.cloudCpeDiscussed ? "yes" : "pending"}.</p>

<h2>Section VI — References</h2>
<p>Reference links and contacts are provided for standards, Branch materials, and related organizations.</p>

<h2>Conclusion</h2>
<p>This FOR is part of the CA 9-1-1 Branch’s statutory obligation to monitor adherence to standards and is also intended as a review of support provided by the Branch and to strengthen communications with the PSAP.</p>
${
  pkg.findings.preMeeting
    ? `<h2>Preliminary findings / issues for discussion</h2><p>${escapeHtml(pkg.findings.preMeeting)}</p>`
    : ""
}
<p class="footnote">Prep instruction: finalize Summary after Sections I–VI. Automated FOR Worksheet pattern: capture fields first, then generate section docs (Roseville Automated FOR Worksheet.docx).</p>
`;
  return section("summary", "FOR Summary", "07_FOR_Summary.html", md, body, pkg);
}

export function renderChecklist(pkg: ForPackage): RenderedSection {
  const lines = pkg.evidence.map(
    (e) => `- [${e.present ? "x" : " "}] ${e.required ? "[Required] " : ""}${e.label}`
  );
  const md = `# Prep Checklist\n\n${lines.join("\n")}`;
  const rows = pkg.evidence.map(
    (e) =>
      [
        e.required ? "Required" : "Optional",
        e.label,
        e.present ? "Present" : "Missing",
      ] as [string, string, string]
  );
  const table = `<table class="data network"><thead><tr><th>Priority</th><th>Evidence</th><th>Status</th></tr></thead><tbody>
${rows
  .map(
    ([a, b, c]) =>
      `<tr><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td><td>${escapeHtml(c)}</td></tr>`
  )
  .join("\n")}
</tbody></table>`;

  const body = `
${letterhead("Prep Checklist")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
${table}
<p class="footnote">Required evidence complete: <strong>${
    pkg.evidence.filter((e) => e.required).every((e) => e.present) ? "Yes" : "No"
  }</strong> · Generated ${escapeHtml(pkg.meta.generatedAt)}</p>
`;
  return section("checklist", "Prep Checklist", "08_Prep_Checklist.html", md, body, pkg);
}

export function renderFindings(pkg: ForPackage): RenderedSection {
  const md = `# Findings\n\n## Pre-meeting\n${pkg.findings.preMeeting || "(none)"}\n\n## Post-meeting\n${pkg.findings.postMeeting || "(none)"}`;
  const body = `
${letterhead("Findings Log")}
${psapHeader(pkg.cover.psapName, pkg.cover.forDate)}
<h2>Pre-meeting / preliminary</h2>
<p>${escapeHtml(pkg.findings.preMeeting || "(none entered)")}</p>
<h2>Post-meeting</h2>
<p>${escapeHtml(pkg.findings.postMeeting || "(complete after FOR meeting)")}</p>
`;
  return section("findings", "Findings Log", "09_Findings_Log.html", md, body, pkg);
}

export function renderAllSections(pkg: ForPackage): RenderedSection[] {
  return [
    renderCover(pkg),
    renderSectionI(pkg),
    renderSectionII(pkg),
    renderSectionIII(pkg),
    renderSectionIV(pkg),
    renderSectionV(pkg),
    renderSectionVI(pkg),
    renderSummary(pkg),
    renderChecklist(pkg),
    renderFindings(pkg),
  ];
}

export function buildFullMarkdown(pkg: ForPackage): string {
  return renderAllSections(pkg)
    .map((s) => s.markdown)
    .join("\n\n---\n\n");
}

/** Combined binder HTML — each section starts on a new printed page. */
export function buildFullHtmlDocument(pkg: ForPackage): string {
  const sections = renderAllSections(pkg);
  const body = sections
    .map((s, i) => {
      // Extract body inner content between <body> and </body> from section HTML
      const m = s.html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const inner = m ? m[1] : s.html;
      // strip per-section meta bar for combined binder cleanliness
      const cleaned = inner.replace(/<div class="meta-bar">[\s\S]*?<\/div>/, "");
      return `<section class="for-section${i === 0 ? "" : " page-break"}" id="${s.id}">${cleaned}</section>`;
    })
    .join("\n");

  return wrapHtmlDocument({
    title: `FOR Binder — ${pkg.cover.psapName || "Draft"} — ${pkg.cover.forDate || ""}`,
    metaLine: `Combined FOR package · Engine ${pkg.meta.version} · ${pkg.meta.generatedAt} · Print to PDF for binder · Decision support only`,
    bodyHtml: body,
  });
}

export type ExportFile = { filename: string; content: string; mime: string };

export function buildExportFiles(pkg: ForPackage): ExportFile[] {
  const sections = renderAllSections(pkg);
  const slug = (pkg.cover.psapName || "FOR_Draft").replace(/[^\w\-]+/g, "_");
  const files: ExportFile[] = [
    {
      filename: `${slug}_00_COMBINED_Binder.html`,
      content: buildFullHtmlDocument(pkg),
      mime: "text/html;charset=utf-8",
    },
    ...sections.map((s) => ({
      filename: `${slug}_${s.filename}`,
      content: s.html,
      mime: "text/html;charset=utf-8",
    })),
    {
      filename: `${slug}_FULL_PACKAGE.md`,
      content: buildFullMarkdown(pkg),
      mime: "text/markdown;charset=utf-8",
    },
    {
      filename: `${slug}_package.json`,
      content: JSON.stringify(pkg, null, 2),
      mime: "application/json;charset=utf-8",
    },
  ];
  return files;
}
