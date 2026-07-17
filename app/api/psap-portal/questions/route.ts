import { addQuestion, getQuestions, updateQuestionStatus } from "@/lib/psap-portal/store";
import type { QuestionCategory, QuestionUrgency } from "@/lib/psap-portal/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES: QuestionCategory[] = [
  "Timing",
  "Funding",
  "Contracts",
  "NG",
  "Vendor",
  "Claims",
  "Residual",
  "Other",
];
const URGENCIES: QuestionUrgency[] = ["Routine", "Time-sensitive", "Outage-related"];

export async function GET() {
  return NextResponse.json({ questions: getQuestions() });
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const psapName = String(body.psapName || "").trim();
  const psapCode = String(body.psapCode || "").trim();
  const county = String(body.county || "").trim();
  const contactName = String(body.contactName || "").trim();
  const contactEmail = String(body.contactEmail || "").trim();
  const contactPhone = String(body.contactPhone || "").trim();
  const category = body.category as QuestionCategory;
  const urgency = body.urgency as QuestionUrgency;
  const question = String(body.question || "").trim();

  if (!psapName || !county || !contactName || !contactEmail || !question) {
    return NextResponse.json(
      { error: "psapName, county, contactName, contactEmail, and question are required" },
      { status: 400 }
    );
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!URGENCIES.includes(urgency)) {
    return NextResponse.json({ error: "Invalid urgency" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const row = addQuestion({
    psapName,
    psapCode,
    county,
    contactName,
    contactEmail,
    contactPhone: contactPhone || undefined,
    category,
    urgency,
    question,
  });

  return NextResponse.json({ question: row }, { status: 201 });
}

export async function PATCH(request: Request) {
  let body: { id?: string; status?: "new" | "in_progress" | "done" } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  const updated = updateQuestionStatus(body.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ question: updated });
}
