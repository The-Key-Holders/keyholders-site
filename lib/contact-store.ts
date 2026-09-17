import { neon } from "@neondatabase/serverless";

export type ContactEventName =
  | "connect_view"
  | "mailto_click"
  | "form_submit"
  | "form_error";

export type ContactMessage = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  path: string | null;
};

function sql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return neon(url);
}

async function ensureTables() {
  const db = sql();
  if (!db) return null;
  await db`
    CREATE TABLE IF NOT EXISTS contact_events (
      id bigserial PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      event text NOT NULL,
      path text,
      meta jsonb
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id bigserial PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      email text NOT NULL,
      topic text NOT NULL DEFAULT 'general',
      message text NOT NULL,
      path text
    )
  `;
  return db;
}

export async function recordContactEvent(
  event: ContactEventName,
  path?: string,
  meta?: Record<string, unknown>
): Promise<void> {
  const db = await ensureTables();
  if (!db) {
    console.info("[contact]", event, path || "", meta || {});
    return;
  }
  await db`
    INSERT INTO contact_events (event, path, meta)
    VALUES (${event}, ${path || null}, ${JSON.stringify(meta || {})}::jsonb)
  `;
}

export async function saveContactMessage(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
  path?: string;
}): Promise<{ id: number }> {
  const db = await ensureTables();
  if (!db) {
    console.info("[contact-message]", input);
    return { id: 0 };
  }
  const rows = (await db`
    INSERT INTO contact_messages (name, email, topic, message, path)
    VALUES (${input.name}, ${input.email}, ${input.topic}, ${input.message}, ${input.path || null})
    RETURNING id
  `) as { id: number }[];
  return { id: Number(rows[0]?.id || 0) };
}

export async function listContactMessages(limit = 50): Promise<ContactMessage[]> {
  const db = await ensureTables();
  if (!db) return [];
  const rows = (await db`
    SELECT id, created_at, name, email, topic, message, path
    FROM contact_messages
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as ContactMessage[];
  return rows;
}

export async function contactEventCounts(): Promise<{ event: string; n: number }[]> {
  const db = await ensureTables();
  if (!db) return [];
  return (await db`
    SELECT event, count(*)::int AS n
    FROM contact_events
    GROUP BY event
    ORDER BY n DESC
  `) as { event: string; n: number }[];
}
