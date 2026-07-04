// ============================================================================
// Atlas PMO Command Center — Domain Model
// Framework-free types shared across UI, state, data and AI layers.
// ============================================================================

export type ProjectType =
  | "AI Automation"
  | "CRM Automation"
  | "Reporting Automation"
  | "Dashboard Implementation"
  | "Business Process Improvement"
  | "Software Implementation";

export const PROJECT_TYPES: ProjectType[] = [
  "AI Automation",
  "CRM Automation",
  "Reporting Automation",
  "Dashboard Implementation",
  "Business Process Improvement",
  "Software Implementation",
];

/** RAG (Red / Amber / Green) health status used across the portfolio. */
export type Health = "green" | "amber" | "red";

export type PhaseStatus = "not_started" | "in_progress" | "complete";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export type MilestoneStatus =
  | "on_track"
  | "at_risk"
  | "slipped"
  | "achieved";

export type RaidCategory = "risk" | "assumption" | "issue" | "dependency";
export type RaidStatus = "open" | "monitoring" | "mitigating" | "closed";
export type RaidImpact = "low" | "medium" | "high" | "critical";

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email?: string;
  influence: "low" | "medium" | "high";
}

export interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner?: string;
  dueDate?: string; // ISO date
  phaseId?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string; // ISO date
  status: MilestoneStatus;
}

export interface RaidItem {
  id: string;
  category: RaidCategory;
  title: string;
  description?: string;
  impact: RaidImpact;
  likelihood?: "low" | "medium" | "high";
  status: RaidStatus;
  owner?: string;
  mitigation?: string;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  title: string;
  owner?: string;
  dueDate?: string;
}

/** Structured output of the Meeting Notes Assistant (mock AI today). */
export interface MeetingExtract {
  summary: string;
  actionItems: ActionItem[];
  risks: string[];
  issues: string[];
  decisions: string[];
  escalations: string[];
}

export interface MeetingNote {
  id: string;
  title: string;
  date: string; // ISO date
  rawNotes: string;
  extract: MeetingExtract;
  createdAt: string;
}

export interface StatusReport {
  id: string;
  weekOf: string; // ISO date (Monday of the reporting week)
  overallStatus: Health;
  executiveSummary: string;
  completedThisWeek: string[];
  plannedNextWeek: string[];
  timelineStatus: Health;
  scopeStatus: Health;
  budgetStatus: Health;
  keyRisks: string[];
  openIssues: string[];
  decisionsNeeded: string[];
  sponsorSupportRequired: string[];
  recommendedNextActions: string[];
  createdAt: string;
}

export interface SponsorDecision {
  id: string;
  title: string;
  context?: string;
  requestedOn: string;
  status: "pending" | "approved" | "rejected";
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  businessProblem: string;
  desiredOutcome: string;
  sponsorName: string;
  sponsorEmail: string;
  targetGoLive: string; // ISO date
  constraints?: string;
  health: Health;
  currentPhaseId: string;
  createdAt: string;

  stakeholders: Stakeholder[];
  phases: Phase[];
  tasks: Task[];
  milestones: Milestone[];
  raid: RaidItem[];
  meetingNotes: MeetingNote[];
  statusReports: StatusReport[];
  sponsorDecisions: SponsorDecision[];
}

// ---------------------------------------------------------------------------
// Wizard input (subset the PM fills in the Start New Project flow).
// ---------------------------------------------------------------------------
export interface NewProjectInput {
  name: string;
  type: ProjectType;
  businessProblem: string;
  desiredOutcome: string;
  sponsorName: string;
  sponsorEmail: string;
  targetGoLive: string;
  knownStakeholders: string; // free text, one per line
  constraints: string;
}
