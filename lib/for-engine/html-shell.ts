/** Shared print-friendly styles for FOR HTML sections (inspired by Branch Word layouts). */

export const FOR_CSS = `
  :root {
    --ink: #1a1a1a;
    --muted: #444;
    --line: #c8c8c8;
    --header: #0b3d5c;
    --accent: #8b1e2d;
  }
  * { box-sizing: border-box; }
  body {
    font-family: "Times New Roman", Times, Georgia, serif;
    color: var(--ink);
    line-height: 1.45;
    margin: 0;
    padding: 0.75in 0.9in;
    font-size: 12pt;
  }
  .letterhead {
    text-align: center;
    border-bottom: 2px solid var(--header);
    padding-bottom: 0.6rem;
    margin-bottom: 1.25rem;
  }
  .letterhead .org {
    font-size: 11pt;
    letter-spacing: 0.04em;
    color: var(--header);
    font-weight: 700;
    text-transform: uppercase;
  }
  .letterhead .branch {
    font-size: 10.5pt;
    color: var(--muted);
    margin-top: 0.15rem;
  }
  .doc-title {
    font-size: 16pt;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0.85rem 0 0.35rem;
    color: var(--ink);
  }
  .section-kicker {
    font-size: 12pt;
    font-weight: 700;
    color: var(--header);
    margin: 0.25rem 0 0.75rem;
  }
  .psap-block {
    text-align: center;
    margin: 1.25rem 0 1.5rem;
  }
  .psap-name {
    font-size: 14pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .psap-date {
    font-size: 12pt;
    margin-top: 0.35rem;
    text-transform: uppercase;
  }
  .seal-row {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    align-items: center;
    margin: 1.25rem 0 1.5rem;
  }
  .seal {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 3px solid var(--header);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 8pt;
    font-weight: 700;
    color: var(--header);
    line-height: 1.15;
    background: radial-gradient(circle at 40% 35%, #f7fafc 0%, #e8eef3 70%, #d5e0ea 100%);
  }
  .seal small { display: block; font-weight: 600; font-size: 7pt; color: var(--muted); }
  h1, h2, h3 { font-family: "Times New Roman", Times, serif; color: var(--ink); }
  h1 { font-size: 14pt; margin: 0 0 0.75rem; }
  h2 { font-size: 12.5pt; margin: 1.1rem 0 0.45rem; border-bottom: 1px solid var(--line); padding-bottom: 0.2rem; }
  h3 { font-size: 12pt; margin: 0.9rem 0 0.35rem; }
  p { margin: 0.45rem 0 0.65rem; text-align: justify; }
  ul { margin: 0.35rem 0 0.75rem 1.25rem; padding: 0; }
  li { margin: 0.2rem 0; }
  .meta-bar {
    font-size: 9pt;
    color: var(--muted);
    border: 1px solid var(--line);
    background: #f7f7f7;
    padding: 0.4rem 0.55rem;
    margin-bottom: 1rem;
  }
  table.data {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0 1rem;
    font-size: 11pt;
  }
  table.data th,
  table.data td {
    border: 1px solid #666;
    padding: 0.4rem 0.5rem;
    vertical-align: top;
    text-align: left;
  }
  table.data th {
    background: #eef3f7;
    font-weight: 700;
    width: 38%;
  }
  table.data td.num { text-align: right; font-variant-numeric: tabular-nums; }
  table.network th { width: auto; background: #eef3f7; }
  .prepared {
    margin-top: 2rem;
    font-size: 11pt;
    line-height: 1.5;
  }
  .prepared .label { font-weight: 700; }
  .footnote {
    margin-top: 1.5rem;
    font-size: 9pt;
    color: var(--muted);
    border-top: 1px solid var(--line);
    padding-top: 0.5rem;
  }
  .page-break { page-break-before: always; break-before: page; }
  @media print {
    body { padding: 0.5in 0.7in; }
    .meta-bar { display: none; }
    a { color: inherit; text-decoration: none; }
  }
`;

export function wrapHtmlDocument(opts: {
  title: string;
  bodyHtml: string;
  metaLine?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(opts.title)}</title>
  <style>${FOR_CSS}</style>
</head>
<body>
  ${opts.metaLine ? `<div class="meta-bar">${escapeHtml(opts.metaLine)}</div>` : ""}
  ${opts.bodyHtml}
</body>
</html>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function letterhead(sectionLabel?: string): string {
  return `<header class="letterhead">
  <div class="org">State of California</div>
  <div class="branch">9-1-1 Emergency Communications Branch</div>
  <div class="doc-title">Fiscal and Operational Review</div>
  ${sectionLabel ? `<div class="section-kicker">${escapeHtml(sectionLabel)}</div>` : ""}
</header>`;
}

export function psapHeader(psapName: string, date: string): string {
  return `<div class="psap-block">
  <div class="psap-name">${escapeHtml(psapName || "[PSAP Name]")}</div>
  <div class="psap-date">${escapeHtml(date || "[Date]")}</div>
</div>`;
}

export function dataTable(rows: [string, string][]): string {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><th scope="row">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`
    )
    .join("\n");
  return `<table class="data" role="table">\n${body}\n</table>`;
}

export function networkTable(
  rows: { telco: string; description: string }[]
): string {
  if (!rows.length) {
    return `<p><em>No network line items entered. Add counts on the Network step; a summary table is shown below when available.</em></p>`;
  }
  const head = `<tr><th>Telco</th><th>Description</th></tr>`;
  const body = rows
    .map(
      (r) =>
        `<tr><td>${escapeHtml(r.telco)}</td><td>${escapeHtml(r.description)}</td></tr>`
    )
    .join("\n");
  return `<table class="data network" role="table"><thead>${head}</thead><tbody>${body}</tbody></table>`;
}
