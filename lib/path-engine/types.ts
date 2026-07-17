/** Slice 1 domain types: Path (Job) / Process (WO) / Task / Bucket */

export type Role = "psap" | "advisor" | "admin";

export type PathStatus = "open" | "completed" | "cancelled";
export type ProcessStatus =
  | "not_started"
  | "open"
  | "blocked"
  | "completed"
  | "waived";
export type TaskStatus = "not_started" | "open" | "completed" | "waived";

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
};

export type Psap = {
  id: string;
  name: string;
  county: string;
  code: string;
};

export type Assignment = {
  id: string;
  advisorUserId: string;
  psapId: string;
};

export type BucketDef = {
  code: string;
  label: string;
  sortOrder: number;
  /** Process template codes that must be done to leave this bucket */
  requiredProcessCodes: string[];
};

export type ProcessTemplate = {
  code: string;
  name: string;
  sortOrder: number;
  bucketCode: string;
  etaDays: number;
  toolHref?: string;
  required: boolean;
};

export type TaskTemplate = {
  code: string;
  label: string;
  sortOrder: number;
};

export type PathType = {
  id: string;
  code: string;
  name: string;
  contractProfileId: string;
  version: number;
  buckets: BucketDef[];
  processes: ProcessTemplate[];
  tasksByProcess: Record<string, TaskTemplate[]>;
};

export type Task = {
  id: string;
  processId: string;
  templateCode: string;
  label: string;
  sortOrder: number;
  status: TaskStatus;
  completedAt?: string;
  completedByUserId?: string;
};

export type Process = {
  id: string;
  pathId: string;
  templateCode: string;
  name: string;
  sortOrder: number;
  bucketCode: string;
  status: ProcessStatus;
  required: boolean;
  toolHref?: string;
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  completedByUserId?: string;
  version: number;
};

export type Path = {
  id: string;
  psapId: string;
  pathTypeId: string;
  pathTypeCode: string;
  pathTypeName: string;
  status: PathStatus;
  currentBucketCode: string;
  /** When set, bucket is pinned until reversed */
  overrideBucketCode?: string | null;
  activeOverrideId?: string | null;
  openedAt: string;
  closedAt?: string;
  version: number;
};

export type ActivityEvent = {
  id: string;
  pathId: string;
  processId?: string;
  actorUserId: string;
  actorRole: Role;
  actorName: string;
  kind: string;
  summary: string;
  createdAt: string;
};

export type Override = {
  id: string;
  pathId: string;
  processId?: string;
  fromBucket: string;
  toBucket: string;
  reason: string;
  actorUserId: string;
  actorName: string;
  createdAt: string;
  reversedAt?: string;
  reversedByUserId?: string;
};

export type AuditEvent = {
  id: string;
  actorUserId: string;
  actorRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  createdAt: string;
};

export type OpsSnapshot = {
  users: User[];
  psaps: Psap[];
  assignments: Assignment[];
  pathTypes: PathType[];
  paths: Path[];
  processes: Process[];
  tasks: Task[];
  activity: ActivityEvent[];
  overrides: Override[];
  audit: AuditEvent[];
};

export type Actor = {
  userId: string;
  role: Role;
  displayName: string;
};

export type DashboardMetrics = {
  totalPsapsAssigned: number;
  pathsCompleted: number;
  pathsOpen: number;
  pathsNotCompleted: number;
};

export type BucketCount = {
  pathTypeCode: string;
  pathTypeName: string;
  bucketCode: string;
  bucketLabel: string;
  sortOrder: number;
  count: number;
};

export type PathDetail = {
  path: Path;
  psap: Psap;
  processes: Process[];
  tasks: Task[];
  activity: ActivityEvent[];
  buckets: BucketDef[];
  activeOverride?: Override | null;
};
