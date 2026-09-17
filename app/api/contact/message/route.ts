import { recordContactEvent, saveContactMessage } from "@/lib/contact-store";
import { notifyAdminNewContact } from "@/lib/email/notify-admin-contact";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOPICS = new Set(["general", "geeks", "trade", "tools", "other"]);

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    topic?: string;
    message?: string;
    path?: string;
    company?: string;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (body.company && String(body.company).trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 180);
  const topic = TOPICS.has(String(body.topic || ""))
    ? String(body.topic)
    : "general";
  const message = String(body.message || "").trim().slice(0, 4000);
  const path = String(body.path || "/").slice(0, 180);

  if (name.length < 2 || !email.includes("@") || message.length < 10) {
    await recordContactEvent("form_error", path);
    return NextResponse.json(
      { error: "Please include your name, a valid email, and a short message." },
      { status: 400 }
    );
  }

  const saved = await saveContactMessage({ name, email, topic, message, path });
  await recordContactEvent("form_submit", path, { id: saved.id, topic });
  const mailed = await notifyAdminNewContact({
    name,
    email,
    topic,
    message,
    path,
    id: saved.id,
  });

  return NextResponse.json({ ok: true, mailed: mailed.sent });
}
