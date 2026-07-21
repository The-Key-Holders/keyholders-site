import { notifyAdminNewAccessRequest } from "@/lib/email/notify-admin-access";
import { submitAccessRequest } from "@/lib/path-engine/access";
import { withOpsStore } from "@/lib/path-engine/with-store";
import type { Role } from "@/lib/path-engine/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Map PCF Vault role picker → path-engine Role */
function mapRole(raw: string): Role | null {
  const r = (raw || "").toLowerCase().trim();
  if (r === "psap" || r === "psap_staff" || r === "psap_lead" || r === "county_coord") {
    return "psap";
  }
  if (
    r === "advisor" ||
    r === "supervisor" ||
    r === "vendor_pm" ||
    r === "finance_liaison" ||
    r === "vendor_billing"
  ) {
    return "advisor";
  }
  if (r === "branch_admin" || r === "admin") {
    return null; // cannot self-request admin
  }
  return null;
}

/**
 * Public endpoint for PCF Vault (/pcf-vault) access requests.
 * 1) Creates internal AccessRequest for admin approval
 * 2) Emails admin@thekeyholders.org (when RESEND_API_KEY is set)
 *
 * Not behind advisor-tools password middleware.
 */
export async function POST(request: Request) {
  return withOpsStore(async () => {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const displayName = String(body.displayName || body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const roleRaw = String(body.role || body.roleRequested || "");
    const roleRequested = mapRole(roleRaw);
    const psapId = body.psapId ? String(body.psapId) : undefined;
    const psapName = body.psapName ? String(body.psapName) : undefined;
    const county = body.county ? String(body.county) : undefined;
    const note = body.note ? String(body.note) : undefined;
    const notifyEmail = Boolean(body.notifyEmail);

    if (!email.includes("@") || !displayName) {
      return NextResponse.json(
        { error: "Name and valid email are required." },
        { status: 400 }
      );
    }
    if (!roleRequested) {
      return NextResponse.json(
        { error: "Invalid role (admin cannot be self-requested)." },
        { status: 400 }
      );
    }
    if (roleRequested === "psap" && !psapId && roleRaw !== "county_coord") {
      // county_coord may omit single PSAP
      if (roleRaw !== "county_coord") {
        return NextResponse.json(
          { error: "PSAP is required for PSAP staff/lead requests." },
          { status: 400 }
        );
      }
    }

    try {
      const row = submitAccessRequest({
        email,
        displayName,
        roleRequested,
        psapId,
        psapName,
        county,
        note: [
          note,
          `pcfRole=${roleRaw}`,
          `notifyEmail=${notifyEmail ? "yes" : "no"}`,
        ]
          .filter(Boolean)
          .join(" | "),
      });

      const mail = await notifyAdminNewAccessRequest({
        displayName,
        email,
        roleRequested: `${roleRaw} → ${roleRequested}`,
        psapId,
        psapName,
        county,
        note,
        notifyEmail,
        requestId: row.id,
        source: "pcf-vault-access-form",
      });

      return NextResponse.json({
        ok: true,
        requestId: row.id,
        status: row.status,
        emailSent: mail.sent,
        emailError: mail.error,
        message: mail.sent
          ? "Request submitted. Admin has been emailed and must approve before login."
          : "Request submitted for admin approval. (Email notify may be pending RESEND_API_KEY.)",
      });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Failed" },
        { status: 400 }
      );
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
