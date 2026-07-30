"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Lightweight markdown → React for agent chat bubbles.
 * No HTML injection: only known constructs map to elements.
 */

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Order: links, bold, italic, inline code
  const re =
    /(\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(
        <Fragment key={`${keyPrefix}-t-${i++}`}>{text.slice(last, m.index)}</Fragment>
      );
    }
    if (m[1] && m[2] && m[3]) {
      const href = m[3];
      const label = m[2];
      if (href.startsWith("/")) {
        nodes.push(
          <Link
            key={`${keyPrefix}-l-${i++}`}
            href={href}
            className="text-cyanGlow underline underline-offset-2 hover:text-cyanGlow/90"
          >
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={`${keyPrefix}-a-${i++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyanGlow underline underline-offset-2 hover:text-cyanGlow/90"
          >
            {label}
          </a>
        );
      }
    } else if (m[4] && m[5]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-white">
          {m[5]}
        </strong>
      );
    } else if (m[6] && m[7]) {
      nodes.push(
        <em key={`${keyPrefix}-i-${i++}`} className="italic text-white/90">
          {m[7]}
        </em>
      );
    } else if (m[8] && m[9]) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-cyanGlow/95"
        >
          {m[9]}
        </code>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t-end`}>{text.slice(last)}</Fragment>);
  }
  return nodes.length ? nodes : [text];
}

/** If the model wraps the whole reply in a single fence, unwrap it. */
function unwrapOuterFence(src: string): string {
  const t = src.trim();
  const m = /^```(?:markdown|md|text)?\s*\n([\s\S]*?)\n```$/i.exec(t);
  return m ? m[1].trim() : src;
}

type Block =
  | { type: "p"; text: string }
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; text: string }
  | { type: "hr" }
  | { type: "quote"; text: string };

function parseBlocks(src: string): Block[] {
  const text = unwrapOuterFence(src).replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    const fence = /^```([\w-]*)\s*$/.exec(line);
    if (fence) {
      const lang = fence[1] || "";
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // close fence
      blocks.push({ type: "code", lang, text: body.join("\n") });
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      blocks.push({
        type: "h",
        level: h[1].length as 1 | 2 | 3,
        text: h[2].trim(),
      });
      i += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: quoteLines.join("\n") });
      continue;
    }

    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, "").trim());
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // paragraph: gather until blank or block start
    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```/.test(lines[i]) &&
      !/^\s*---+\s*$/.test(lines[i]) &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*[-*•]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }

  return blocks;
}

export default function AgentChatMarkdown({ content }: { content: string }) {
  const blocks = parseBlocks(content || "");

  return (
    <div className="agent-md space-y-2.5 text-sm leading-relaxed text-white/85">
      {blocks.map((b, idx) => {
        const k = `b-${idx}`;
        if (b.type === "p") {
          return (
            <p key={k} className="whitespace-pre-wrap">
              {renderInline(b.text, k)}
            </p>
          );
        }
        if (b.type === "h") {
          const cls =
            b.level === 1
              ? "text-base font-semibold text-white"
              : b.level === 2
                ? "text-[0.95rem] font-semibold text-white"
                : "text-sm font-semibold text-white/95";
          return (
            <p key={k} className={cls}>
              {renderInline(b.text, k)}
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={k} className="list-disc space-y-1 pl-5 marker:text-cyanGlow/70">
              {b.items.map((item, j) => (
                <li key={`${k}-${j}`}>{renderInline(item, `${k}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={k} className="list-decimal space-y-1 pl-5 marker:text-cyanGlow/70">
              {b.items.map((item, j) => (
                <li key={`${k}-${j}`}>{renderInline(item, `${k}-${j}`)}</li>
              ))}
            </ol>
          );
        }
        if (b.type === "quote") {
          return (
            <blockquote
              key={k}
              className="border-l-2 border-cyanGlow/40 pl-3 text-white/70"
            >
              {renderInline(b.text, k)}
            </blockquote>
          );
        }
        if (b.type === "hr") {
          return <hr key={k} className="border-white/10" />;
        }
        // code: only true fenced blocks get mono panel (not whole message)
        return (
          <pre
            key={k}
            className="overflow-x-auto rounded-lg border border-white/10 bg-vault-950/80 p-3 font-mono text-[0.8rem] leading-snug text-white/80"
          >
            <code>{b.text}</code>
          </pre>
        );
      })}
    </div>
  );
}
