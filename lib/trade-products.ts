export type TradeProductId =
  | "diagnostic"
  | "health_check"
  | "quick_connect"
  | "integration_audit"
  | "user_training"
  | "ongoing_support";

export interface TradeProduct {
  id: TradeProductId;
  name: string;
  amountCents: number;
  description: string;
}

export const tradeProducts: Record<TradeProductId, TradeProduct> = {
  diagnostic: {
    id: "diagnostic",
    name: "Diagnostic",
    amountCents: 49700,
    description: "2-hour ServiceTitan review with priority issue list",
  },
  health_check: {
    id: "health_check",
    name: "Health Check",
    amountCents: 149700,
    description: "Deep audit with 90-day improvement roadmap",
  },
  quick_connect: {
    id: "quick_connect",
    name: "Quick Connect",
    amountCents: 299700,
    description: "Critical third-party integration live in two weeks",
  },
  integration_audit: {
    id: "integration_audit",
    name: "Integration Audit",
    amountCents: 99700,
    description: "Evaluate existing integrations for reliability and cost",
  },
  user_training: {
    id: "user_training",
    name: "User Training Sprint",
    amountCents: 199700,
    description: "Role-based training for office and field teams",
  },
  ongoing_support: {
    id: "ongoing_support",
    name: "Ongoing Support",
    amountCents: 99700,
    description: "Monthly retainer for priority support and check-ins",
  },
};

const buyButtonEnvKeys: Record<TradeProductId, string> = {
  diagnostic: "NEXT_PUBLIC_STRIPE_BUY_BUTTON_DIAGNOSTIC",
  health_check: "NEXT_PUBLIC_STRIPE_BUY_BUTTON_HEALTH_CHECK",
  quick_connect: "NEXT_PUBLIC_STRIPE_BUY_BUTTON_QUICK_CONNECT",
  integration_audit: "NEXT_PUBLIC_STRIPE_BUY_BUTTON_INTEGRATION_AUDIT",
  user_training: "NEXT_PUBLIC_STRIPE_BUY_BUTTON_USER_TRAINING",
  ongoing_support: "NEXT_PUBLIC_STRIPE_BUY_BUTTON_ONGOING_SUPPORT",
};

export function getBuyButtonId(productId: TradeProductId): string | undefined {
  const key = buyButtonEnvKeys[productId];
  const value = process.env[key];
  if (!value || value.includes("xxxxxxxx")) return undefined;
  return value;
}

export function nameToProductId(name: string): TradeProductId | undefined {
  const normalized = name.toLowerCase().replace(/\s+/g, "_");
  if (normalized in tradeProducts) return normalized as TradeProductId;
  const map: Record<string, TradeProductId> = {
    diagnostic: "diagnostic",
    health_check: "health_check",
    "health check": "health_check",
    quick_connect: "quick_connect",
    "quick connect": "quick_connect",
    integration_audit: "integration_audit",
    "integration audit": "integration_audit",
    user_training_sprint: "user_training",
    "user training sprint": "user_training",
    ongoing_support: "ongoing_support",
    "ongoing support": "ongoing_support",
  };
  return map[normalized] ?? map[name.toLowerCase()];
}