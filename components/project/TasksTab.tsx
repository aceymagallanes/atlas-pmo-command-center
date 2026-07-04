"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Project, Task, TaskPriority, TaskStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import {
  PRIORITY_LABEL,
  PRIORITY_PILL,
  TASK_STATUS_LABEL,
  TASK_STATUS_PILL,
} from "@/lib/labels";
import { addDays, formatShort, isOverdue, todayISO, uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];
const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];

export function TasksTab({ project }: { project: Project }) {
  const updateTask = useStore((s) => s.updateTask);
  const addTask = useStore((s) => s.addTask);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [due, setDue] = useState(addDays(todayISO(), 7));

  const sorted = [...project.tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    return (a.dueDate || "").localeCompare(b.dueDate || "");
  });

  function handleAdd() {
    if (!title.trim()) return;
    const task: Task = {
      id: uid("task"),
      title: title.trim(),
      status: "todo",
      priority,
      dueDate: due,
      phaseId: project.currentPhaseId,
      createdAt: todayISO(),
    };
    addTask(project.id, task);
    setTitle("");
    setPriority("medium");
    setDue(addDays(todayISO(), 7));
    setAdding(false);
  }

  const done = project.tasks.filter((t) => t.status === "done").length;

  return (
    <Card>
      <CardHeader
        title="Tasks & Milestones"
        subtitle={`${done}/${project.tasks.length} complete`}
        action={
          <Button size="sm" onClick={() => setAdding((v) => !v)}>
            <Plus size={16} /> Add Task
          </Button>
        }
      />
      <CardBody className="p-0">
        {adding && (
          <div className="grid gap-3 border-b border-line bg-offwhite p-4 sm:grid-cols-[1fr_auto_auto_auto]">
            <Field label="Task">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Describe the task…" autoFocus />
            </Field>
            <Field label="Priority">
              <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Due">
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </Field>
            <div className="flex items-end">
              <Button size="sm" onClick={handleAdd} className="h-[42px]">
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Table header */}
        <div className="hidden grid-cols-[1fr_130px_110px_120px] gap-3 border-b border-line px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
          <span>Task</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Due</span>
        </div>

        <ul className="divide-y divide-line-soft">
          {sorted.map((t) => {
            const overdue = t.status !== "done" && isOverdue(t.dueDate);
            return (
              <li
                key={t.id}
                className="grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-[1fr_130px_110px_120px] sm:items-center sm:gap-3"
              >
                <span className={cn("text-sm text-ink", t.status === "done" && "text-muted line-through")}>
                  {t.title}
                </span>
                <select
                  value={t.status}
                  onChange={(e) => updateTask(project.id, t.id, { status: e.target.value as TaskStatus })}
                  className={cn(
                    "w-fit cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-semibold outline-none",
                    TASK_STATUS_PILL[t.status],
                  )}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-white text-ink">
                      {TASK_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <span>
                  <Pill className={PRIORITY_PILL[t.priority]}>{PRIORITY_LABEL[t.priority]}</Pill>
                </span>
                <span className={cn("text-sm", overdue ? "font-semibold text-health-red" : "text-navy")}>
                  {formatShort(t.dueDate)}
                  {overdue && " · overdue"}
                </span>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
