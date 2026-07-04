import { Health, Project, StatusReport } from "@/lib/types";
import { isOverdue, mondayOfThisWeek, todayISO, uid } from "@/lib/utils";

// ============================================================================
// MOCK AI — Weekly Status Report Generator
// ----------------------------------------------------------------------------
// Template + rules engine that turns live project data into an executive-ready
// report. Swap the body for a Claude API call (feed it the project JSON and
// ask for the same StatusReport shape) when you want richer narrative prose.
// See docs/ARCHITECTURE.md → "AI-ready architecture".
// ============================================================================

function worstHealth(...items: Health[]): Health {
  if (items.includes("red")) return "red";
  if (items.includes("amber")) return "amber";
  return "green";
}

export async function generateStatusReport(project: Project): Promise<StatusReport> {
  await new Promise((r) => setTimeout(r, 600));

  const now = todayISO();
  const doneTasks = project.tasks.filter((t) => t.status === "done");
  const activeTasks = project.tasks.filter((t) => t.status === "in_progress");
  const upcoming = project.tasks
    .filter((t) => t.status === "todo" || t.status === "in_progress")
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 5);

  const overdue = project.tasks.filter(
    (t) => t.status !== "done" && isOverdue(t.dueDate),
  );
  const blocked = project.tasks.filter((t) => t.status === "blocked");

  const openRisks = project.raid.filter(
    (r) => r.category === "risk" && r.status !== "closed",
  );
  const criticalRisks = openRisks.filter(
    (r) => r.impact === "critical" || r.impact === "high",
  );
  const openIssues = project.raid.filter(
    (r) => r.category === "issue" && r.status !== "closed",
  );
  const pendingDecisions = project.sponsorDecisions.filter(
    (d) => d.status === "pending",
  );

  const currentPhase =
    project.phases.find((p) => p.id === project.currentPhaseId)?.name ??
    "In delivery";

  // ---- Derive RAG sub-statuses from real signals ----
  const timelineStatus: Health = overdue.length
    ? overdue.length > 2
      ? "red"
      : "amber"
    : "green";
  const scopeStatus: Health = pendingDecisions.length ? "amber" : "green";
  const budgetStatus: Health = "green"; // no cost model in MVP
  // Anchor the headline status to the PM-set health and the schedule, so the
  // report never contradicts the project card. Risks surface in their own
  // section rather than forcing the overall RAG down.
  const riskStatus: Health = criticalRisks.some((r) => r.impact === "critical")
    ? "amber"
    : "green";
  const overallStatus = worstHealth(project.health, timelineStatus, riskStatus);

  const executiveSummary =
    `${project.name} is currently in the "${currentPhase}" phase. ` +
    `${doneTasks.length} task${doneTasks.length === 1 ? "" : "s"} complete and ` +
    `${activeTasks.length} in progress. ` +
    (overdue.length
      ? `${overdue.length} task${overdue.length === 1 ? " is" : "s are"} overdue and need${overdue.length === 1 ? "s" : ""} attention. `
      : `The schedule is on track. `) +
    (criticalRisks.length
      ? `${criticalRisks.length} high/critical risk${criticalRisks.length === 1 ? "" : "s"} being actively managed.`
      : `No high-severity risks are open.`);

  return {
    id: uid("rpt"),
    weekOf: mondayOfThisWeek(),
    overallStatus,
    executiveSummary,
    completedThisWeek: doneTasks.length
      ? doneTasks.map((t) => t.title)
      : ["Project mobilisation and planning underway."],
    plannedNextWeek: upcoming.map((t) => t.title),
    timelineStatus,
    scopeStatus,
    budgetStatus,
    keyRisks: criticalRisks.length
      ? criticalRisks.map((r) => `${r.title} (${r.impact} impact)`)
      : openRisks.slice(0, 3).map((r) => r.title),
    openIssues: openIssues.map((i) => i.title),
    decisionsNeeded: pendingDecisions.length
      ? pendingDecisions.map((d) => d.title)
      : scopeStatus === "amber"
        ? ["Confirm scope boundaries for the current phase."]
        : [],
    sponsorSupportRequired: buildSponsorAsks(
      pendingDecisions.length,
      blocked.length,
      criticalRisks.length,
    ),
    recommendedNextActions: buildNextActions(overdue.length, blocked.length, upcoming.length),
    createdAt: now,
  };
}

function buildSponsorAsks(decisions: number, blocked: number, risks: number): string[] {
  const asks: string[] = [];
  if (decisions) asks.push(`Provide decisions on ${decisions} pending item${decisions === 1 ? "" : "s"}.`);
  if (blocked) asks.push(`Help unblock ${blocked} stalled task${blocked === 1 ? "" : "s"}.`);
  if (risks) asks.push("Endorse mitigation approach for key risks.");
  if (!asks.length) asks.push("No sponsor action required this week — for visibility only.");
  return asks;
}

function buildNextActions(overdue: number, blocked: number, upcoming: number): string[] {
  const actions: string[] = [];
  if (overdue) actions.push(`Re-baseline or close ${overdue} overdue task${overdue === 1 ? "" : "s"}.`);
  if (blocked) actions.push(`Escalate and clear ${blocked} blocker${blocked === 1 ? "" : "s"}.`);
  if (upcoming) actions.push("Progress the next milestone deliverables.");
  actions.push("Confirm attendance for next steering review.");
  return actions;
}
