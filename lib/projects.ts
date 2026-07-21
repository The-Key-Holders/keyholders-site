/**
 * Single source of truth for portfolio cards.
 * Ship a tool/venture → update this file → homepage, /projects, footer stay in sync.
 */

export type ProjectStatus = "live" | "beta" | "lab" | "planned" | "external";
export type ProjectKind = "venture" | "tool" | "lab" | "integration" | "template";

export interface Project {
  id: string;
  name: string;
  summary: string;
  kind: ProjectKind;
  status: ProjectStatus;
  href: string;
  gated?: boolean;
  tags: string[];
  featured?: boolean;
  github?: string;
  external?: boolean;
}

export const projects: Project[] = [
  {
    id: "pcf-vault",
    name: "PCF Vault",
    summary:
      "NEW — Path to Compliance & Funding: CA 9-1-1 PSAP/Advisor ERP, Funding Paths, PortablePost allotment, invoice recon, dual-era forms.",
    kind: "tool",
    status: "beta",
    href: "/pcf-vault/",
    gated: false,
    tags: ["Cal OES", "9-1-1", "Funding", "Release"],
    featured: true,
  },
  {
    id: "geeks-next-door",
    name: "Geeks Next Door",
    summary: "Neighborly tech support and field service — consumer face of The Key Holders.",
    kind: "venture",
    status: "external",
    href: "https://www.thegeeksnextdoor.com",
    tags: ["Consumer", "Field service"],
    featured: true,
    external: true,
  },
  {
    id: "trade",
    name: "Key Holders Trade",
    summary: "ServiceTitan and contractor platform integrations, diagnostics, and B2B services.",
    kind: "venture",
    status: "live",
    href: "/trade",
    tags: ["B2B", "ServiceTitan"],
    featured: true,
  },
  {
    id: "advisor-tools",
    name: "Advisor Tools Hub",
    summary:
      "Password-protected professional suite for Cal OES Funding Advisor workflows — allotment, invoices, FOR.",
    kind: "tool",
    status: "live",
    href: "/advisor-tools",
    gated: true,
    tags: ["Cal OES", "Professional"],
    featured: true,
  },
  {
    id: "psap-allotment",
    name: "PSAP Allotment Engine",
    summary: "Chapter III CPE fixed allotment calculator from ECaTS exports.",
    kind: "tool",
    status: "live",
    href: "/psap-allotment",
    gated: true,
    tags: ["9-1-1", "ECaTS", "Funding"],
    featured: true,
  },
  {
    id: "invoice-td288",
    name: "Invoice ↔ TD-288 Reconciler",
    summary: "Victoria batch paste → TD-288 match, SLA traffic lights, approve/dispute exports.",
    kind: "tool",
    status: "live",
    href: "/advisor-tools/invoice-reconciler",
    gated: true,
    tags: ["Fiscal", "TD-288", "SLA"],
    featured: true,
  },
  {
    id: "help-agent",
    name: "New Hire + Automation Help Agent",
    summary:
      "Password-gated Grok coach for onboarding and Advisor Tools — private, no public link.",
    kind: "tool",
    status: "live",
    href: "/advisor-tools/help-agent",
    gated: true,
    tags: ["New hire", "Chat", "Grok"],
    featured: true,
  },
  {
    id: "public-support",
    name: "Key Holders Site Guide (Taskade)",
    summary:
      "Public Taskade concierge for portfolio, Trade, and Geeks Next Door — floating chat on public pages.",
    kind: "tool",
    status: "live",
    href: "/support",
    gated: false,
    tags: ["Taskade", "Chat", "Public"],
    featured: true,
  },
  {
    id: "for-engine",
    name: "FOR Assembly Engine",
    summary:
      "Password-gated Fiscal & Operational Review draft package builder — Cover through Section VI + Summary export.",
    kind: "tool",
    status: "live",
    href: "/advisor-tools/for-engine",
    gated: true,
    tags: ["FOR", "PSAP", "Report"],
    featured: true,
  },
  {
    id: "fieldhub",
    name: "FieldHub",
    summary: "Geeks Next Door work-order brokering monorepo (2026).",
    kind: "lab",
    status: "lab",
    href: "https://github.com/CupofJavad/FieldHub",
    tags: ["Field service", "Monorepo"],
    featured: true,
    github: "https://github.com/CupofJavad/FieldHub",
    external: true,
  },
  {
    id: "legacy-vault",
    name: "Legacy Vault",
    summary: "Bitcoin-native estate planning — Rust API + Next.js, multi-chain timelock policies.",
    kind: "lab",
    status: "lab",
    href: "https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust",
    tags: ["Crypto", "Estate"],
    featured: true,
    github: "https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust",
    external: true,
  },
  {
    id: "currentrms-sync",
    name: "CurrentRMS ↔ Sheets",
    summary: "Daily opportunity sync from Current RMS API to Google Sheets for event production.",
    kind: "integration",
    status: "live",
    href: "https://github.com/The-Key-Holders/currentrms-google-sheets-sync",
    tags: ["Integration", "Sheets"],
    featured: true,
    github: "https://github.com/The-Key-Holders/currentrms-google-sheets-sync",
    external: true,
  },
  {
    id: "web-scraper-gui",
    name: "Web Scraper 4.0 GUI",
    summary: "Desktop Python GUI for structured web scraping workflows.",
    kind: "lab",
    status: "lab",
    href: "https://github.com/CupofJavad/web_scraper_4.0_GUI",
    tags: ["Python", "Desktop"],
    featured: true,
    github: "https://github.com/CupofJavad/web_scraper_4.0_GUI",
    external: true,
  },
  {
    id: "starter-pack",
    name: "Starter Pack",
    summary: "Opinionated template for serious small apps and new projects.",
    kind: "template",
    status: "lab",
    href: "https://github.com/CupofJavad/Starter_Pack",
    tags: ["Template"],
    featured: false,
    github: "https://github.com/CupofJavad/Starter_Pack",
    external: true,
  },
  {
    id: "vericover",
    name: "Vericover",
    summary: "Active TypeScript application (lab / product exploration).",
    kind: "lab",
    status: "lab",
    href: "https://github.com/CupofJavad/vericover",
    tags: ["TypeScript"],
    featured: false,
    github: "https://github.com/CupofJavad/vericover",
    external: true,
  },
  {
    id: "forgotten-python",
    name: "Forgotten Python Scripts",
    summary: "Experimental toolkit and script archive under The Key Holders labs.",
    kind: "lab",
    status: "lab",
    href: "https://github.com/The-Key-Holders/ForgottenPythonScripts",
    tags: ["Python", "Experiments"],
    featured: false,
    github: "https://github.com/The-Key-Holders/ForgottenPythonScripts",
    external: true,
  },
  {
    id: "lunaverse",
    name: "LunaVerse AI",
    summary: "AI experiment thread (LunaVerse + Supabase migration work).",
    kind: "lab",
    status: "lab",
    href: "https://github.com/CupofJavad/LunaVerse_AI",
    tags: ["AI"],
    featured: false,
    github: "https://github.com/CupofJavad/LunaVerse_AI",
    external: true,
  },
];

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function projectsByKind(kind: ProjectKind): Project[] {
  return projects.filter((p) => p.kind === kind);
}

export function toolProjects(): Project[] {
  return projects.filter((p) => p.kind === "tool");
}

export function githubProjects(): Project[] {
  return projects.filter((p) => p.github);
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  beta: "Beta",
  lab: "Lab",
  planned: "Planned",
  external: "External",
};
