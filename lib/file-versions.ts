export type FileVersionId =
  | "keyholders-site"
  | "keyholders-site-work"
  | "currentrms-google-sheets-sync"
  | "geeksnextdoor-starter"
  | "reliability-infrastructure-roadmap"
  | "personal-temporal-assistant";

export interface FileVersion {
  id: FileVersionId;
  repo: string;
  path?: string;
  version: string; // semver or descriptive
  commitHash: string;
  lastUpdated: string; // ISO-ish date
  description: string;
  // History/diff support (minimal; full views via GitHub links)
  history?: Array<{
    commit: string;
    date: string;
    message: string;
  }>;
}

export const fileVersions: Record<FileVersionId, FileVersion> = {
  "keyholders-site": {
    id: "keyholders-site",
    repo: "The-Key-Holders/keyholders-site",
    path: "package.json",
    version: "0.1.0",
    commitHash: "a442fa9c76f0c6f4bf1cf103c6fd58e8485608b5",
    lastUpdated: "2026-06-16",
    description: "Central hub site (thekeyholders.org ecosystem). Tracks package + latest master.",
    history: [
      {
        commit: "a442fa9c76f0c6f4bf1cf103c6fd58e8485608b5",
        date: "2026-06-16",
        message: "feat: finalize winner Candidate 2 polish via full implement loop",
      },
    ],
  },
  "keyholders-site-work": {
    id: "keyholders-site-work",
    repo: "The-Key-Holders/keyholders-site",
    path: "app/work/page.tsx",
    version: "004-work-v1",
    commitHash: "a442fa9c76f0c6f4bf1cf103c6fd58e8485608b5",
    lastUpdated: "2026-06-16",
    description: "Work / mission logs page (Garner + CurrentRMS verbatim).",
    history: [
      {
        commit: "8c8384d",
        date: "2026-06-15",
        message: "feat(P2): standalone /work page + Garner §16",
      },
    ],
  },
  "currentrms-google-sheets-sync": {
    id: "currentrms-google-sheets-sync",
    repo: "The-Key-Holders/currentrms-google-sheets-sync",
    path: undefined,
    version: "1.0.0",
    commitHash: "c068a4967c19ebae360fc2e127a2820b696bb6b3",
    lastUpdated: "2025-12-19",
    description: "CurrentRMS ↔ Google Sheets daily sync (Work integration).",
    history: [
      {
        commit: "c068a4967c19ebae360fc2e127a2820b696bb6b3",
        date: "2025-12-19",
        message: "Update author name in README",
      },
    ],
  },
  "geeksnextdoor-starter": {
    id: "geeksnextdoor-starter",
    repo: "CupofJavad/geeksnextdoor-starter",
    path: "package.json",
    version: "0.1.0",
    commitHash: "HEAD",
    lastUpdated: "2026-06-17",
    description: "Geeks Next Door starter (ecosystem peer project).",
  },
  "reliability-infrastructure-roadmap": {
    id: "reliability-infrastructure-roadmap",
    repo: "The-Key-Holders/reliability-infrastructure-roadmap",
    version: "v1-76",
    commitHash: "HEAD",
    lastUpdated: "2026-01-15",
    description: "76-project reliability + infra portfolio salvaged via GitHub MCP for ecosystem hub.",
  },
  "personal-temporal-assistant": {
    id: "personal-temporal-assistant",
    repo: "CupofJavad/Personal_Assistant",
    version: "0.1.0",
    commitHash: "HEAD",
    lastUpdated: "2026-02-13",
    description: "Personal Temporal Assistant (PTA) — AI command center for planning (ecosystem peer).",
  },
};

// Integration note (for agents/personas using GitHub MCP):
// Seed and update entries with:
//   grok_com_github__list_commits({owner, repo, perPage:1})
//   grok_com_github__get_commit({owner, repo, sha, detail:"stats"})
//   grok_com_github__get_latest_release for semver tags if adopted.
// Use get_file_contents for per-file tree sha if finer tracking needed.
// Storage: this file (local repo file as metadata). Future: json import or Supabase if adopted in ecosystem.

export function getFileVersion(id: FileVersionId): FileVersion | undefined {
  return fileVersions[id];
}

export function getAllFileVersions(): FileVersion[] {
  return Object.values(fileVersions);
}

export function getVersionsByRepo(repo: string): FileVersion[] {
  return Object.values(fileVersions).filter((v) => v.repo === repo);
}

// Queryable by agents (e.g. error logging, personas): import + use in logs or API responses
export function logWithFileVersion(message: string, id?: FileVersionId) {
  const v = id ? getFileVersion(id) : undefined;
  const short = v?.commitHash?.slice(0, 7) || "untracked";
  // eslint-disable-next-line no-console
  console.log(`[file-vers:${short}] ${message}`);
}

// Simple semantic-ish version compare stub (additive for future diff/history tools)
export function isNewerVersion(a: string, b: string): boolean {
  // naive semver compare for 0.x ; extend as needed
  return a > b;
}
