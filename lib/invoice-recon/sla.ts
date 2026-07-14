import type { SlaStatus } from "./types";

export function parseDate(s: string): Date {
  const t = s.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (us) return new Date(Number(us[3]), Number(us[1]) - 1, Number(us[2]));
  throw new Error(`Invalid date: ${s}`);
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function assessSla(opts: {
  received: Date;
  today?: Date;
  reviewed?: boolean;
  held_reason?: string;
  review_days?: number;
  hold_days?: number;
  payment_days?: number;
}): SlaStatus {
  const today = opts.today ?? new Date();
  const review = opts.review_days ?? 5;
  const hold = opts.hold_days ?? 30;
  const payment = opts.payment_days ?? 45;
  const receivedMid = new Date(opts.received.getFullYear(), opts.received.getMonth(), opts.received.getDate());
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days_open = Math.round((todayMid.getTime() - receivedMid.getTime()) / 86400000);

  let status: SlaStatus["status"] = "OK";
  let action = "Within SLA";
  if (days_open > payment) {
    status = "CRITICAL";
    action = `Past ${payment}-day prompt payment window — escalate to fiscal unit`;
  } else if (days_open > hold && opts.held_reason) {
    status = "WARN";
    action = `Past ${hold}-day hold guideline — dispute or approve now`;
  } else if (days_open > review && !opts.reviewed) {
    status = "WARN";
    action = `Review within ${review} days of receipt (Alicia Fuller policy)`;
  }

  return {
    received: ymd(receivedMid),
    days_open,
    status,
    action,
    held_reason: opts.held_reason ?? "",
    reviewed: !!opts.reviewed,
  };
}
