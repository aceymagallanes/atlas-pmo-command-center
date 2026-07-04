import { Phase, ProjectType, Task, TaskPriority } from "@/lib/types";
import { addDays, todayISO, uid } from "@/lib/utils";

interface TaskSeed {
  phase: number; // index into the phase list
  title: string;
  priority: TaskPriority;
  offset: number; // due date offset in days from creation
}

// Common backbone every delivery shares.
const COMMON: TaskSeed[] = [
  { phase: 0, title: "Confirm project charter & scope with sponsor", priority: "high", offset: 3 },
  { phase: 0, title: "Identify and map key stakeholders", priority: "medium", offset: 4 },
  { phase: 0, title: "Establish success metrics & baseline", priority: "high", offset: 5 },
  { phase: 1, title: "Draft solution design document", priority: "high", offset: 10 },
  { phase: 1, title: "Review design with sponsor & stakeholders", priority: "medium", offset: 12 },
  { phase: 3, title: "Plan and execute UAT with business users", priority: "high", offset: 24 },
  { phase: 4, title: "Prepare go-live checklist & rollback plan", priority: "high", offset: 30 },
  { phase: 4, title: "Deliver enablement / training session", priority: "medium", offset: 33 },
];

const BY_TYPE: Record<ProjectType, TaskSeed[]> = {
  "AI Automation": [
    { phase: 0, title: "Document current manual workflow & volumes", priority: "high", offset: 4 },
    { phase: 2, title: "Build initial automation workflow", priority: "high", offset: 16 },
    { phase: 2, title: "Engineer & test prompt / model configuration", priority: "high", offset: 18 },
    { phase: 3, title: "Validate accuracy against sample dataset", priority: "critical", offset: 22 },
  ],
  "CRM Automation": [
    { phase: 1, title: "Map lead lifecycle & automation triggers", priority: "high", offset: 9 },
    { phase: 2, title: "Configure CRM fields, pipelines & workflows", priority: "high", offset: 16 },
    { phase: 2, title: "Integrate CRM with email / forms", priority: "medium", offset: 19 },
    { phase: 3, title: "Migrate and de-duplicate existing records", priority: "high", offset: 23 },
  ],
  "Reporting Automation": [
    { phase: 0, title: "Inventory current reports & data sources", priority: "high", offset: 4 },
    { phase: 1, title: "Design consolidated data model", priority: "high", offset: 11 },
    { phase: 2, title: "Automate data refresh pipeline", priority: "high", offset: 17 },
    { phase: 3, title: "Reconcile automated vs manual figures", priority: "critical", offset: 22 },
  ],
  "Dashboard Implementation": [
    { phase: 0, title: "Define executive KPIs & drill-downs", priority: "high", offset: 4 },
    { phase: 1, title: "Connect and validate data sources", priority: "high", offset: 11 },
    { phase: 2, title: "Build dashboard pages & visuals", priority: "high", offset: 17 },
    { phase: 3, title: "Gather user feedback & refine", priority: "medium", offset: 22 },
  ],
  "Business Process Improvement": [
    { phase: 0, title: "Create current-state process map (SIPOC)", priority: "high", offset: 4 },
    { phase: 1, title: "Run root-cause analysis on key defects", priority: "high", offset: 11 },
    { phase: 2, title: "Design future-state process", priority: "high", offset: 16 },
    { phase: 3, title: "Pilot improved process on one team", priority: "high", offset: 23 },
  ],
  "Software Implementation": [
    { phase: 0, title: "Gather functional & non-functional requirements", priority: "high", offset: 5 },
    { phase: 2, title: "Configure core modules", priority: "high", offset: 16 },
    { phase: 2, title: "Build required integrations", priority: "medium", offset: 19 },
    { phase: 3, title: "Execute end-to-end test cycle", priority: "critical", offset: 24 },
  ],
};

/**
 * Generate starter tasks for a project. The first two tasks are pre-set to
 * `in_progress` so a new project looks alive on the board immediately.
 */
export function generateTasks(type: ProjectType, phases: Phase[]): Task[] {
  const seeds = [...COMMON, ...BY_TYPE[type]].sort((a, b) => a.offset - b.offset);
  const now = todayISO();
  return seeds.map((s, i) => ({
    id: uid("task"),
    title: s.title,
    status: i < 2 ? "in_progress" : "todo",
    priority: s.priority,
    dueDate: addDays(now, s.offset),
    phaseId: phases[Math.min(s.phase, phases.length - 1)]?.id,
    createdAt: now,
  }));
}
