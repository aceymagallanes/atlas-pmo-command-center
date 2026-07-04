import { ActionItem, MeetingExtract } from "@/lib/types";
import { uid } from "@/lib/utils";

// ============================================================================
// MOCK AI — Meeting Notes Assistant
// ----------------------------------------------------------------------------
// This is a heuristic stand-in for a real LLM call. When you are ready to go
// live, replace the body of `parseMeetingNotes` with a call to the Claude API
// (claude-opus-4-8 / claude-sonnet-4-6) that returns the same MeetingExtract
// shape. Every caller in the app depends only on that shape, so nothing else
// needs to change. See docs/ARCHITECTURE.md → "AI-ready architecture".
// ============================================================================

const OWNER_HINT = /\b(?:@|owner:|assigned to|—|:-)\s*([A-Z][a-zA-Z]+)/;
const NAME_LEAD = /^([A-Z][a-zA-Z]+)\s+(?:to|will|should|needs to|is going to)\b/;

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/)
    .map((l) => l.replace(/^[\s\-*•·\d.)]+/, "").trim())
    .filter((l) => l.length > 0);
}

function extractOwner(line: string): string | undefined {
  const m = line.match(OWNER_HINT) || line.match(NAME_LEAD);
  return m ? m[1] : undefined;
}

function has(line: string, words: string[]): boolean {
  const l = line.toLowerCase();
  return words.some((w) => l.includes(w));
}

/**
 * Extract structured intelligence from messy meeting notes.
 * Returns a promise so the interface already matches an async LLM call.
 */
export async function parseMeetingNotes(raw: string): Promise<MeetingExtract> {
  // Simulate a little latency so the demo UI shows its loading state.
  await new Promise((r) => setTimeout(r, 650));

  const lines = splitLines(raw);

  const actionItems: ActionItem[] = [];
  const risks: string[] = [];
  const issues: string[] = [];
  const decisions: string[] = [];
  const escalations: string[] = [];

  for (const line of lines) {
    if (has(line, ["escalate", "escalation", "urgent", "sponsor needs to", "leadership must"])) {
      escalations.push(line);
      continue;
    }
    if (
      has(line, [
        "action",
        "to do",
        "todo",
        "follow up",
        "follow-up",
        "will send",
        "will prepare",
        "will schedule",
        "next step",
      ]) ||
      NAME_LEAD.test(line)
    ) {
      actionItems.push({ id: uid("act"), title: line, owner: extractOwner(line) });
      continue;
    }
    if (has(line, ["risk", "concern", "worried", "might fail", "could delay", "threat"])) {
      risks.push(line);
      continue;
    }
    if (has(line, ["decided", "decision", "agreed", "we will go with", "approved to", "sign off", "signed off"])) {
      decisions.push(line);
      continue;
    }
    if (has(line, ["issue", "problem", "blocker", "blocked", "broken", "not working", "bug", "delay"])) {
      issues.push(line);
      continue;
    }
  }

  const summary = buildSummary(lines, {
    actions: actionItems.length,
    risks: risks.length,
    issues: issues.length,
    decisions: decisions.length,
    escalations: escalations.length,
  });

  return { summary, actionItems, risks, issues, decisions, escalations };
}

function buildSummary(
  lines: string[],
  counts: { actions: number; risks: number; issues: number; decisions: number; escalations: number },
): string {
  const lead = lines.slice(0, 2).join(" ");
  const trimmed = lead.length > 240 ? lead.slice(0, 237) + "…" : lead;
  const parts: string[] = [];
  if (counts.decisions) parts.push(`${counts.decisions} decision${counts.decisions > 1 ? "s" : ""}`);
  if (counts.actions) parts.push(`${counts.actions} action item${counts.actions > 1 ? "s" : ""}`);
  if (counts.risks) parts.push(`${counts.risks} risk${counts.risks > 1 ? "s" : ""}`);
  if (counts.issues) parts.push(`${counts.issues} issue${counts.issues > 1 ? "s" : ""}`);
  if (counts.escalations) parts.push(`${counts.escalations} escalation${counts.escalations > 1 ? "s" : ""}`);
  const tail = parts.length
    ? ` The meeting produced ${parts.join(", ").replace(/, ([^,]*)$/, " and $1")}.`
    : "";
  return (trimmed || "Meeting notes processed.") + tail;
}
