# Changelog

All notable changes to the Key Holders site (thekeyholders.org ecosystem) will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Latest version:** v1.0.1 (2026-06-17)

**GitHub:** https://github.com/The-Key-Holders/keyholders-site

## [v1.0.0] - 2026-06-17

### Added
- Dedicated `/changelog` page with server component + client interactivity (search, version filter).
- Root `CHANGELOG.md` with advanced format (manual entries + auto template).
- Integration notes for file version tracking (lib/file-versions.ts + Git tags/commits), error logging ties (future), and agent personas.
- Links from Home "Work" section and nav considerations; GitHub commit/release links.

### Changed
- Extended changelog system from lib/utils.ts (getChangelog, searchChangelog) to support static MD + UI page.
- Updated tests, README, MODEL_HANDOFF.md for the new dedicated page (additive only, no P0/P1/P2 breakage).

### Fixed
- N/A (initial structured rollout).

## [v1.0.1] - 2026-06-17

### Added
- `/github` dedicated page (curated cards for FieldHub, Legacy Vault, CurrentRMS, Starter_Pack + Reliability/PTA salvaged via grok_com_github MCP; links to /changelog + /api/versions + /labs for advanced systems showcase). Overlay "GitHub", home/lab links updated (additive, exact vault patterns).

### Changed
- Updated lib/utils.ts CHANGELOG_DATA with v1.0.1 entry for GitHub hub + ecosystem audit (MCP, vercel, memory integration).

## [v0.9.1] - 2026-06-16

### Added
- Reliability Suite, simulator, on-theme images, expanded e2e.

### Changed
- Polish via implement loop (winner Candidate 2).

See Git history for prior.

---

## Template for Auto-generated Entries (from commits / GitHub releases / conventional commits)

Use this structure when auto-populating via tools (e.g. GitHub MCP `list_commits`, conventional commits parser, or release notes).

```
## [x.y.z] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Deprecated
- ...

### Removed
- ...

### Fixed
- ...

### Security
- ...

**Sources:** commits <sha...>, Git tag `vX.Y.Z`, PRs.
```

Manual entries can be appended by humans or agents in PRs.

**Integration notes:**
- **File version tracking:** Versions sourced from Git tags/commits (see lib/file-versions.ts: getAllFileVersions). Correlates entries with tracked files/paths across ecosystem repos.
- **Agent personas:** Agents (e.g. [changelog-maintainer], [historian-persona]) can use GitHub MCP tools (list_commits, get_release_by_tag, create_or_update_file on CHANGELOG.md) or PRs to auto-append/update. Query via `getChangelog()` / `searchChangelog()` from `@/lib/utils` (ties to error logs via logError for change-audits). Future: errors surface links to relevant changelog entry.
- **Site integration:** `/changelog` (new), embedded in `/work` (mission logs). Use static import or fs for MD in prod (demo uses data + MD sync note). Build-time or runtime via Git for auto.
- **Versions:** Use Git tags for releases (e.g. `git tag -a v1.0.0 -m "..."`); commit SHAs for granular auto entries. package.json version as base.
- **Tests/continuity:** Unit/e2e for page + links; P0/P1/P2 preserved (additive). See docs/MODEL_HANDOFF.md § changelog notes.

Next auto update: via GitHub release or `npm run changelog:gen` (future).

[Unreleased]: https://github.com/The-Key-Holders/keyholders-site/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/The-Key-Holders/keyholders-site/releases/tag/v1.0.0
