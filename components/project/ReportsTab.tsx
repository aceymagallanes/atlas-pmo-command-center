"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Check } from "lucide-react";
import { Project, StatusReport } from "@/lib/types";
import { useStore } from "@/lib/store";
import { generateStatusReport } from "@/lib/ai/generateStatusReport";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HealthBadge } from "@/components/ui/Badge";
import { HEALTH_LABEL } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export function ReportsTab({ project }: { project: Project }) {
  const addStatusReport = useStore((s) => s.addStatusReport);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<StatusReport | null>(project.statusReports[0] ?? null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setBusy(true);
    const r = await generateStatusReport(project);
    setReport(r);
    addStatusReport(project.id, r);
    setBusy(false);
  }

  function handleCopy() {
    if (!report) return;
    navigator.clipboard.writeText(reportToText(project, report));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Weekly Status Report Generator"
          subtitle="Executive-ready, generated from live project data"
          icon={<FileText size={16} />}
          action={
            <div className="flex gap-2">
              {report && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
                </Button>
              )}
              <Button size="sm" onClick={handleGenerate} disabled={busy}>
                <Sparkles size={16} /> {busy ? "Generating…" : report ? "Regenerate" : "Generate Report"}
              </Button>
            </div>
          }
        />
        <CardBody>
          {!report && !busy && (
            <p className="py-10 text-center text-sm text-muted">
              Click <span className="font-semibold text-navy">Generate Report</span> to build this week&apos;s
              executive status update from the project&apos;s tasks, risks, issues and decisions.
            </p>
          )}
          {busy && (
            <div className="flex flex-col items-center gap-3 py-10 text-muted">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-emerald" />
              <p className="text-sm">Assembling executive report…</p>
            </div>
          )}
          {report && !busy && <ReportView project={project} report={report} />}
        </CardBody>
      </Card>

      {project.statusReports.length > 1 && (
        <Card>
          <CardHeader title="Report History" subtitle={`${project.statusReports.length} generated`} />
          <CardBody className="p-0">
            <ul className="divide-y divide-line-soft">
              {project.statusReports.map((r) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-navy">Week of {formatDate(r.weekOf)}</span>
                  <HealthBadge health={r.overallStatus} />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function ReportView({ project, report }: { project: Project; report: StatusReport }) {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-lg bg-grad-navy p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-gold">Weekly Status Report</p>
            <h3 className="font-head text-2xl font-bold">{project.name}</h3>
            <p className="text-sm text-white/60">Week of {formatDate(report.weekOf)}</p>
          </div>
          <HealthBadge health={report.overallStatus} className="text-sm" />
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85">{report.executiveSummary}</p>
      </div>

      {/* RAG strip */}
      <div className="grid grid-cols-3 gap-3">
        <RagCell label="Timeline" value={report.timelineStatus} />
        <RagCell label="Scope" value={report.scopeStatus} />
        <RagCell label="Budget" value={report.budgetStatus} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ReportList title="Completed This Week" items={report.completedThisWeek} />
        <ReportList title="Planned Next Week" items={report.plannedNextWeek} />
        <ReportList title="Key Risks" items={report.keyRisks} danger />
        <ReportList title="Open Issues" items={report.openIssues} danger />
        <ReportList title="Decisions Needed" items={report.decisionsNeeded} accent />
        <ReportList title="Sponsor Support Required" items={report.sponsorSupportRequired} accent />
      </div>

      <ReportList title="Recommended Next Actions" items={report.recommendedNextActions} />
    </div>
  );
}

function RagCell({ label, value }: { label: string; value: Project["health"] }) {
  return (
    <div className="rounded-sm border border-line p-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1.5 flex justify-center">
        <HealthBadge health={value} />
      </div>
    </div>
  );
}

function ReportList({
  title,
  items,
  danger,
  accent,
}: {
  title: string;
  items: string[];
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <h4
        className={`mb-2 border-b pb-1.5 font-head text-base font-semibold ${
          danger ? "border-[#EED3CF] text-health-redtext" : accent ? "border-[#EAE0C2] text-gold-text" : "border-line-soft text-navy"
        }`}
      >
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted">— None —</p>
      ) : (
        <ul className="space-y-1">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink">
              <span className={danger ? "text-health-red" : accent ? "text-gold-text" : "text-emerald"}>•</span>
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function reportToText(project: Project, r: StatusReport): string {
  const line = (t: string, items: string[]) =>
    `\n${t}:\n${items.length ? items.map((i) => `  - ${i}`).join("\n") : "  - None"}`;
  return (
    `WEEKLY STATUS REPORT — ${project.name}\n` +
    `Week of ${formatDate(r.weekOf)}\n` +
    `Overall: ${HEALTH_LABEL[r.overallStatus]}  |  Timeline: ${HEALTH_LABEL[r.timelineStatus]}  |  ` +
    `Scope: ${HEALTH_LABEL[r.scopeStatus]}  |  Budget: ${HEALTH_LABEL[r.budgetStatus]}\n\n` +
    `Executive Summary:\n  ${r.executiveSummary}\n` +
    line("Completed This Week", r.completedThisWeek) +
    line("Planned Next Week", r.plannedNextWeek) +
    line("Key Risks", r.keyRisks) +
    line("Open Issues", r.openIssues) +
    line("Decisions Needed", r.decisionsNeeded) +
    line("Sponsor Support Required", r.sponsorSupportRequired) +
    line("Recommended Next Actions", r.recommendedNextActions)
  );
}
