import { Health, Project, ProjectType } from "@/lib/types";
import { addDays, todayISO, uid } from "@/lib/utils";
import { createProjectFromInput } from "@/lib/generators/project";

interface SeedSpec {
  name: string;
  type: ProjectType;
  businessProblem: string;
  desiredOutcome: string;
  sponsorName: string;
  sponsorEmail: string;
  goLiveOffset: number; // days from today
  stakeholders: string;
  constraints: string;
  health: Health;
  tasksDone: number; // first N tasks marked done
  tasksOverdue: number; // next M non-done tasks pushed into the past
  escalateRaid: number; // first K risks bumped to high/critical
  pendingDecisions: string[];
  addReport: boolean;
  addMeeting: boolean;
}

const SPECS: SeedSpec[] = [
  {
    name: "Sales Ops AI Assistant",
    type: "AI Automation",
    businessProblem:
      "The sales team spends 12+ hours a week manually qualifying inbound leads and drafting follow-ups, causing slow response times and lost deals.",
    desiredOutcome:
      "An AI assistant that auto-qualifies inbound leads and drafts personalised follow-ups, cutting response time from hours to minutes.",
    sponsorName: "Maria Santos",
    sponsorEmail: "maria.santos@northwind.example",
    goLiveOffset: 34,
    stakeholders: "David Chen - Head of Sales\nPriya Nair - RevOps Lead\nTom Walker - IT Security",
    constraints: "Must integrate with existing HubSpot instance. No PII sent to third parties.",
    health: "green",
    tasksDone: 3,
    tasksOverdue: 0,
    escalateRaid: 1,
    pendingDecisions: [],
    addReport: true,
    addMeeting: true,
  },
  {
    name: "Customer 360 CRM Rollout",
    type: "CRM Automation",
    businessProblem:
      "Customer data is fragmented across spreadsheets and three disconnected tools, so no one has a single view of the customer.",
    desiredOutcome:
      "A unified CRM with automated lead lifecycle and a single customer record adopted across sales, service and marketing.",
    sponsorName: "James O'Brien",
    sponsorEmail: "james.obrien@northwind.example",
    goLiveOffset: 21,
    stakeholders: "Elena Rossi - Marketing\nSam Patel - Customer Service\nGrace Lim - Data Team",
    constraints: "Go-live must land before Q4 sales push. Limited data-team availability.",
    health: "amber",
    tasksDone: 4,
    tasksOverdue: 2,
    escalateRaid: 1,
    pendingDecisions: ["Approve additional data-cleansing budget (est. 3 days)"],
    addReport: true,
    addMeeting: true,
  },
  {
    name: "Executive KPI Dashboard",
    type: "Dashboard Implementation",
    businessProblem:
      "Leadership relies on manually compiled monthly slides that are always two weeks out of date by the time they are reviewed.",
    desiredOutcome:
      "A live executive dashboard with automated data refresh and drill-down into the core operational KPIs.",
    sponsorName: "Aisha Khan",
    sponsorEmail: "aisha.khan@northwind.example",
    goLiveOffset: 12,
    stakeholders: "Ben Carter - Finance\nLucia Gomez - Operations",
    constraints: "Data warehouse refresh only runs nightly.",
    health: "green",
    tasksDone: 5,
    tasksOverdue: 0,
    escalateRaid: 0,
    pendingDecisions: [],
    addReport: true,
    addMeeting: false,
  },
  {
    name: "Finance Reporting Automation",
    type: "Reporting Automation",
    businessProblem:
      "Month-end close takes nine days because five analysts hand-build the same reconciliation reports from raw exports.",
    desiredOutcome:
      "Automated month-end reporting pipeline that reduces close from nine days to three with a full audit trail.",
    sponsorName: "Robert Nguyen",
    sponsorEmail: "robert.nguyen@northwind.example",
    goLiveOffset: -4,
    stakeholders: "Hannah Ford - Finance Controller\nOmar Aziz - Audit",
    constraints: "Figures must reconcile exactly to the legacy report for two cycles.",
    health: "red",
    tasksDone: 6,
    tasksOverdue: 3,
    escalateRaid: 2,
    pendingDecisions: [
      "Approve two-cycle parallel run (delays go-live by 2 weeks)",
      "Confirm sign-off authority for automated figures",
    ],
    addReport: true,
    addMeeting: true,
  },
  {
    name: "Onboarding Process Redesign",
    type: "Business Process Improvement",
    businessProblem:
      "New-hire onboarding is inconsistent across regions, taking 3–6 weeks and driving early attrition.",
    desiredOutcome:
      "A standardised, largely automated onboarding process that gets new hires productive within one week.",
    sponsorName: "Sofia Marchetti",
    sponsorEmail: "sofia.marchetti@northwind.example",
    goLiveOffset: 45,
    stakeholders: "HR Ops Team\nRegional Managers",
    constraints: "Must comply with regional labour regulations.",
    health: "green",
    tasksDone: 2,
    tasksOverdue: 0,
    escalateRaid: 0,
    pendingDecisions: [],
    addReport: false,
    addMeeting: false,
  },
];

const SAMPLE_NOTES = `Weekly steering call — attendees: PM, sponsor, sales lead.
David to share the updated lead scoring criteria by Friday.
Decision: we agreed to go with the HubSpot native integration rather than a custom build.
Risk: the security review could delay us if IT can't allocate a reviewer this sprint.
Issue: the sandbox environment is not working, blocking the integration test.
Priya will schedule the UAT sessions for next week.
Escalate: sponsor needs to confirm the additional data-cleansing budget urgently.`;

function buildProject(spec: SeedSpec): Project {
  const p = createProjectFromInput({
    name: spec.name,
    type: spec.type,
    businessProblem: spec.businessProblem,
    desiredOutcome: spec.desiredOutcome,
    sponsorName: spec.sponsorName,
    sponsorEmail: spec.sponsorEmail,
    targetGoLive: addDays(todayISO(), spec.goLiveOffset),
    knownStakeholders: spec.stakeholders,
    constraints: spec.constraints,
  });

  p.health = spec.health;

  // Mark some tasks done.
  p.tasks.slice(0, spec.tasksDone).forEach((t) => (t.status = "done"));
  // Push some not-done tasks into the past to create overdue signals.
  p.tasks
    .filter((t) => t.status !== "done")
    .slice(0, spec.tasksOverdue)
    .forEach((t, i) => {
      t.dueDate = addDays(todayISO(), -(i + 2));
      if (i === 0) t.status = "blocked";
    });

  // Advance the current phase based on progress.
  if (spec.tasksDone >= 5 && p.phases[2]) {
    p.phases[0].status = "complete";
    p.phases[1].status = "complete";
    p.phases[2].status = "in_progress";
    p.currentPhaseId = p.phases[2].id;
  } else if (spec.tasksDone >= 3 && p.phases[1]) {
    p.phases[0].status = "complete";
    p.phases[1].status = "in_progress";
    p.currentPhaseId = p.phases[1].id;
  }

  // Escalate a few risks to high/critical.
  p.raid
    .filter((r) => r.category === "risk")
    .slice(0, spec.escalateRaid)
    .forEach((r, i) => {
      r.impact = i === 0 ? "critical" : "high";
      r.status = "mitigating";
    });

  // Sponsor decisions.
  p.sponsorDecisions = spec.pendingDecisions.map((title) => ({
    id: uid("dec"),
    title,
    requestedOn: addDays(todayISO(), -2),
    status: "pending" as const,
  }));

  // At-risk milestone if the project is amber/red.
  if (spec.health !== "green" && p.milestones[1]) {
    p.milestones[1].status = spec.health === "red" ? "slipped" : "at_risk";
  }

  if (spec.addMeeting) {
    p.meetingNotes = [
      {
        id: uid("mtg"),
        title: "Weekly Steering Call",
        date: addDays(todayISO(), -3),
        rawNotes: SAMPLE_NOTES,
        createdAt: addDays(todayISO(), -3),
        extract: {
          summary:
            "Weekly steering call covering integration approach and delivery risks. The meeting produced 1 decision, 2 action items, 1 risk, 1 issue and 1 escalation.",
          actionItems: [
            { id: uid("act"), title: "Share updated lead scoring criteria by Friday", owner: "David" },
            { id: uid("act"), title: "Schedule the UAT sessions for next week", owner: "Priya" },
          ],
          risks: ["Security review could delay us if IT can't allocate a reviewer this sprint."],
          issues: ["The sandbox environment is not working, blocking the integration test."],
          decisions: ["Go with the HubSpot native integration rather than a custom build."],
          escalations: ["Sponsor needs to confirm the additional data-cleansing budget urgently."],
        },
      },
    ];
  }

  return p;
}

export function seedProjects(): Project[] {
  return SPECS.map(buildProject);
}
