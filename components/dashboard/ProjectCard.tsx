import Link from "next/link";
import { Project } from "@/lib/types";
import { Pill } from "@/components/ui/Badge";
import { HEALTH_DOT, HEALTH_LABEL, HEALTH_PILL } from "@/lib/labels";
import {
  currentPhaseName,
  projectCriticalRisks,
  projectOverdueTasks,
  projectPendingDecisions,
  taskProgress,
} from "@/lib/selectors";
import { cn, formatDate } from "@/lib/utils";

/** Progress bar fill per health — the redesign colors the bar by status. */
const BAR: Record<Project["health"], string> = {
  green: "bg-health-green",
  amber: "bg-health-amberdot",
  red: "bg-health-red",
};

function StatTile({ value, label, danger }: { value: number; label: string; danger?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-[10px] border border-track bg-surface px-1.5 py-2.5">
      <span className={cn("text-[15px] font-bold", danger && value ? "text-health-red" : "text-navy")}>
        {value}
      </span>
      <span className="text-[10.5px] font-medium text-muted-light">{label}</span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const progress = taskProgress(project);
  const overdue = projectOverdueTasks(project);
  const risks = projectCriticalRisks(project);
  const decisions = projectPendingDecisions(project);

  return (
    <Link
      href={`/project?id=${project.id}`}
      className="group flex h-full flex-col gap-4 rounded-lg border border-line bg-white p-6 transition-all hover:border-[#D9D2C4] hover:shadow-hover"
    >
      {/* Category + status badge */}
      <div className="flex items-center justify-between gap-3">
        <span className="line-clamp-2 min-h-[15px] text-[10.5px] font-semibold uppercase leading-[1.4] tracking-[0.1em] text-muted-light">
          {project.type}
        </span>
        <Pill className={cn("shrink-0", HEALTH_PILL[project.health])}>
          <span className={cn("h-1.5 w-1.5 rounded-full", HEALTH_DOT[project.health])} />
          {HEALTH_LABEL[project.health]}
        </Pill>
      </div>

      {/* Name + description */}
      <div className="flex flex-col gap-1.5">
        <div className="truncate text-[16.5px] font-bold tracking-[-0.01em] text-navy group-hover:text-emerald">
          {project.name}
        </div>
        <div className="line-clamp-2 min-h-[40px] text-[13px] leading-[1.55] text-muted-dark">
          {project.businessProblem}
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-[7px]">
        <div className="flex justify-between text-[12px] font-semibold">
          <span className="truncate text-muted">{currentPhaseName(project)}</span>
          <span className="shrink-0 pl-2 text-navy">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-track">
          <div
            className={cn("h-full rounded-full", BAR[project.health])}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-auto grid grid-cols-3 gap-2">
        <StatTile value={overdue} label="Overdue" danger />
        <StatTile value={risks} label="Risks" />
        <StatTile value={decisions} label="Decisions" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-line-soft pt-3.5">
        <div className="flex flex-col gap-px">
          <span className="text-[10.5px] font-semibold tracking-[0.08em] text-muted-light">
            GO-LIVE
          </span>
          <span className="text-[13px] font-semibold text-navy">
            {formatDate(project.targetGoLive)}
          </span>
        </div>
        <span className="flex h-8 items-center rounded-[8px] border border-line-input bg-white px-3.5 text-[12.5px] font-semibold text-emerald transition-colors group-hover:border-emerald-tint group-hover:bg-[#F0F6F3]">
          Open project →
        </span>
      </div>
    </Link>
  );
}
