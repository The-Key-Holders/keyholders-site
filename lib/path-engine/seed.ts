import type { OpsSnapshot, PathType } from "./types";

/** CPE Cloud path for RFP 26-16743 — Slice 1 single PathType */
export const CPE_CLOUD_PATH_TYPE: PathType = {
  id: "pt_cpe_cloud_v1",
  code: "cpe-cloud-rfp-26-16743",
  name: "CPE Cloud · RFP 26-16743",
  contractProfileId: "rfp-26-16743-cpe",
  version: 1,
  buckets: [
    {
      code: "funding_init",
      label: "Funding initiation",
      sortOrder: 1,
      requiredProcessCodes: ["adv_notice"],
    },
    {
      code: "planning",
      label: "Planning (SOW)",
      sortOrder: 2,
      requiredProcessCodes: ["sow"],
    },
    {
      code: "package",
      label: "TD-288 package",
      sortOrder: 3,
      requiredProcessCodes: ["td288"],
    },
    {
      code: "pay",
      label: "Invoice / pay",
      sortOrder: 4,
      requiredProcessCodes: ["invoice"],
    },
    {
      code: "complete",
      label: "Path complete",
      sortOrder: 5,
      requiredProcessCodes: [],
    },
  ],
  processes: [
    {
      code: "adv_notice",
      name: "Advance Notification (Att. 11)",
      sortOrder: 1,
      bucketCode: "funding_init",
      etaDays: 10,
      toolHref: "/psap-portal/tools/advance-notification-wizard",
      required: true,
    },
    {
      code: "sow",
      name: "SOW review (Att. 16)",
      sortOrder: 2,
      bucketCode: "planning",
      etaDays: 15,
      toolHref: "/psap-portal/tools/sow-checker",
      required: true,
    },
    {
      code: "td288",
      name: "TD-288 package",
      sortOrder: 3,
      bucketCode: "package",
      etaDays: 20,
      toolHref: "/psap-portal/tools/td288-checker",
      required: true,
    },
    {
      code: "invoice",
      name: "Invoice check (Att. 14/15)",
      sortOrder: 4,
      bucketCode: "pay",
      etaDays: 14,
      toolHref: "/psap-portal/tools/invoice-checker",
      required: true,
    },
  ],
  tasksByProcess: {
    adv_notice: [
      { code: "model", label: "Confirm Cloud vs On-Prem", sortOrder: 1 },
      { code: "att11", label: "Complete Advance Notification fields", sortOrder: 2 },
      { code: "submit", label: "Submit to Advisor", sortOrder: 3 },
    ],
    sow: [
      { code: "draft", label: "Draft SOW vs Attachment 16", sortOrder: 1 },
      { code: "qc", label: "Run SOW checker", sortOrder: 2 },
    ],
    td288: [
      { code: "assemble", label: "Assemble TD-288 package", sortOrder: 1 },
      { code: "qc", label: "Run TD-288 checker", sortOrder: 2 },
    ],
    invoice: [
      { code: "fields", label: "Invoice fields vs TD-288", sortOrder: 1 },
      { code: "qc", label: "Run invoice checker", sortOrder: 2 },
    ],
  },
};

export function buildSeedSnapshot(): OpsSnapshot {
  const users = [
    {
      id: "user_advisor_demo",
      email: "advisor.demo@example.com",
      displayName: "Demo Advisor",
      role: "advisor" as const,
    },
    {
      id: "user_psap_demo",
      email: "psap.demo@example.com",
      displayName: "Demo PSAP Staff",
      role: "psap" as const,
    },
    {
      id: "user_admin_demo",
      email: "admin.demo@example.com",
      displayName: "Portal Admin",
      role: "admin" as const,
    },
  ];

  const psaps = [
    {
      id: "psap_roseville",
      name: "Roseville PD",
      county: "Placer",
      code: "ROSEVILLE",
    },
    {
      id: "psap_alameda",
      name: "Alameda County Sheriff",
      county: "Alameda",
      code: "ALAMEDA",
    },
    {
      id: "psap_sample",
      name: "Sample Valley PSAP",
      county: "Demo",
      code: "SAMPLE",
    },
  ];

  const assignments = [
    {
      id: "asgn_1",
      advisorUserId: "user_advisor_demo",
      psapId: "psap_roseville",
    },
    {
      id: "asgn_2",
      advisorUserId: "user_advisor_demo",
      psapId: "psap_alameda",
    },
    {
      id: "asgn_3",
      advisorUserId: "user_advisor_demo",
      psapId: "psap_sample",
    },
  ];

  return {
    users,
    psaps,
    assignments,
    pathTypes: [CPE_CLOUD_PATH_TYPE],
    paths: [],
    processes: [],
    tasks: [],
    activity: [],
    overrides: [],
    audit: [],
  };
}
