export type PortalPersona = "psap" | "advisor" | "admin";

export const PERSONA_STORAGE_KEY = "psap-portal-persona-v1";

export const PERSONAS: Record<
  PortalPersona,
  {
    id: PortalPersona;
    label: string;
    short: string;
    blurb: string;
    home: string;
    accent: string;
  }
> = {
  psap: {
    id: "psap",
    label: "PSAP / County staff",
    short: "PSAP",
    blurb:
      "Prepare Advance Notifications, choose Cloud vs On-Prem, complete SOW/invoice packages, and find your Advisor — without the Branch inbox thrash.",
    home: "/psap-portal/psap",
    accent: "cyan",
  },
  advisor: {
    id: "advisor",
    label: "Funding & Compliance Advisor",
    short: "Advisor",
    blurb:
      "Post-award desk: process map (10 processes), top pain points + mitigations, request catalog (E1–E6 / I1–I3), SLAs, and package QC tools.",
    home: "/psap-portal/advisor",
    accent: "gold",
  },
  admin: {
    id: "admin",
    label: "Portal Admin",
    short: "Admin",
    blurb:
      "News, question inbox, sample Advisor directory, and JSON export/import for beta data.",
    home: "/psap-portal/admin",
    accent: "violet",
  },
};

export function isPortalPersona(v: unknown): v is PortalPersona {
  return v === "psap" || v === "advisor" || v === "admin";
}
