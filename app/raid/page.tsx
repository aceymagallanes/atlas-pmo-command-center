"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { useStore } from "@/lib/store";
import { Project, RaidCategory, RaidItem } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Badge";
import { LoadingBlock, EmptyState } from "@/components/ui/States";
import {
  RAID_CATEGORY_LABEL,
  RAID_CATEGORY_PILL,
  RAID_IMPACT_LABEL,
  RAID_IMPACT_PILL,
  RAID_STATUS_LABEL,
} from "@/lib/labels";
import { cn, formatShort } from "@/lib/utils";

const CATEGORIES: RaidCategory[] = ["risk", "assumption", "issue", "dependency"];

type Entry = { project: Project; item: RaidItem };

/* ---------------------------------------------------------------------------
 * Priority ranking — presentation-only scoring over existing RAID data.
 * ------------------------------------------------------------------------- */
const IMPACT_SCORE = { critical: 40, high: 30, medium: 10, low: 0 } as const;

function priorityReason(item: RaidItem): { label: string; tone: "red" | "amber" } {
  if (item.impact === "critical") return { label: "Critical impact", tone: "red" };
  if (item.category === "issue") return { label: "Open issue", tone: "amber" };
  if (item.category === "dependency") return { label: "Blocking dependency", tone: "amber" };
  if (item.status === "mitigating") return { label: "Needs mitigation", tone: "amber" };
  return { label: "High impact", tone: "amber" };
}

function rankPriority(entries: Entry[]): Entry[] {
  return entries
    .filter(({ item }) => item.status !== "closed")
    .map((e) => {
      let score = IMPACT_SCORE[e.item.impact];
      if (e.item.status === "mitigating") score += 8;
      if (e.item.status === "open") score += 5;
      if (e.item.category === "issue") score += 12;
      if (e.item.category === "dependency" && (e.item.impact === "high" || e.item.impact === "critical")) score += 6;
      return { ...e, score };
    })
    .filter((e) => e.score >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/** Left accent color per severity for priority cards. */
const ACCENT: Record<string, string> = {
  critical: "border-l-health-red",
  high: "border-l-health-amberdot",
  medium: "border-l-line",
  low: "border-l-line",
};

export default function GlobalRaidPage() {
  const hydrated = useStore((s) => s.hydrated);
  const projects = useStore((s) => s.projects);
  const [filter, setFilter] = useState<"all" | RaidCategory>("all");

  // Flatten every project's RAID items into one portfolio-wide list.
  const allItems: Entry[] = useMemo(
    () => projects.flatMap((project) => project.raid.map((item) => ({ project, item }))),
    [projects],
  );
  const priority = useMemo(() => rankPriority(allItems), [allItems]);

  if (!hydrated) return <LoadingBlock />;

  const openRisks = allItems.filter(
    ({ item }) => item.category === "risk" && item.status !== "closed",
  ).length;
  const openIssues = allItems.filter(
    ({ item }) => item.category === "issue" && item.status !== "closed",
  ).length;
  const dependencies = allItems.filter(({ item }) => item.category === "dependency").length;
  const highSeverity = allItems.filter(
    ({ item }) =>
      (item.impact === "high" || item.impact === "critical") && item.status !== "closed",
  ).length;

  const filtered =
    filter === "all" ? allItems : allItems.filter(({ item }) => item.category === filter);

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Portfolio Tools"
        title="RAID Log"
        description="Track risks, assumptions, issues, and dependencies across the portfolio."
      />

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total RAID Items" value={allItems.length} hint="Across all projects" />
        <StatCard label="Open Risks" value={openRisks} tone={openRisks ? "red" : "default"} hint="Not yet closed" />
        <StatCard label="Open Issues" value={openIssues} tone={openIssues ? "amber" : "default"} hint="Not yet closed" />
        <StatCard label="Dependencies" value={dependencies} hint="Tracked portfolio-wide" />
        <StatCard label="High Severity" value={highSeverity} tone={highSeverity ? "red" : "default"} hint="High or critical impact" />
      </section>

      {/* Priority Attention */}
      {priority.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-[3px]">
            <h2 className="text-[15px] font-bold text-navy">Priority Attention</h2>
            <p className="text-[12.5px] text-muted">
              The highest-severity open items across every project — handle these first
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {priority.map(({ project, item }) => {
              const reason = priorityReason(item);
              return (
                <Link
                  key={item.id}
                  href={`/project?id=${project.id}&tab=raid`}
                  className={cn(
                    "group flex flex-col gap-3 rounded-lg border border-line border-l-[3px] bg-white p-5 transition-all hover:border-[#D9D2C4] hover:shadow-hover",
                    ACCENT[item.impact],
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Pill className={RAID_CATEGORY_PILL[item.category]}>
                      {RAID_CATEGORY_LABEL[item.category]}
                    </Pill>
                    <span
                      className={cn(
                        "text-[11px] font-bold uppercase tracking-[0.08em]",
                        reason.tone === "red" ? "text-health-redtext" : "text-gold-text",
                      )}
                    >
                      {reason.label}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="line-clamp-2 min-h-[38px] text-[13.5px] font-semibold leading-snug text-navy group-hover:text-emerald">
                      {item.title}
                    </div>
                    <div className="truncate text-[12px] text-muted">{project.name}</div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line-soft pt-3">
                    <div className="flex gap-1.5">
                      <Pill className={RAID_IMPACT_PILL[item.impact]}>
                        {RAID_IMPACT_LABEL[item.impact]}
                      </Pill>
                      <Pill className="bg-surface text-muted-dark border border-line">
                        {RAID_STATUS_LABEL[item.status]}
                      </Pill>
                    </div>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-muted-light opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All items */}
      <Card className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-[3px]">
            <h2 className="text-[15px] font-bold text-navy">All Items</h2>
            <p className="text-[12.5px] text-muted">
              Click any row to open it in its project workspace
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", ...CATEGORIES] as const).map((c) => {
              const count =
                c === "all"
                  ? allItems.length
                  : allItems.filter(({ item }) => item.category === c).length;
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "rounded-full border px-3.5 py-[6px] text-[12px] font-semibold transition-colors",
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-line bg-white text-muted-dark hover:bg-surface hover:text-navy",
                  )}
                >
                  {c === "all" ? "All" : RAID_CATEGORY_LABEL[c]}{" "}
                  <span className={active ? "text-white/70" : "text-muted-light"}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldAlert size={22} />}
            title="No RAID items found for this filter"
            description="Try a different category, or add items from a project's RAID tab."
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              {/* Column headers */}
              <div className="grid grid-cols-[170px_96px_minmax(240px,1fr)_96px_88px_88px_96px_60px] items-center gap-x-4 pb-1">
                {["PROJECT", "TYPE", "ITEM", "OWNER", "PROBABILITY", "IMPACT", "STATUS", "RAISED"].map((h) => (
                  <div
                    key={h}
                    className="text-[10.5px] font-semibold tracking-[0.1em] text-muted-light"
                  >
                    {h}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {filtered.map(({ project, item }) => (
                <Link
                  key={item.id}
                  href={`/project?id=${project.id}&tab=raid`}
                  className="group grid grid-cols-[170px_96px_minmax(240px,1fr)_96px_88px_88px_96px_60px] items-center gap-x-4 border-t border-line-soft py-3.5 transition-colors hover:bg-surface"
                >
                  <div className="pr-1 text-[12.5px] font-semibold leading-snug text-muted-dark">
                    {project.name}
                  </div>
                  <div>
                    <Pill className={RAID_CATEGORY_PILL[item.category]}>
                      {RAID_CATEGORY_LABEL[item.category]}
                    </Pill>
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="truncate text-[13.5px] font-semibold text-navy group-hover:text-emerald">
                      {item.title}
                    </div>
                    {(item.description || item.mitigation) && (
                      <div className="truncate text-[12px] leading-relaxed text-muted">
                        {item.description ?? item.mitigation}
                      </div>
                    )}
                  </div>
                  <div className="truncate text-[12.5px] text-muted-dark">
                    {item.owner ?? "—"}
                  </div>
                  <div className="text-[12.5px] capitalize text-muted">
                    {item.likelihood ?? "—"}
                  </div>
                  <div>
                    <Pill className={RAID_IMPACT_PILL[item.impact]}>
                      {RAID_IMPACT_LABEL[item.impact]}
                    </Pill>
                  </div>
                  <div>
                    <Pill className="bg-surface text-muted-dark border border-line">
                      {RAID_STATUS_LABEL[item.status]}
                    </Pill>
                  </div>
                  <div className="text-[12px] text-muted">{formatShort(item.createdAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
