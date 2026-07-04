"use client";

import { useState } from "react";
import { Plus, ShieldAlert } from "lucide-react";
import { Project, RaidCategory, RaidImpact, RaidItem, RaidStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/States";
import {
  RAID_CATEGORY_LABEL,
  RAID_CATEGORY_PILL,
  RAID_IMPACT_LABEL,
  RAID_IMPACT_PILL,
  RAID_STATUS_LABEL,
} from "@/lib/labels";
import { cn, todayISO, uid } from "@/lib/utils";

const CATEGORIES: RaidCategory[] = ["risk", "assumption", "issue", "dependency"];
const IMPACTS: RaidImpact[] = ["low", "medium", "high", "critical"];
const STATUSES: RaidStatus[] = ["open", "monitoring", "mitigating", "closed"];

export function RaidTab({ project }: { project: Project }) {
  const addRaid = useStore((s) => s.addRaid);
  const updateRaid = useStore((s) => s.updateRaid);
  const [filter, setFilter] = useState<"all" | RaidCategory>("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    category: "risk" as RaidCategory,
    title: "",
    impact: "medium" as RaidImpact,
    mitigation: "",
  });

  const items = filter === "all" ? project.raid : project.raid.filter((r) => r.category === filter);

  function handleAdd() {
    if (!draft.title.trim()) return;
    const item: RaidItem = {
      id: uid("raid"),
      category: draft.category,
      title: draft.title.trim(),
      impact: draft.impact,
      mitigation: draft.mitigation.trim() || undefined,
      status: "open",
      createdAt: todayISO(),
    };
    addRaid(project.id, item);
    setDraft({ category: "risk", title: "", impact: "medium", mitigation: "" });
    setAdding(false);
  }

  return (
    <Card>
      <CardHeader
        title="RAID Log"
        subtitle="Risks · Assumptions · Issues · Dependencies"
        icon={<ShieldAlert size={16} />}
        action={
          <Button size="sm" onClick={() => setAdding((v) => !v)}>
            <Plus size={16} /> Add Item
          </Button>
        }
      />
      <CardBody className="p-0">
        {adding && (
          <div className="space-y-3 border-b border-line bg-offwhite p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Category">
                <Select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as RaidCategory }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {RAID_CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Impact">
                <Select
                  value={draft.impact}
                  onChange={(e) => setDraft((d) => ({ ...d, impact: e.target.value as RaidImpact }))}
                >
                  {IMPACTS.map((i) => (
                    <option key={i} value={i}>
                      {RAID_IMPACT_LABEL[i]}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="flex items-end">
                <Button size="sm" onClick={handleAdd} className="h-[42px] w-full">
                  Save Item
                </Button>
              </div>
            </div>
            <Field label="Title">
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Describe the risk / issue / dependency…"
                autoFocus
              />
            </Field>
            <Field label="Mitigation / Notes">
              <Textarea
                value={draft.mitigation}
                onChange={(e) => setDraft((d) => ({ ...d, mitigation: e.target.value }))}
                placeholder="How will this be managed?"
              />
            </Field>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
          {(["all", ...CATEGORIES] as const).map((c) => {
            const count = c === "all" ? project.raid.length : project.raid.filter((r) => r.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === c ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:bg-offwhite",
                )}
              >
                {c === "all" ? "All" : RAID_CATEGORY_LABEL[c]} ({count})
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <EmptyState className="m-5 border-0 bg-transparent" title="No items in this view" />
        ) : (
          <ul className="divide-y divide-line-soft">
            {items.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Pill className={RAID_CATEGORY_PILL[r.category]}>
                        {RAID_CATEGORY_LABEL[r.category]}
                      </Pill>
                      <Pill className={RAID_IMPACT_PILL[r.impact]}>{RAID_IMPACT_LABEL[r.impact]} impact</Pill>
                    </div>
                    <p className="text-sm font-medium text-navy">{r.title}</p>
                    {r.mitigation && (
                      <p className="mt-1 text-xs text-muted">
                        <span className="font-semibold">Mitigation:</span> {r.mitigation}
                      </p>
                    )}
                  </div>
                  <select
                    value={r.status}
                    onChange={(e) => updateRaid(project.id, r.id, { status: e.target.value as RaidStatus })}
                    className="cursor-pointer rounded-full border border-line bg-white px-2.5 py-1 text-xs font-semibold text-navy outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {RAID_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
