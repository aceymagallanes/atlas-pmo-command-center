import Link from "next/link";
import { Target, Lightbulb, UserRound, Gavel, Flag, FileText, CalendarClock } from "lucide-react";
import { Project } from "@/lib/types";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Badge";
import { PhaseTracker } from "./PhaseTracker";
import {
  projectCriticalRisks,
  projectOpenIssues,
  projectOverdueTasks,
  projectPendingDecisions,
  taskProgress,
} from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { MILESTONE_PILL, MILESTONE_STATUS_LABEL } from "@/lib/labels";

export function OverviewTab({ project }: { project: Project }) {
  const progress = taskProgress(project);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* Problem & outcome */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardBody>
              <div className="mb-2 flex items-center gap-2 text-emerald">
                <Target size={16} />
                <span className="eyebrow">Business Problem</span>
              </div>
              <p className="text-sm leading-relaxed text-ink">{project.businessProblem}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="mb-2 flex items-center gap-2 text-emerald">
                <Lightbulb size={16} />
                <span className="eyebrow">Desired Outcome</span>
              </div>
              <p className="text-sm leading-relaxed text-ink">{project.desiredOutcome}</p>
            </CardBody>
          </Card>
        </div>

        {/* Phases */}
        <Card>
          <CardHeader title="Delivery Phases" subtitle="Current progress through the lifecycle" />
          <CardBody>
            <PhaseTracker phases={project.phases} />
          </CardBody>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader title="Milestones" icon={<CalendarClock size={16} />} />
          <CardBody className="p-0">
            <ul className="divide-y divide-line-soft">
              {project.milestones.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Flag size={15} className="text-emerald" />
                    <span className="font-medium text-navy">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pill className={MILESTONE_PILL[m.status]}>{MILESTONE_STATUS_LABEL[m.status]}</Pill>
                    <span className="text-sm font-medium text-navy">{formatDate(m.dueDate)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Sponsor decisions needed */}
        <Card>
          <CardHeader title="Sponsor Decisions Needed" icon={<Gavel size={16} />} />
          <CardBody className="p-0">
            {project.sponsorDecisions.filter((d) => d.status === "pending").length === 0 ? (
              <p className="px-5 py-4 text-sm text-muted">No sponsor decisions pending.</p>
            ) : (
              <ul className="divide-y divide-line-soft">
                {project.sponsorDecisions
                  .filter((d) => d.status === "pending")
                  .map((d) => (
                    <li key={d.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-navy">{d.title}</p>
                      <p className="text-xs text-muted">Requested {formatDate(d.requestedOn)}</p>
                    </li>
                  ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Right rail */}
      <div className="space-y-5">
        {/* Sponsor */}
        <Card>
          <CardHeader title="Sponsor" icon={<UserRound size={16} />} />
          <CardBody>
            <p className="font-semibold text-navy">{project.sponsorName}</p>
            {project.sponsorEmail && (
              <a href={`mailto:${project.sponsorEmail}`} className="text-sm text-emerald hover:underline">
                {project.sponsorEmail}
              </a>
            )}
            <div className="mt-4 border-t border-line pt-3 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted">Type</span>
                <span className="font-medium text-navy">{project.type}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Go-live</span>
                <span className="font-medium text-navy">{formatDate(project.targetGoLive)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Progress</span>
                <span className="font-medium text-navy">{progress}%</span>
              </div>
            </div>
            {project.constraints && (
              <div className="mt-3 rounded-sm bg-offwhite p-3 text-xs text-muted">
                <span className="font-semibold text-navy">Constraints: </span>
                {project.constraints}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick stats */}
        <Card>
          <CardHeader title="Health Signals" />
          <CardBody className="grid grid-cols-2 gap-3">
            <Stat label="Overdue tasks" value={projectOverdueTasks(project)} danger />
            <Stat label="Critical risks" value={projectCriticalRisks(project)} danger />
            <Stat label="Open issues" value={projectOpenIssues(project)} />
            <Stat label="Decisions" value={projectPendingDecisions(project)} />
          </CardBody>
        </Card>

        {/* Stakeholders */}
        <Card>
          <CardHeader title="Stakeholders" />
          <CardBody className="p-0">
            <ul className="divide-y divide-line-soft">
              {project.stakeholders.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy">{s.name}</p>
                    <p className="truncate text-xs text-muted">{s.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Link
          href={`/project?id=${project.id}&tab=reports`}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-tint bg-emerald-soft py-3 text-sm font-semibold text-emerald-deep hover:bg-emerald-tint"
        >
          <FileText size={16} /> Generate weekly status report
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className="rounded-sm bg-offwhite p-3">
      <div className={`font-head text-2xl font-bold ${danger && value ? "text-health-red" : "text-navy"}`}>
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
