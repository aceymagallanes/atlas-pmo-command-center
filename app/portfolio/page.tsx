"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/Button";
import { LoadingBlock, EmptyState } from "@/components/ui/States";
import { Health } from "@/lib/types";
import { HEALTH_DOT, HEALTH_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

type Filter = "all" | Health;

export default function PortfolioPage() {
  const hydrated = useStore((s) => s.hydrated);
  const projects = useStore((s) => s.projects);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.health === filter)),
    [projects, filter],
  );

  if (!hydrated) return <LoadingBlock />;

  const counts: Record<Health, number> = {
    green: projects.filter((p) => p.health === "green").length,
    amber: projects.filter((p) => p.health === "amber").length,
    red: projects.filter((p) => p.health === "red").length,
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header with RAG filter pills */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
            Portfolio
          </p>
          <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-[28px]">
            All Projects
          </h1>
          <p className="text-[14px] leading-[1.6] text-muted-dark">
            {projects.length} active project{projects.length === 1 ? "" : "s"} across
            the portfolio. Click any card to open its workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-[5px] text-[12px] font-semibold transition-colors",
              filter === "all"
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-muted-dark hover:bg-surface",
            )}
          >
            All ({projects.length})
          </button>
          {(["green", "amber", "red"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setFilter(filter === h ? "all" : h)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-[5px] text-[12px] font-semibold transition-colors",
                filter === h
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-muted-dark hover:bg-surface",
              )}
            >
              <span className={cn("h-[7px] w-[7px] rounded-full", HEALTH_DOT[h])} />
              {counts[h]} {HEALTH_LABEL[h]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={22} />}
          title={projects.length ? "No projects match this filter" : "No projects yet"}
          description={
            projects.length
              ? "Try a different health filter."
              : "Create your first project to populate the command center."
          }
          action={
            <Link href="/projects/new">
              <Button>
                <Plus size={16} /> Start New Project
              </Button>
            </Link>
          }
        />
      ) : (
        <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </section>
      )}
    </div>
  );
}
