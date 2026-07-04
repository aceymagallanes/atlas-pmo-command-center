import { Milestone, ProjectType, RaidImpact, RaidItem } from "@/lib/types";
import { addDays, todayISO, uid } from "@/lib/utils";

interface RaidSeed {
  category: RaidItem["category"];
  title: string;
  impact: RaidImpact;
  likelihood?: "low" | "medium" | "high";
  mitigation?: string;
}

const COMMON: RaidSeed[] = [
  {
    category: "risk",
    title: "Stakeholder availability may delay decisions",
    impact: "medium",
    likelihood: "medium",
    mitigation: "Book recurring steering slots up front; set decision SLAs.",
  },
  {
    category: "assumption",
    title: "Sponsor is empowered to approve scope and budget",
    impact: "medium",
  },
  {
    category: "dependency",
    title: "Access to source systems / data must be granted by IT",
    impact: "high",
    mitigation: "Raise access request in week 1; track as blocking dependency.",
  },
];

const BY_TYPE: Record<ProjectType, RaidSeed[]> = {
  "AI Automation": [
    {
      category: "risk",
      title: "Model output accuracy may not meet acceptance threshold",
      impact: "high",
      likelihood: "medium",
      mitigation: "Define measurable accuracy gate; keep human-in-the-loop fallback.",
    },
    {
      category: "risk",
      title: "Change resistance from staff whose tasks are automated",
      impact: "medium",
      likelihood: "medium",
      mitigation: "Position as augmentation; involve team early in design.",
    },
  ],
  "CRM Automation": [
    {
      category: "issue",
      title: "Existing CRM data quality is poor (duplicates, gaps)",
      impact: "high",
      mitigation: "Run data-cleansing sprint before migration.",
    },
    {
      category: "dependency",
      title: "Requires CRM admin licences and API access",
      impact: "medium",
    },
  ],
  "Reporting Automation": [
    {
      category: "risk",
      title: "Automated figures may diverge from legacy manual reports",
      impact: "high",
      likelihood: "medium",
      mitigation: "Parallel-run for two cycles and reconcile variances.",
    },
    {
      category: "assumption",
      title: "Source data is available at the required granularity",
      impact: "medium",
    },
  ],
  "Dashboard Implementation": [
    {
      category: "risk",
      title: "Undefined or shifting KPIs cause dashboard rework",
      impact: "medium",
      likelihood: "medium",
      mitigation: "Lock KPI definitions with sponsor sign-off before build.",
    },
    {
      category: "dependency",
      title: "Depends on data warehouse / source refresh cadence",
      impact: "medium",
    },
  ],
  "Business Process Improvement": [
    {
      category: "risk",
      title: "Improvements may not sustain after project handover",
      impact: "high",
      likelihood: "medium",
      mitigation: "Build control plan and assign a process owner.",
    },
    {
      category: "issue",
      title: "Baseline metrics are not currently measured",
      impact: "medium",
      mitigation: "Stand up interim measurement before improve phase.",
    },
  ],
  "Software Implementation": [
    {
      category: "risk",
      title: "Integration complexity underestimated in planning",
      impact: "high",
      likelihood: "medium",
      mitigation: "Run an early integration spike to de-risk estimates.",
    },
    {
      category: "dependency",
      title: "Vendor support required for configuration and licences",
      impact: "medium",
    },
  ],
};

export function generateRaid(type: ProjectType): RaidItem[] {
  const now = todayISO();
  return [...COMMON, ...BY_TYPE[type]].map((s) => ({
    id: uid("raid"),
    category: s.category,
    title: s.title,
    impact: s.impact,
    likelihood: s.likelihood,
    mitigation: s.mitigation,
    status: "open",
    createdAt: now,
  }));
}

/** Two starter milestones: a design gate and the target go-live. */
export function generateMilestones(targetGoLive: string): Milestone[] {
  const now = todayISO();
  return [
    {
      id: uid("ms"),
      name: "Solution design signed off",
      dueDate: addDays(now, 12),
      status: "on_track",
    },
    {
      id: uid("ms"),
      name: "Go-live",
      dueDate: targetGoLive,
      status: "on_track",
    },
  ];
}
