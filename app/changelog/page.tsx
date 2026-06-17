'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getChangelog, type ChangelogEntry } from '@/lib/utils';

// Server component note: This page is marked client for React state (search/filter).
// Data originates from server-compatible lib (getChangelog can be called in RSC too).
// For pure RSC static: could fs.readFile CHANGELOG.md at build and parse, but use array/lib for demo per spec.
// Follows exact patterns from /work embedded changelog + glass-card, btn-*, section-padding, all-dark vault theme.

export default function ChangelogPage() {
  const allEntries: ChangelogEntry[] = getChangelog();

  const [search, setSearch] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('all');

  // Client interactivity per requirements (React state)
  const versions = Array.from(new Set(allEntries.map(e => e.version))).sort().reverse();

  const filteredEntries = allEntries.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.summary.toLowerCase().includes(search.toLowerCase()) ||
      entry.version.toLowerCase().includes(search.toLowerCase()) ||
      (entry.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchesVersion = selectedVersion === 'all' || entry.version === selectedVersion;
    return matchesSearch && matchesVersion;
  });

  // Add manual entry: form that logs / suggests PR (no persist in static; agent aware)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ version: '', title: '', summary: '' });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.version || !formData.title) {
      alert('Version and title required for manual entry suggestion.');
      return;
    }
    // Logs for demo + ties to error logging patterns (future: errors link to changelog)
    console.log('[changelog] Manual entry suggestion:', formData);
    // In real: would call API or use GitHub MCP; here suggest PR
    alert(
      `Manual entry suggested. Append to CHANGELOG.md and/or lib/utils.ts CHANGELOG_DATA.\n\n` +
      `Please open PR to https://github.com/The-Key-Holders/keyholders-site\n` +
      `Entry: ${formData.version} - ${formData.title}\n` +
      `(See agent comment below.)`
    );
    setFormData({ version: '', title: '', summary: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-vault-950 min-h-screen text-white">
      {/* Top nav / back link bar - matches /work and layout patterns */}
      <div className="border-b border-white/5 bg-vault-900/50">
        <div className="container-narrow flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            ← Back to The Key Holders
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/work" className="text-emeraldGlow/70 hover:text-emeraldGlow">
              View in Work logs →
            </Link>
            <a
              href="https://github.com/The-Key-Holders/keyholders-site/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emeraldGlow/70 hover:text-emeraldGlow"
            >
              GitHub Releases →
            </a>
          </div>
        </div>
      </div>

      {/* Header / Intro - uses section-padding, container-narrow, editorial style */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emeraldGlow/70">
            Logs • Versioned
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter text-white sm:text-6xl">
            Changelog
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/65">
            Advanced changelog for thekeyholders.org ecosystem. Manual entries + template for auto from commits (GitHub releases / conventional commits). Ties to file version tracking and error logging.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/The-Key-Holders/keyholders-site"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Repo on GitHub
            </a>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-gold text-sm"
            >
              {showForm ? 'Close' : 'Add manual entry'}
            </button>
          </div>
        </div>
      </section>

      {/* Manual entry form (demo logs + PR suggest; integrates with agent workflow) */}
      {showForm && (
        <section className="border-b border-white/5 bg-vault-900/20 py-8">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <div className="glass-card p-6 max-w-xl">
              <h3 className="font-semibold mb-4">Suggest Manual Entry (demo)</h3>
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.1.0"
                    className="w-full rounded bg-vault-950 border border-white/15 px-3 py-2 text-sm focus:border-emeraldGlow/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="New feature"
                    className="w-full rounded bg-vault-950 border border-white/15 px-3 py-2 text-sm focus:border-emeraldGlow/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Summary</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief description..."
                    className="w-full rounded bg-vault-950 border border-white/15 px-3 py-2 text-sm focus:border-emeraldGlow/50"
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn-primary text-sm">Log / Suggest PR</button>
                <p className="text-[10px] text-white/40">This simulates. Real updates via PR or GitHub MCP by agents.</p>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Filters + List - search/filter with React state, glass-card list */}
      <section className="section-padding">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, summary, version..."
              className="flex-1 rounded-lg bg-vault-900 border border-white/10 px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-emeraldGlow/40"
              aria-label="Search changelog"
            />
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="rounded-lg bg-vault-900 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-emeraldGlow/40"
              aria-label="Filter by version"
            >
              <option value="all">All versions</option>
              {versions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-white/50 mb-4">
            Showing {filteredEntries.length} of {allEntries.length} entries. Data from lib (synced with CHANGELOG.md).
          </div>

          <div className="grid gap-4">
            {filteredEntries.length === 0 && (
              <p className="text-sm text-white/50 glass-card p-6">No matching entries. Try clearing filters.</p>
            )}
            {filteredEntries.map((entry) => (
              <div key={entry.version} className="glass-card p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-sm font-semibold text-emeraldGlow">{entry.version}</span>
                  <span className="text-xs text-white/40">{entry.date}</span>
                  <span className={`ml-auto rounded px-2 py-0.5 text-[10px] uppercase tracking-wider ${entry.type === 'auto' ? 'bg-emeraldGlow/10 text-emeraldGlow' : 'bg-white/10 text-white/60'}`}>
                    {entry.type}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{entry.summary}</p>
                {entry.files && entry.files.length > 0 && (
                  <div className="mt-3 text-[10px] text-white/50">
                    Files: {entry.files.join(', ')}
                  </div>
                )}
                {entry.sha && (
                  <a
                    href={`https://github.com/The-Key-Holders/keyholders-site/commit/${entry.sha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-emeraldGlow hover:underline"
                  >
                    View commit {entry.sha.slice(0, 7)} →
                  </a>
                )}
                {entry.notes && (
                  <p className="mt-2 text-xs italic text-white/50">{entry.notes}</p>
                )}
                <div className="mt-3">
                  <a
                    href={`https://github.com/The-Key-Holders/keyholders-site/releases/tag/${entry.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-emeraldGlow underline"
                  >
                    View release (if tagged) →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs text-white/40 border-t border-white/5 pt-4">
            Links use GitHub for commits/releases. For full history see <Link href="/work" className="underline">/work</Link>.
            <br />
            Future: direct error log links to relevant changelog entries.
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/40">
        <div className="container-narrow px-4">
          Part of <a href="https://github.com/The-Key-Holders" target="_blank" rel="noopener noreferrer" className="hover:text-white">The Key Holders</a> ecosystem • Use Git tags/commits for versions.
        </div>
      </footer>

      {/* Agent-aware comment (per requirements; do not remove):
        [changelog-maintainer] persona (and [historian-persona]): 
        - Use grok_com_github MCP: list_commits, get_release_by_tag, list_releases, get_commit
        - Then push_files or create_or_update_file on CHANGELOG.md + optionally sync to lib/utils.ts CHANGELOG_DATA
        - Or create_pull_request to propose.
        - Can call searchChangelog / getChangelog() imported.
        - Integrates file-versions + error logging (future errors point here).
        - Template auto section in CHANGELOG.md.
        Start with static MD read (fs in RSC) + sync script later; current = lib data + MD for humans/agents.
      */}
    </div>
  );
}
