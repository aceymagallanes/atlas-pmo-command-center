"use client";

import { useState } from "react";
import { Sparkles, Wand2, CheckSquare, ShieldAlert, Bug, Gavel, ArrowUpRight } from "lucide-react";
import { MeetingExtract, MeetingNote, Project } from "@/lib/types";
import { useStore } from "@/lib/store";
import { parseMeetingNotes } from "@/lib/ai/parseMeetingNotes";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { formatDate, todayISO, uid } from "@/lib/utils";

const SAMPLE = `Weekly steering call — attendees: PM, sponsor, sales lead.
David to share the updated lead scoring criteria by Friday.
Decision: we agreed to go with the HubSpot native integration rather than a custom build.
Risk: the security review could delay us if IT can't allocate a reviewer this sprint.
Issue: the sandbox environment is not working, blocking the integration test.
Priya will schedule the UAT sessions for next week.
Escalate: sponsor needs to confirm the additional data-cleansing budget urgently.`;

export function MeetingsTab({ project }: { project: Project }) {
  const addMeetingNote = useStore((s) => s.addMeetingNote);
  const [title, setTitle] = useState("");
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<MeetingExtract | null>(null);

  async function handleExtract() {
    if (!raw.trim()) return;
    setBusy(true);
    setPreview(null);
    const extract = await parseMeetingNotes(raw);
    setPreview(extract);
    setBusy(false);
  }

  function handleSave() {
    if (!preview) return;
    const note: MeetingNote = {
      id: uid("mtg"),
      title: title.trim() || "Meeting Notes",
      date: todayISO(),
      rawNotes: raw,
      extract: preview,
      createdAt: todayISO(),
    };
    addMeetingNote(project.id, note);
    setTitle("");
    setRaw("");
    setPreview(null);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Input */}
      <Card>
        <CardHeader
          title="Meeting Notes Assistant"
          subtitle="Paste messy notes — Atlas extracts the structure"
          icon={<Wand2 size={16} />}
          action={
            <button onClick={() => setRaw(SAMPLE)} className="text-xs font-semibold text-emerald hover:underline">
              Load sample
            </button>
          }
        />
        <CardBody className="space-y-4">
          <Field label="Meeting Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly Steering Call" />
          </Field>
          <Field label="Raw Notes" hint="Paste anything — bullet points, transcript, scribbles.">
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="min-h-[220px]"
              placeholder="Paste your meeting notes here…"
            />
          </Field>
          <div className="flex items-center gap-3">
            <Button onClick={handleExtract} disabled={busy || !raw.trim()}>
              <Sparkles size={16} /> {busy ? "Analysing…" : "Extract with AI"}
            </Button>
            <span className="text-xs text-muted">Mock AI · swap for Claude API later</span>
          </div>
        </CardBody>
      </Card>

      {/* Output */}
      <Card>
        <CardHeader title="Extracted Intelligence" subtitle="Review, then save to the project" />
        <CardBody className="space-y-4">
          {!preview && !busy && (
            <p className="py-10 text-center text-sm text-muted">
              Run the assistant to see the summary, actions, risks, issues, decisions and escalations.
            </p>
          )}
          {busy && (
            <div className="flex flex-col items-center gap-3 py-10 text-muted">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-emerald" />
              <p className="text-sm">Extracting structure from your notes…</p>
            </div>
          )}
          {preview && (
            <>
              <div className="rounded-sm border border-emerald-tint bg-emerald-soft p-3">
                <p className="eyebrow mb-1 text-emerald-deep">Summary</p>
                <p className="text-sm text-emerald-deep/90">{preview.summary}</p>
              </div>

              <ExtractList icon={<CheckSquare size={15} />} label="Action Items" tone="emerald"
                items={preview.actionItems.map((a) => (a.owner ? `${a.owner}: ${a.title}` : a.title))} />
              <ExtractList icon={<ShieldAlert size={15} />} label="Risks" tone="red" items={preview.risks} />
              <ExtractList icon={<Bug size={15} />} label="Issues" tone="amber" items={preview.issues} />
              <ExtractList icon={<Gavel size={15} />} label="Decisions" tone="navy" items={preview.decisions} />
              <ExtractList icon={<ArrowUpRight size={15} />} label="Escalations" tone="red" items={preview.escalations} />

              <Button variant="gold" onClick={handleSave} className="w-full">
                Save to Project
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      {/* History */}
      {project.meetingNotes.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader title="Saved Meeting Notes" subtitle={`${project.meetingNotes.length} recorded`} />
          <CardBody className="p-0">
            <ul className="divide-y divide-line-soft">
              {project.meetingNotes.map((n) => (
                <li key={n.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-navy">{n.title}</p>
                    <span className="text-xs text-muted">{formatDate(n.date)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{n.extract.summary}</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted">
                    <span>{n.extract.actionItems.length} actions</span>
                    <span>{n.extract.risks.length} risks</span>
                    <span>{n.extract.issues.length} issues</span>
                    <span>{n.extract.decisions.length} decisions</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

const TONE: Record<string, string> = {
  emerald: "text-emerald",
  red: "text-health-red",
  amber: "text-health-amber",
  navy: "text-navy",
};

function ExtractList({
  icon,
  label,
  items,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  tone: string;
}) {
  return (
    <div>
      <div className={`mb-1.5 flex items-center gap-2 ${TONE[tone]}`}>
        {icon}
        <span className="text-sm font-semibold">
          {label} <span className="text-muted">({items.length})</span>
        </span>
      </div>
      {items.length === 0 ? (
        <p className="pl-6 text-xs text-muted">None detected.</p>
      ) : (
        <ul className="space-y-1 pl-6">
          {items.map((it, i) => (
            <li key={i} className="list-disc text-sm text-ink marker:text-muted">
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
