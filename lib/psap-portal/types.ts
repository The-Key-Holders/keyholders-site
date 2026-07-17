export type AdvisorRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  counties: string[];
  notes?: string;
};

export type VendorRecord = {
  id: string;
  name: string;
  models: Array<"cloud" | "onprem" | "pending">;
  status: "placeholder" | "awarded";
  notes?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  body: string;
  date: string;
  tags: string[];
  published: boolean;
};

export type QuestionCategory =
  | "Timing"
  | "Funding"
  | "Contracts"
  | "NG"
  | "Vendor"
  | "Claims"
  | "Residual"
  | "Other";

export type QuestionUrgency = "Routine" | "Time-sensitive" | "Outage-related";

export type QuestionStatus = "new" | "in_progress" | "done";

export type QuestionRecord = {
  id: string;
  ticketId: string;
  psapName: string;
  psapCode: string;
  county: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  category: QuestionCategory;
  urgency: QuestionUrgency;
  question: string;
  status: QuestionStatus;
  createdAt: string;
};

export type PortalDataSnapshot = {
  advisors: AdvisorRecord[];
  vendors: VendorRecord[];
  news: NewsItem[];
  questions: QuestionRecord[];
};

export type CheckStatus = "Ready" | "Needs work" | "Blocked";

export type CheckResult = {
  status: CheckStatus;
  missingRequired: string[];
  missingRecommended: string[];
  notes: string[];
};
