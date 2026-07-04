"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  ShieldAlert,
  Wand2,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Health } from "@/lib/types";
import { LoadingBlock, EmptyState } from "@/components/ui/States";
import { HealthBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { currentPhaseName } from "@/lib/selectors";
import { HEALTH_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { OverviewTab } from "@/components/project/OverviewTab";
import { TasksTab } from "@/components/project/TasksTab";
import { RaidTab } from "@/components/project/RaidTab";
import { MeetingsTab } from "@/components/project/MeetingsTab";
import { ReportsTab } from "@/components/project/ReportsTab";

// Query-param route (/project?id=…&tab=…) instead of a dynamic segment so the
// app can be statically exported for GitHub Pages. Project data itself lives
// client-side, so the id is only ever resolved in the browser.

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "tasks", label: "Tasks & Milestones", icon: ListChecks },
  { key: "raid", label: "RAID Log", icon: ShieldAlert },
  { key: "meetings", label: "Meeting Notes", icon: Wand2 },
  { key: "reports", label: "Status Report", icon: FileText },
];

const HEALTHS: Health[] = ["green", "amber", "red"];

function ProjectWorkspace() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const hydrated = useStore((s) => s.hydrated);
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const updateProject = useStore((s) => s.updateProject);

  const initialTab = searchParams.get("tab") ?? "overview";
  const [tab, setTab] = useState(initialTab);

  if (!hydrated) return <LoadingBlock />;

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been reset. Head back to the portfolio."
        action={
          <Link href="/portfolio">
            <Button>Back to Portfolio</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <Link href="/portfolio" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-emerald">
        <ChevronLeft size={15} /> Portfolio
      </Link>

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 rounded-lg border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow text-muted">{project.type}</p>
            <span className="text-muted">·</span>
            <p className="text-xs font-medium text-navy">{currentPhaseName(project)}</p>
          </div>
          <h1 className="mt-1.5 text-[26px] font-extrabold tracking-tight text-navy sm:text-[30px]">{project.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Health</p>
            <div className="flex gap-1">
              {HEALTHS.map((h) => (
                <button
                  key={h}
                  onClick={() => updateProject(project.id, (p) => ({ ...p, health: h }))}
                  title={`Set ${HEALTH_LABEL[h]}`}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                    h === "green" && "bg-health-green",
                    h === "amber" && "bg-health-amber",
                    h === "red" && "bg-health-red",
                    project.health === h ? "border-navy" : "border-transparent opacity-40",
                  )}
                />
              ))}
            </div>
          </div>
          <HealthBadge health={project.health} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-emerald text-emerald"
                  : "border-transparent text-muted hover:text-navy",
              )}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {tab === "overview" && <OverviewTab project={project} />}
      {tab === "tasks" && <TasksTab project={project} />}
      {tab === "raid" && <RaidTab project={project} />}
      {tab === "meetings" && <MeetingsTab project={project} />}
      {tab === "reports" && <ReportsTab project={project} />}
    </div>
  );
}

// useSearchParams requires a Suspense boundary for static export builds.
export default function ProjectPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ProjectWorkspace />
    </Suspense>
  );
}
