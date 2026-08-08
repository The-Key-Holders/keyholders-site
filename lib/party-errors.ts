/** Structured party API errors (user-safe vs internal). */

export type PartyErrorBody = {
  error: string;
  code: string;
  userMessage: string;
  correlationId: string;
};

export function correlationId(): string {
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function partyError(
  code: string,
  userMessage: string,
  status = 400,
  detail?: string
): { status: number; body: PartyErrorBody } {
  const id = correlationId();
  if (detail) {
    console.error(JSON.stringify({ level: "error", event: "party_error", code, correlationId: id, detail }));
  }
  return {
    status,
    body: {
      error: userMessage,
      code,
      userMessage,
      correlationId: id,
    },
  };
}
