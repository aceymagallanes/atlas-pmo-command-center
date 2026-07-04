"use client";

import { useState } from "react";
import { Database, Sparkles, ShieldCheck, RotateCcw, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Pill } from "@/components/ui/Badge";
import { LoadingBlock } from "@/components/ui/States";

export default function SettingsPage() {
  const hydrated = useStore((s) => s.hydrated);
  const projects = useStore((s) => s.projects);
  const reset = useStore((s) => s.reset);
  const [confirming, setConfirming] = useState(false);
  const [name, setName] = useState("Acey Magallanes");
  const [role, setRole] = useState("PMO / Transformation Lead");

  if (!hydrated) return <LoadingBlock />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Settings"
        title="Workspace Settings"
        description="Manage your profile, demo data and the roadmap toward production integrations."
      />

      {/* Profile */}
      <Card className="mb-5">
        <CardHeader title="PM Profile" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role">
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
        </CardBody>
      </Card>

      {/* Data */}
      <Card className="mb-5">
        <CardHeader title="Demo Data" icon={<Database size={16} />} subtitle="Stored locally in your browser" />
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between rounded-sm bg-offwhite p-4">
            <div>
              <p className="text-sm font-semibold text-navy">{projects.length} projects in this workspace</p>
              <p className="text-xs text-muted">
                Persisted to <code className="rounded bg-white px-1">localStorage</code> — survives refresh, private to this browser.
              </p>
            </div>
            {!confirming ? (
              <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
                <RotateCcw size={15} /> Reset demo data
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    reset();
                    setConfirming(false);
                  }}
                >
                  Confirm reset
                </Button>
                <Button size="sm" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted">
            Resetting restores the five sample projects and discards anything you created in this session.
          </p>
        </CardBody>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader title="Production Roadmap" icon={<Sparkles size={16} />} subtitle="Architected now, activated later" />
        <CardBody className="space-y-3">
          <RoadmapRow
            icon={<Database size={16} />}
            title="Supabase persistence"
            desc="Swap the localStorage repository for Supabase — the UI never changes."
          />
          <RoadmapRow
            icon={<Sparkles size={16} />}
            title="Claude AI integration"
            desc="Replace the mock meeting-notes and report functions with the Claude API."
          />
          <RoadmapRow
            icon={<ShieldCheck size={16} />}
            title="Authentication & multi-tenant"
            desc="Add sign-in and per-organisation workspaces for real client access."
          />
          <RoadmapRow
            icon={<Palette size={16} />}
            title="AceLiora brand system"
            desc="Emerald / navy / gold palette, Playfair + Montserrat — already applied."
            done
          />
        </CardBody>
      </Card>
    </div>
  );
}

function RoadmapRow({
  icon,
  title,
  desc,
  done,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-sm border border-line p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-emerald-soft text-emerald">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-navy">{title}</p>
          <Pill className={done ? "bg-emerald-soft text-emerald-deep border border-emerald-tint" : "bg-slate-100 text-slate-600 border border-slate-200"}>
            {done ? "Done" : "Planned"}
          </Pill>
        </div>
        <p className="text-xs text-muted">{desc}</p>
      </div>
    </div>
  );
}
