export async function notifyAdminNewContact(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
  path?: string;
  id?: number;
}): Promise<{ sent: boolean }> {
  const to =
    process.env.PORTAL_ADMIN_EMAIL?.trim() ||
    process.env.MAGIC_LINK_FROM_EMAIL?.trim() ||
    "admin@thekeyholders.org";
  const from =
    process.env.MAGIC_LINK_FROM_EMAIL?.trim() ||
    process.env.PORTAL_ADMIN_EMAIL?.trim() ||
    "admin@thekeyholders.org";
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const subject = `[Key Holders] New contact from ${input.name}`;
  const text = [
    "New public-site contact form submission.",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Topic: ${input.topic}`,
    `Path: ${input.path || "/"}`,
    `ID: ${input.id ?? "—"}`,
    "",
    input.message,
    "",
    "Inbox: https://www.thekeyholders.org/advisor-tools/inquiries",
  ].join("\n");

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — message stored, email not sent.");
    return { sent: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, reply_to: input.email }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return { sent: false };
    }
    return { sent: true };
  } catch (e) {
    console.error("[contact] email failed", e);
    return { sent: false };
  }
}
