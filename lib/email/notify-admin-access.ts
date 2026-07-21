/**
 * Notify admin@thekeyholders.org of a new PCF Vault access request.
 * Uses Resend HTTP API when RESEND_API_KEY is set; otherwise logs and returns false.
 */

export type AccessNotifyPayload = {
  displayName: string;
  email: string;
  roleRequested: string;
  psapId?: string;
  psapName?: string;
  county?: string;
  note?: string;
  notifyEmail?: boolean;
  requestId?: string;
  source?: string;
};

function adminInbox(): string {
  return (
    process.env.PORTAL_ADMIN_EMAIL?.trim() ||
    process.env.MAGIC_LINK_FROM_EMAIL?.trim() ||
    "admin@thekeyholders.org"
  );
}

function fromAddress(): string {
  return (
    process.env.MAGIC_LINK_FROM_EMAIL?.trim() ||
    process.env.PORTAL_ADMIN_EMAIL?.trim() ||
    "admin@thekeyholders.org"
  );
}

export async function notifyAdminNewAccessRequest(
  payload: AccessNotifyPayload
): Promise<{ sent: boolean; error?: string }> {
  const to = adminInbox();
  const subject = `[PCF Vault] New access request from ${payload.displayName || payload.email}`;
  const lines = [
    "You received a new PCF Vault login / access request.",
    "",
    "Please log in to review and approve or deny:",
    "  https://www.thekeyholders.org/psap-portal/admin",
    "  (or Admin → Access queue inside PCF Vault)",
    "",
    "— Request details —",
    `Name: ${payload.displayName}`,
    `Email: ${payload.email}`,
    `Role requested: ${payload.roleRequested}`,
    `County: ${payload.county || "—"}`,
    `PSAP: ${payload.psapName || payload.psapId || "—"}`,
    `Email notify opt-in (status updates): ${payload.notifyEmail ? "Yes" : "No"}`,
    `Note: ${payload.note || "—"}`,
    `Request ID: ${payload.requestId || "—"}`,
    `Source: ${payload.source || "pcf-vault"}`,
    `Submitted: ${new Date().toISOString()}`,
    "",
    "An internal access request was also created for admin approval.",
  ];
  const text = lines.join("\n");

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "[pcf-access] RESEND_API_KEY not set — access request stored but email not sent.",
      { to, subject, email: payload.email }
    );
    return {
      sent: false,
      error: "RESEND_API_KEY not configured — request saved; email not sent",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[pcf-access] Resend error", res.status, body);
      return { sent: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pcf-access] email failed", msg);
    return { sent: false, error: msg };
  }
}
