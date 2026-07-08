import { runAllotment } from "@/lib/psap/engine";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

async function fileToBuffer(file: File | null): Promise<ArrayBuffer | undefined> {
  if (!file || file.size === 0) return undefined;
  return file.arrayBuffer();
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const callSummary = form.get("callSummary");
    if (!(callSummary instanceof File)) {
      return NextResponse.json({ status: "error", error: "Call Summary file is required." }, { status: 400 });
    }

    const result = runAllotment({
      callSummary: await callSummary.arrayBuffer(),
      callsPerHour: await fileToBuffer(form.get("callsPerHour") as File | null),
      answerTime: await fileToBuffer(form.get("answerTime") as File | null),
      ringTime: await fileToBuffer(form.get("ringTime") as File | null),
      classOfService: await fileToBuffer(form.get("classOfService") as File | null),
      psapName: String(form.get("psapName") ?? ""),
      county: String(form.get("county") ?? ""),
      systemType: (form.get("systemType") as "on_premise" | "cloud") ?? "on_premise",
    });

    if (result.status === "error") {
      return NextResponse.json(result, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}