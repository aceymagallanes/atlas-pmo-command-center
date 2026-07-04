"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { NewProjectInput, PROJECT_TYPES } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { cn, todayISO } from "@/lib/utils";

const STEPS = ["Project Basics", "Sponsor & Timeline", "Context & Review"];

const empty: NewProjectInput = {
  name: "",
  type: "AI Automation",
  businessProblem: "",
  desiredOutcome: "",
  sponsorName: "",
  sponsorEmail: "",
  targetGoLive: "",
  knownStakeholders: "",
  constraints: "",
};

export default function NewProjectWizard() {
  const router = useRouter();
  const addProject = useStore((s) => s.addProject);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<NewProjectInput>(empty);
  const [submitting, setSubmitting] = useState(false);

  const set = (patch: Partial<NewProjectInput>) => setData((d) => ({ ...d, ...patch }));

  const step0Valid = data.name.trim() && data.businessProblem.trim() && data.desiredOutcome.trim();
  const step1Valid = data.sponsorName.trim() && data.targetGoLive;
  const canNext = step === 0 ? step0Valid : step === 1 ? step1Valid : true;

  function handleCreate() {
    setSubmitting(true);
    const project = addProject(data);
    router.push(`/project?id=${project.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Start New Project"
        title="Create a Project"
        description="Answer a few questions and Atlas will generate starter phases, tasks, RAID items and stakeholder records automatically."
      />

      {/* Stepper */}
      <div className="mb-6 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  i < step
                    ? "bg-emerald text-white"
                    : i === step
                      ? "bg-navy text-white"
                      : "bg-white text-muted border border-line",
                )}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  i === step ? "text-navy" : "text-muted",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-3 h-px flex-1", i < step ? "bg-emerald" : "bg-line")} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardBody className="space-y-5">
          {step === 0 && (
            <>
              <Field label="Project Name" required>
                <Input
                  value={data.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="e.g. Sales Ops AI Assistant"
                  autoFocus
                />
              </Field>
              <Field label="Project Type" required hint="Drives which starter tasks and RAID items are generated.">
                <Select value={data.type} onChange={(e) => set({ type: e.target.value as NewProjectInput["type"] })}>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Business Problem" required hint="What pain are we solving?">
                <Textarea
                  value={data.businessProblem}
                  onChange={(e) => set({ businessProblem: e.target.value })}
                  placeholder="The team spends 12+ hours a week manually…"
                />
              </Field>
              <Field label="Desired Outcome" required hint="What does success look like?">
                <Textarea
                  value={data.desiredOutcome}
                  onChange={(e) => set({ desiredOutcome: e.target.value })}
                  placeholder="An automated workflow that cuts response time from hours to minutes."
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Sponsor Name" required>
                  <Input
                    value={data.sponsorName}
                    onChange={(e) => set({ sponsorName: e.target.value })}
                    placeholder="Maria Santos"
                    autoFocus
                  />
                </Field>
                <Field label="Sponsor Email">
                  <Input
                    type="email"
                    value={data.sponsorEmail}
                    onChange={(e) => set({ sponsorEmail: e.target.value })}
                    placeholder="maria.santos@company.com"
                  />
                </Field>
              </div>
              <Field label="Target Go-Live Date" required>
                <Input
                  type="date"
                  min={todayISO()}
                  value={data.targetGoLive}
                  onChange={(e) => set({ targetGoLive: e.target.value })}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label="Known Stakeholders"
                hint="One per line. Optionally add a role: “David Chen - Head of Sales”."
              >
                <Textarea
                  value={data.knownStakeholders}
                  onChange={(e) => set({ knownStakeholders: e.target.value })}
                  placeholder={"David Chen - Head of Sales\nPriya Nair - RevOps Lead"}
                />
              </Field>
              <Field label="Known Constraints" hint="Budget, deadlines, systems, compliance…">
                <Textarea
                  value={data.constraints}
                  onChange={(e) => set({ constraints: e.target.value })}
                  placeholder="Must integrate with existing HubSpot. No PII to third parties."
                />
              </Field>

              <div className="rounded-sm border border-emerald-tint bg-emerald-soft p-4">
                <div className="flex items-center gap-2 text-emerald-deep">
                  <Sparkles size={16} />
                  <p className="text-sm font-semibold">On create, Atlas will generate:</p>
                </div>
                <ul className="mt-2 grid gap-1 text-sm text-emerald-deep/90 sm:grid-cols-2">
                  <li>• 5 delivery phases</li>
                  <li>• ~12 starter tasks for {data.type}</li>
                  <li>• Starter RAID log</li>
                  <li>• Stakeholder records</li>
                  <li>• Design + go-live milestones</li>
                  <li>• Live dashboard entry</li>
                </ul>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft size={16} /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button variant="gold" onClick={handleCreate} disabled={submitting}>
            <Sparkles size={16} /> {submitting ? "Generating…" : "Create Project"}
          </Button>
        )}
      </div>
    </div>
  );
}
