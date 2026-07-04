"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { computeMetrics } from "@/lib/selectors";
import { StatCard } from "@/components/dashboard/StatCard";
import { HealthDonut } from "@/components/dashboard/HealthDonut";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Badge";
import { LoadingBlock } from "@/components/ui/States";
import {
  HEALTH_DOT,
  HEALTH_LABEL,
  HEALTH_PILL,
  MILESTONE_PILL,
  MILESTONE_STATUS_LABEL,
} from "@/lib/labels";
import { formatShort, isOverdue } from "@/lib/utils";
import { cn } from "@/lib/utils";

function headerDateLine(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day} · Updated ${time}`;
}

export default function HomeDashboard() {
  const hydrated = useStore((s) => s.hydrated);
  const projects = useStore((s) => s.projects);

  if (!hydrated) return <LoadingBlock />;

  const m = computeMetrics(projects);

  const projectTypes = new Set(projects.map((p) => p.type)).size;
  const overdueProjects = projects.filter((p) =>
    p.tasks.some((t) => t.status !== "done" && isOverdue(t.dueDate)),
  ).length;
  const onTrackPct = m.totalProjects
    ? Math.round((m.green / m.totalProjects) * 100)
    : 0;

  const kpis = [
    { label: "Active Projects", value: m.totalProjects, sub: `Across ${projectTypes} project type${projectTypes === 1 ? "" : "s"}`, tone: "default" as const },
    { label: "On Track", value: m.green, sub: `${onTrackPct}% of portfolio`, tone: "green" as const },
    { label: "At Risk", value: m.amber, sub: m.amber ? "Needs monitoring" : "None flagged", tone: m.amber ? ("amber" as const) : ("default" as const) },
    { label: "Off Track", value: m.red, sub: m.red ? "Escalated" : "None escalated", tone: m.red ? ("red" as const) : ("default" as const) },
    { label: "Overdue Tasks", value: m.overdueTasks, sub: m.overdueTasks ? `Across ${overdueProjects} project${overdueProjects === 1 ? "" : "s"}` : "All current", tone: m.overdueTasks ? ("red" as const) : ("default" as const) },
    { label: "Critical Risks", value: m.criticalRisks, sub: m.criticalRisks ? "High severity open" : "None open", tone: m.criticalRisks ? ("red" as const) : ("default" as const) },
    { label: "Open Issues", value: m.openIssues, sub: m.openIssues ? "Awaiting owners" : "All resolved", tone: "default" as const },
    { label: "Sponsor Decisions", value: m.sponsorDecisions, sub: m.sponsorDecisions ? "Pending sign-off" : "None pending", tone: m.sponsorDecisions ? ("amber" as const) : ("default" as const) },
    { label: "Reports Due", value: m.reportsDue, sub: "This week", tone: "default" as const },
    { label: "Upcoming Milestones", value: m.upcomingMilestones.length, sub: "Next 30 days", tone: "default" as const },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* Page header with date/meta line */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
            Command Center
          </p>
          <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-[28px]">
            Portfolio at a Glance
          </h1>
          <p className="max-w-[560px] text-[14px] leading-[1.6] text-muted-dark">
            Your single view across every project — health, risks, decisions and
            what needs attention today.
          </p>
        </div>
        <div className="shrink-0 whitespace-nowrap pb-1 text-[12.5px] font-medium text-muted">
          {headerDateLine()}
        </div>
      </div>

      {/* KPI grid — 5 × 2 */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} hint={k.sub} tone={k.tone} />
        ))}
      </section>

      {/* Health + Attention */}
      <section className="grid items-stretch gap-4 lg:grid-cols-[380px_1fr]">
        {/* Portfolio Health */}
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-[3px]">
            <div className="text-[15px] font-bold text-navy">Portfolio Health</div>
            <div className="text-[12.5px] text-muted">
              RAG distribution across active projects
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <HealthDonut green={m.green} amber={m.amber} red={m.red} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["green", "amber", "red"] as const).map((h) => (
              <div
                key={h}
                className="flex flex-col items-center gap-1 rounded-[10px] border border-track bg-surface px-2 py-2.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", HEALTH_DOT[h])} />
                  <span className="text-[16px] font-bold text-navy">
                    {h === "green" ? m.green : h === "amber" ? m.amber : m.red}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-muted">
                  {HEALTH_LABEL[h]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects Needing Attention */}
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-[3px]">
              <div className="text-[15px] font-bold text-navy">
                Projects Needing Attention
              </div>
              <div className="text-[12.5px] text-muted">
                Prioritised by health, overdue work, risks and pending decisions
              </div>
            </div>
            <Link
              href="/portfolio"
              className="flex h-8 shrink-0 items-center rounded-[8px] border border-line-input bg-white px-3.5 text-[12.5px] font-semibold text-navy transition-colors hover:bg-surface"
            >
              View portfolio
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            {m.attention.length === 0 ? (
              <p className="border-t border-line-soft py-6 text-[13px] text-muted">
                Nothing needs attention — every project is on track.
              </p>
            ) : (
              m.attention.map(({ project, reasons }) => (
                <Link
                  key={project.id}
                  href={`/project?id=${project.id}`}
                  className="flex flex-1 items-center gap-4 border-t border-line-soft px-1 py-3.5 transition-colors hover:bg-surface"
                >
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      HEALTH_DOT[project.health],
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px] font-semibold text-navy">
                        {project.name}
                      </span>
                      <Pill className={HEALTH_PILL[project.health]}>
                        {HEALTH_LABEL[project.health]}
                      </Pill>
                    </div>
                    <div className="truncate text-[12.5px] text-muted">
                      {reasons.join(" · ")}
                    </div>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-muted-light" />
                </Link>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* Upcoming Milestones — table layout */}
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-[3px]">
            <div className="text-[15px] font-bold text-navy">Upcoming Milestones</div>
            <div className="text-[12.5px] text-muted">
              Across the whole portfolio, next 30 days
            </div>
          </div>
          <Pill className="bg-[#F3F0E7] text-gold-text">
            {m.upcomingMilestones.length} upcoming
          </Pill>
        </div>

        {m.upcomingMilestones.length === 0 ? (
          <p className="border-t border-line-soft py-6 text-[13px] text-muted">
            No milestones due in the next 30 days.
          </p>
        ) : (
          <div>
            {/* Column headers */}
            <div className="grid grid-cols-[72px_1fr_90px] items-center gap-x-5 sm:grid-cols-[96px_1fr_1fr_110px]">
              <div className="py-1.5 text-[10.5px] font-semibold tracking-[0.1em] text-muted-light">
                DATE
              </div>
              <div className="py-1.5 text-[10.5px] font-semibold tracking-[0.1em] text-muted-light">
                MILESTONE
              </div>
              <div className="hidden py-1.5 text-[10.5px] font-semibold tracking-[0.1em] text-muted-light sm:block">
                PROJECT
              </div>
              <div className="py-1.5 text-right text-[10.5px] font-semibold tracking-[0.1em] text-muted-light">
                HEALTH
              </div>
            </div>
            {/* Rows */}
            {m.upcomingMilestones.map(({ project, milestone }) => (
              <Link
                key={milestone.id}
                href={`/project?id=${project.id}`}
                className="grid grid-cols-[72px_1fr_90px] items-center gap-x-5 border-t border-line-soft py-3 transition-colors hover:bg-surface sm:grid-cols-[96px_1fr_1fr_110px]"
              >
                <div className="text-[12.5px] font-semibold text-navy">
                  {formatShort(milestone.dueDate)}
                </div>
                <div className="truncate text-[13.5px] font-medium text-navy">
                  {milestone.name}
                </div>
                <div className="hidden truncate text-[12.5px] text-muted sm:block">
                  {project.name}
                </div>
                <div className="flex justify-end">
                  <Pill className={MILESTONE_PILL[milestone.status]}>
                    {MILESTONE_STATUS_LABEL[milestone.status]}
                  </Pill>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
