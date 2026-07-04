import { Milestone, Project } from "@/lib/types";
import { addDays, isOverdue, mondayOfThisWeek, todayISO } from "@/lib/utils";

export interface PortfolioMetrics {
  totalProjects: number;
  green: number;
  amber: number;
  red: number;
  overdueTasks: number;
  criticalRisks: number;
  openIssues: number;
  sponsorDecisions: number;
  reportsDue: number;
  upcomingMilestones: { project: Project; milestone: Milestone }[];
  attention: { project: Project; reasons: string[] }[];
}

export function projectOverdueTasks(p: Project): number {
  return p.tasks.filter((t) => t.status !== "done" && isOverdue(t.dueDate)).length;
}

export function projectCriticalRisks(p: Project): number {
  return p.raid.filter(
    (r) => r.category === "risk" && r.status !== "closed" && (r.impact === "critical" || r.impact === "high"),
  ).length;
}

export function projectOpenIssues(p: Project): number {
  return p.raid.filter((r) => r.category === "issue" && r.status !== "closed").length;
}

export function projectPendingDecisions(p: Project): number {
  return p.sponsorDecisions.filter((d) => d.status === "pending").length;
}

/** A project needs a status report if none exists for the current week. */
export function reportDueThisWeek(p: Project): boolean {
  const monday = mondayOfThisWeek();
  return !p.statusReports.some((r) => r.weekOf === monday);
}

export function taskProgress(p: Project): number {
  if (!p.tasks.length) return 0;
  const done = p.tasks.filter((t) => t.status === "done").length;
  return Math.round((done / p.tasks.length) * 100);
}

export function currentPhaseName(p: Project): string {
  return p.phases.find((ph) => ph.id === p.currentPhaseId)?.name ?? "—";
}

function attentionReasons(p: Project): string[] {
  const reasons: string[] = [];
  if (p.health === "red") reasons.push("Red health status");
  else if (p.health === "amber") reasons.push("Amber health status");
  const overdue = projectOverdueTasks(p);
  if (overdue) reasons.push(`${overdue} overdue task${overdue === 1 ? "" : "s"}`);
  const crit = projectCriticalRisks(p);
  if (crit) reasons.push(`${crit} critical/high risk${crit === 1 ? "" : "s"}`);
  const dec = projectPendingDecisions(p);
  if (dec) reasons.push(`${dec} sponsor decision${dec === 1 ? "" : "s"} pending`);
  return reasons;
}

export function computeMetrics(projects: Project[]): PortfolioMetrics {
  const horizon = addDays(todayISO(), 30);

  const upcomingMilestones = projects
    .flatMap((project) =>
      project.milestones
        .filter((m) => m.status !== "achieved" && m.dueDate >= todayISO() && m.dueDate <= horizon)
        .map((milestone) => ({ project, milestone })),
    )
    .sort((a, b) => a.milestone.dueDate.localeCompare(b.milestone.dueDate));

  const attention = projects
    .map((project) => ({ project, reasons: attentionReasons(project) }))
    .filter((x) => x.reasons.length > 0)
    .sort((a, b) => rank(b.project) - rank(a.project));

  return {
    totalProjects: projects.length,
    green: projects.filter((p) => p.health === "green").length,
    amber: projects.filter((p) => p.health === "amber").length,
    red: projects.filter((p) => p.health === "red").length,
    overdueTasks: projects.reduce((n, p) => n + projectOverdueTasks(p), 0),
    criticalRisks: projects.reduce((n, p) => n + projectCriticalRisks(p), 0),
    openIssues: projects.reduce((n, p) => n + projectOpenIssues(p), 0),
    sponsorDecisions: projects.reduce((n, p) => n + projectPendingDecisions(p), 0),
    reportsDue: projects.filter(reportDueThisWeek).length,
    upcomingMilestones,
    attention,
  };
}

/** Sort weight so red / risk-heavy projects float to the top of attention. */
function rank(p: Project): number {
  const healthScore = p.health === "red" ? 100 : p.health === "amber" ? 50 : 0;
  return healthScore + projectOverdueTasks(p) * 5 + projectCriticalRisks(p) * 4 + projectPendingDecisions(p) * 3;
}
