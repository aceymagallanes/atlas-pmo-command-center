import { NewProjectInput, Project, Stakeholder } from "@/lib/types";
import { todayISO, uid } from "@/lib/utils";
import { generatePhases } from "./phases";
import { generateTasks } from "./tasks";
import { generateMilestones, generateRaid } from "./raid";

function parseStakeholders(raw: string, sponsorName: string, sponsorEmail: string): Stakeholder[] {
  const sponsor: Stakeholder = {
    id: uid("stk"),
    name: sponsorName || "Project Sponsor",
    role: "Sponsor",
    email: sponsorEmail || undefined,
    influence: "high",
  };
  const others = raw
    .split(/\n|,/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map<Stakeholder>((line) => {
      // Supports "Name - Role" or just "Name"
      const [name, role] = line.split(/\s[-–]\s/);
      return {
        id: uid("stk"),
        name: name.trim(),
        role: (role || "Stakeholder").trim(),
        influence: "medium",
      };
    });
  return [sponsor, ...others];
}

/**
 * Turn the wizard input into a fully-populated project:
 * phases, starter tasks, RAID items, milestones and stakeholder records.
 */
export function createProjectFromInput(input: NewProjectInput): Project {
  const now = todayISO();
  const phases = generatePhases(input.type);
  const tasks = generateTasks(input.type, phases);
  const raid = generateRaid(input.type);
  const milestones = generateMilestones(input.targetGoLive || now);
  const stakeholders = parseStakeholders(
    input.knownStakeholders,
    input.sponsorName,
    input.sponsorEmail,
  );

  return {
    id: uid("proj"),
    name: input.name.trim(),
    type: input.type,
    businessProblem: input.businessProblem.trim(),
    desiredOutcome: input.desiredOutcome.trim(),
    sponsorName: input.sponsorName.trim(),
    sponsorEmail: input.sponsorEmail.trim(),
    targetGoLive: input.targetGoLive || now,
    constraints: input.constraints.trim() || undefined,
    health: "green",
    currentPhaseId: phases[0].id,
    createdAt: now,
    stakeholders,
    phases,
    tasks,
    milestones,
    raid,
    meetingNotes: [],
    statusReports: [],
    sponsorDecisions: [],
  };
}
