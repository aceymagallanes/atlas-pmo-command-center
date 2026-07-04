"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, FileText, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { Project, StatusReport } from "@/lib/types";
import { generateStatusReport } from "@/lib/ai/generateStatusReport";
import {
  projectCriticalRisks,
  projectOverdueTasks,
  projectPendingDecisions,
  reportDueThisWeek,
} from "@/lib/selectors";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { HealthBadge, Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingBlock, EmptyState } from "@/components/ui/States";
import { cn, formatDate, formatShort } from "@/lib/utils";

/** One-line "why this report is due" from existing project signals. */
function dueReason(project: Project): string {
  const parts: string[] = [];
  parts.push(project.statusReports.length === 0 ? "No report yet" : "Due this week");
  const overdue = projectOverdueTasks(project);
  const risks = projectCriticalRisks(project);
  const decisions = projectPendingDecisions(project);
  if (overdue) parts.push(`${overdue} overdue task${overdue === 1 ? "" : "s"}`);
  if (risks) parts.push(`${risks} high risk${risks === 1 ? "" : "s"}`);
  if (decisions) parts.push(`${decisions} decision${decisions === 1 ? "" : "s"} pending`);
  return parts.join(" · ");
}

export default function GlobalReportsPage() {
  const hydrated = useStore((s) => s.hydrated);
  const projects = useStore((s) => s.projects);
  const addStatusReport = useStore((s) => s.addStatusReport);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!hydrated) return <LoadingBlock />;

  const dueThisWeek = projects.filter(reportDueThisWeek);
  const totalReports = projects.reduce((n, p) => n + p.statusReports.length, 0);
  const missingUpdates = projects.filter((p) => p.statusReports.length === 0);
  const decisionsPending = projects.reduce(
    (n, p) => n + p.sponsorDecisions.filter((d) => d.status === "pending").length,
    0,
  );

  // All reports across the portfolio, newest first.
  const allReports: { project: Project; report: StatusReport }[] = projects
    .flatMap((project) => project.statusReports.map((report) => ({ project, report })))
    .sort(
      (a, b) =>
        b.report.weekOf.localeCompare(a.report.weekOf) ||
        b.report.createdAt.localeCompare(a.report.createdAt),
    );

  async function handleGenerate(project: Project) {
    setGeneratingId(project.id);
    const report = await generateStatusReport(project);
    addStatusReport(project.id, report);
    setGeneratingId(null);
    setExpandedId(report.id);
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Portfolio Tools"
        title="Status Reports"
        description="Generate and review executive-ready project updates."
      />

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Reports Due" value={dueThisWeek.length} tone={dueThisWeek.length ? "amber" : "default"} hint="This week" />
        <StatCard label="Reports Generated" value={totalReports} hint="Across all projects" />
        <StatCard label="Missing Updates" value={missingUpdates.length} tone={missingUpdates.length ? "red" : "default"} hint="No report yet" />
        <StatCard label="Sponsor Decisions" value={decisionsPending} tone={decisionsPending ? "amber" : "default"} hint="Pending sign-off" />
      </section>

      {/* Due this week — report action queue */}
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-[3px]">
            <h2 className="text-[15px] font-bold text-navy">Due This Week</h2>
            <p className="text-[12.5px] text-muted">
              Projects without a status report for the current week — your reporting queue
            </p>
          </div>
          {dueThisWeek.length > 0 && (
            <Pill className="bg-gold-soft text-gold-text">
              {dueThisWeek.length} to do
            </Pill>
          )}
        </div>
        {dueThisWeek.length === 0 ? (
          <p className="border-t border-line-soft py-5 text-[13px] text-muted">
            All caught up — every project has a report for this week.
          </p>
        ) : (
          <div className="flex flex-col">
            {dueThisWeek.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-3 border-t border-line-soft py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/project?id=${project.id}`}
                      className="truncate text-[14px] font-semibold text-navy hover:text-emerald"
                    >
                      {project.name}
                    </Link>
                    <HealthBadge health={project.health} />
                  </div>
                  <p className="text-[12.5px] text-muted">{dueReason(project)}</p>
                </div>
                <div className="shrink-0">
                  <Button
                    size="xs"
                    onClick={() => handleGenerate(project)}
                    disabled={generatingId !== null}
                  >
                    <Sparkles size={14} />
                    {generatingId === project.id ? "Generating…" : "Generate report"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* All reports — executive report library */}
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-[3px]">
          <h2 className="text-[15px] font-bold text-navy">All Reports</h2>
          <p className="text-[12.5px] text-muted">
            {totalReports
              ? `${totalReports} report${totalReports === 1 ? "" : "s"} across the portfolio — click a row to expand the full report`
              : "The portfolio report library"}
          </p>
        </div>

        {allReports.length === 0 ? (
          <EmptyState
            icon={<FileText size={22} />}
            title="No status reports generated yet"
            description="Generate the first one from the queue above, or from any project's Status Report tab."
          />
        ) : (
          <div className="flex flex-col">
            {allReports.map(({ project, report }) => {
              const expanded = expandedId === report.id;
              return (
                <div key={report.id} className="border-t border-line-soft">
                  <button
                    onClick={() => setExpandedId(expanded ? null : report.id)}
                    className={cn(
                      "flex w-full items-start gap-4 py-4 text-left transition-colors",
                      !expanded && "hover:bg-surface",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[14px] font-semibold text-navy">
                          {project.name}
                        </span>
                        <HealthBadge health={report.overallStatus} />
                        <span className="text-[12px] font-medium text-muted-light">
                          Week of {formatDate(report.weekOf)}
                        </span>
                      </div>
                      <p className={cn("text-[13px] leading-relaxed text-muted-dark", !expanded && "line-clamp-1")}>
                        {report.executiveSummary}
                      </p>
                      {!expanded && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
                          <span>Generated {formatShort(report.createdAt)}</span>
                          {report.keyRisks.length > 0 && (
                            <span>{report.keyRisks.length} key risk{report.keyRisks.length === 1 ? "" : "s"}</span>
                          )}
                          {report.decisionsNeeded.length > 0 && (
                            <span className="font-medium text-gold-text">
                              {report.decisionsNeeded.length} decision{report.decisionsNeeded.length === 1 ? "" : "s"} needed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="mt-0.5 shrink-0 rounded-full border border-line bg-white p-1.5 text-muted-light">
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </button>

                  {expanded && (
                    <div className="flex flex-col gap-4 pb-6">
                      <div className="grid gap-3 md:grid-cols-2">
                        <ReportSection title="Completed This Week" items={report.completedThisWeek} />
                        <ReportSection title="Planned Next Week" items={report.plannedNextWeek} />
                        <ReportSection title="Key Risks" items={report.keyRisks} tone="red" />
                        <ReportSection title="Open Issues" items={report.openIssues} tone="red" />
                        <ReportSection title="Decisions Needed" items={report.decisionsNeeded} tone="amber" />
                        <ReportSection title="Sponsor Support Required" items={report.sponsorSupportRequired} tone="amber" />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[12px] text-muted">
                          Generated {formatShort(report.createdAt)}
                        </span>
                        <Link
                          href={`/project?id=${project.id}&tab=reports`}
                          className="text-[12.5px] font-semibold text-emerald hover:underline"
                        >
                          Open in project workspace →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/** Expanded-report section rendered as a soft tile, not a wall of text. */
function ReportSection({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "red" | "amber";
}) {
  return (
    <div className="rounded-[10px] border border-track bg-surface p-4">
      <h4
        className={cn(
          "mb-2 text-[11px] font-bold uppercase tracking-[0.08em]",
          tone === "red" ? "text-health-redtext" : tone === "amber" ? "text-gold-text" : "text-navy",
        )}
      >
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-[12.5px] text-muted">— None —</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-snug text-ink">
              <span
                className={cn(
                  "shrink-0",
                  tone === "red" ? "text-health-red" : tone === "amber" ? "text-gold-text" : "text-emerald",
                )}
              >
                •
              </span>
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
